from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from website.cloudinary_cleanup import (
    destroy_cloudinary_stored,
    destroy_replaced_cloudinary,
)
from website.models import (
    Announcement,
    FounderVideo,
    ProjectImage,
    ProjectUpdateMedia,
    SiteSettings,
)


@receiver(pre_save, sender=SiteSettings)
def site_settings_cloudinary_pre_save(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        old = SiteSettings.objects.get(pk=instance.pk)
    except SiteSettings.DoesNotExist:
        return
    destroy_replaced_cloudinary(
        old.hero_video, instance.hero_video, default_resource_type="video"
    )


@receiver(pre_save, sender=ProjectImage)
def project_image_cloudinary_pre_save(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        old = ProjectImage.objects.get(pk=instance.pk)
    except ProjectImage.DoesNotExist:
        return
    destroy_replaced_cloudinary(old.image, instance.image, default_resource_type="image")


@receiver(pre_save, sender=Announcement)
def announcement_cloudinary_pre_save(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        old = Announcement.objects.get(pk=instance.pk)
    except Announcement.DoesNotExist:
        return
    destroy_replaced_cloudinary(old.image, instance.image, default_resource_type="image")
    destroy_replaced_cloudinary(old.video, instance.video, default_resource_type="video")


@receiver(pre_save, sender=FounderVideo)
def founder_video_cloudinary_pre_save(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        old = FounderVideo.objects.get(pk=instance.pk)
    except FounderVideo.DoesNotExist:
        return
    destroy_replaced_cloudinary(old.video, instance.video, default_resource_type="video")
    destroy_replaced_cloudinary(old.poster, instance.poster, default_resource_type="image")


@receiver(post_delete, sender=ProjectImage)
def delete_project_image_from_cloudinary(sender, instance, **kwargs):
    destroy_cloudinary_stored(instance.image, default_resource_type="image")


@receiver(pre_save, sender=ProjectUpdateMedia)
def project_update_media_cloudinary_pre_save(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        old = ProjectUpdateMedia.objects.get(pk=instance.pk)
    except ProjectUpdateMedia.DoesNotExist:
        return
    destroy_replaced_cloudinary(old.image, instance.image, default_resource_type="image")
    destroy_replaced_cloudinary(old.video, instance.video, default_resource_type="video")


@receiver(post_delete, sender=ProjectUpdateMedia)
def delete_project_update_media_from_cloudinary(sender, instance, **kwargs):
    destroy_cloudinary_stored(instance.image, default_resource_type="image")
    destroy_cloudinary_stored(instance.video, default_resource_type="video")


@receiver(post_delete, sender=Announcement)
def delete_announcement_media_from_cloudinary(sender, instance, **kwargs):
    destroy_cloudinary_stored(instance.image, default_resource_type="image")
    destroy_cloudinary_stored(instance.video, default_resource_type="video")


@receiver(post_delete, sender=FounderVideo)
def delete_founder_video_from_cloudinary(sender, instance, **kwargs):
    destroy_cloudinary_stored(instance.video, default_resource_type="video")
    destroy_cloudinary_stored(instance.poster, default_resource_type="image")
