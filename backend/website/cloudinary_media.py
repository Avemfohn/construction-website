"""Cloudinary URL helpers for API responses."""

from __future__ import annotations

import logging

import cloudinary.utils

logger = logging.getLogger(__name__)

# Default Cloudinary image public_id for project-update video previews (before play).
DEFAULT_PROJECT_UPDATE_VIDEO_POSTER_ID = "dgppgkttceva7syh0t4h"


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


def resolve_project_update_video_poster_url(poster_ref: str | None) -> str | None:
    """Poster for update videos: custom ref, else site default public_id."""
    custom = (poster_ref or "").strip()
    ref = custom or DEFAULT_PROJECT_UPDATE_VIDEO_POSTER_ID
    return resolve_cloudinary_image_reference(ref)
