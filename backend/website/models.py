from django.db import models
from cloudinary.models import CloudinaryField


class SiteSettings(models.Model):
    """
    Singleton (pk=1): global site assets editable in admin.
    Hero background video for the marketing homepage (Cloudinary).
    """

    hero_video = CloudinaryField(
        "video",
        resource_type="video",
        blank=True,
        null=True,
        help_text="Cloudinary’e yüklenen MP4 (H.264 önerilir).",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    def __str__(self) -> str:
        return "Site settings"

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Project(models.Model):
    """Construction / development project (ongoing or completed)."""

    class Status(models.TextChoices):
        ONGOING = "ongoing", "Ongoing"
        COMPLETED = "completed", "Completed"

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, db_index=True)
    summary = models.CharField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ONGOING,
        db_index=True,
    )
    location = models.CharField(max_length=255, blank=True)
    features = models.JSONField(
        default=list,
        blank=True,
        help_text='List of feature strings, e.g. ["Parking", "Sea view"]',
    )
    featured = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "-updated_at"]

    def __str__(self) -> str:
        return self.title


class ProjectImage(models.Model):
    """Gallery image for a project."""

    project = models.ForeignKey(
        Project,
        related_name="images",
        on_delete=models.CASCADE,
    )
    image = CloudinaryField(
        "image",
        blank=False,
        help_text="Cloudinary’e yüklenen görsel.",
    )
    caption = models.CharField(max_length=255, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return f"{self.project.title} — {self.pk}"


class Announcement(models.Model):
    """
    Founder's Corner: site visits, greetings, updates.
    Image is optional; supports multipart image uploads from mobile clients.
    """

    title = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    image = CloudinaryField(
        "image",
        blank=True,
        null=True,
        help_text="İsteğe bağlı kapak görseli (Cloudinary).",
    )
    video = CloudinaryField(
        "video",
        resource_type="video",
        blank=True,
        null=True,
        help_text="İsteğe bağlı video (Cloudinary).",
    )
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-id"]
        verbose_name = "Announcement / media"
        verbose_name_plural = "Announcements / media"

    def __str__(self) -> str:
        return self.title


class FAQ(models.Model):
    """FAQ entries (e.g. urban renewal trust page)."""

    class Section(models.TextChoices):
        GENERAL = "general", "General"
        URBAN_RENEWAL = "urban_renewal", "Urban renewal"

    question = models.CharField(max_length=500)
    answer = models.TextField()
    section = models.CharField(
        max_length=32,
        choices=Section.choices,
        default=Section.URBAN_RENEWAL,
        db_index=True,
    )
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["section", "sort_order", "id"]
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self) -> str:
        return self.question[:80]


class FounderVideo(models.Model):
    """
    Ayhan Ercan soru–cevap videoları. Dosyalar Cloudinary üzerinden yüklenir
    (Django admin); site /kentsel-dönüşüm sayfasında listelenir.
    """

    title = models.CharField(
        max_length=255,
        blank=True,
        help_text="İsteğe bağlı başlık (oynatıcının üstünde).",
    )
    video = CloudinaryField(
        "video",
        resource_type="video",
        blank=True,
        null=True,
        help_text="Cloudinary’e yüklenen video (tercihen MP4 / tarayıcı uyumlu).",
    )
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "id"]
        verbose_name = "Founder video"
        verbose_name_plural = "Founder videos"

    def __str__(self) -> str:
        return self.title or f"Founder video #{self.pk}"
