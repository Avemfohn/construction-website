"""Remove Cloudinary assets when DB rows are deleted (Django does not do this automatically)."""

from __future__ import annotations

import logging
import re

import cloudinary.uploader
from cloudinary import CloudinaryResource
from cloudinary.models import CLOUDINARY_FIELD_DB_RE

logger = logging.getLogger(__name__)


def _coerce_resource(value, default_resource_type: str) -> CloudinaryResource | None:
    if value is None or value is False:
        return None
    if isinstance(value, CloudinaryResource):
        return value
    if isinstance(value, str):
        m = re.match(CLOUDINARY_FIELD_DB_RE, value)
        if not m:
            return None
        return CloudinaryResource(
            type=m.group("type") or "upload",
            resource_type=m.group("resource_type") or default_resource_type,
            version=m.group("version"),
            public_id=m.group("public_id"),
            format=m.group("format"),
        )
    return None


def destroy_cloudinary_stored(value, *, default_resource_type: str = "image") -> None:
    """Best-effort delete of one stored CloudinaryField value (ignore failures, log)."""
    res = _coerce_resource(value, default_resource_type)
    if not res or not res.public_id:
        return
    resource_type = res.resource_type or default_resource_type
    upload_type = res.type or "upload"
    try:
        cloudinary.uploader.destroy(
            res.public_id,
            resource_type=resource_type,
            type=upload_type,
            invalidate=True,
        )
    except Exception:
        logger.exception(
            "Cloudinary destroy failed (public_id=%r, resource_type=%r)",
            res.public_id,
            resource_type,
        )
