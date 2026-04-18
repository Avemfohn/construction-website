from django.db.models.signals import post_delete
from django.dispatch import receiver

from website.cloudinary_cleanup import destroy_cloudinary_stored
from website.models import Announcement, FounderVideo, ProjectImage


@receiver(post_delete, sender=ProjectImage)
def delete_project_image_from_cloudinary(sender, instance, **kwargs):
    destroy_cloudinary_stored(instance.image, default_resource_type="image")


@receiver(post_delete, sender=Announcement)
def delete_announcement_media_from_cloudinary(sender, instance, **kwargs):
    destroy_cloudinary_stored(instance.image, default_resource_type="image")
    destroy_cloudinary_stored(instance.video, default_resource_type="video")


@receiver(post_delete, sender=FounderVideo)
def delete_founder_video_from_cloudinary(sender, instance, **kwargs):
    destroy_cloudinary_stored(instance.video, default_resource_type="video")
