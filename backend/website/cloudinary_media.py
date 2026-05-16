"""Cloudinary URL helpers for API responses."""

from __future__ import annotations

import logging

import cloudinary.utils

logger = logging.getLogger(__name__)


def resolve_cloudinary_image_reference(value: str | None) -> str | None:
    """
  Accept a full HTTPS Cloudinary image URL or an image public_id.
  The same value can be stored on many FounderVideo rows (shared preview).
    """
    if not value or not str(value).strip():
        return None
    raw = str(value).strip()
    if raw.startswith(("http://", "https://")):
        return raw
    try:
        url, _ = cloudinary.utils.cloudinary_url(
            raw,
            resource_type="image",
            secure=True,
        )
        return url
    except Exception:
        logger.exception("Cloudinary image URL failed (ref=%r)", raw)
        return None
