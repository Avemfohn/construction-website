from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
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
    founder_video_poster_ref = models.CharField(
        max_length=512,
        blank=True,
        help_text=(
            "Varsayılan kentsel dönüşüm video önizlemesi: Cloudinary görsel URL’si veya "
            "public_id. Her videoda ayrı önizleme yoksa bu kullanılır."
        ),
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


class ProjectUpdate(models.Model):
    """Dated construction progress post for a single project."""

    project = models.ForeignKey(
        Project,
        related_name="updates",
        on_delete=models.CASCADE,
    )
    title = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(default=timezone.now)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-published_at", "sort_order", "-id"]
        verbose_name = "Project update"
        verbose_name_plural = "Project updates"

    def __str__(self) -> str:
        return f"{self.project.title} — {self.title}"


class ProjectUpdateMedia(models.Model):
    """Photo or video attached to a project update (one asset per row)."""

    update = models.ForeignKey(
        ProjectUpdate,
        related_name="media",
        on_delete=models.CASCADE,
    )
    image = CloudinaryField(
        "image",
        blank=True,
        null=True,
        help_text="Cloudinary’e yüklenen görsel (video ile birlikte kullanmayın).",
    )
    video = CloudinaryField(
        "video",
        resource_type="video",
        blank=True,
        null=True,
        help_text="Cloudinary’e yüklenen video (görsel ile birlikte kullanmayın).",
    )
    caption = models.CharField(max_length=255, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]
        verbose_name = "Project update media"
        verbose_name_plural = "Project update media"

    def __str__(self) -> str:
        kind = "video" if self.video else "image"
        return f"{self.update} — {kind} #{self.pk}"

    def clean(self):
        super().clean()
        has_image = bool(self.image)
        has_video = bool(self.video)
        if has_image == has_video:
            raise ValidationError(
                "Her medya satırında ya bir görsel ya da bir video olmalıdır (ikisi birden veya hiçbiri olamaz)."
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


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
    poster_ref = models.CharField(
        max_length=512,
        blank=True,
        verbose_name="Preview image URL or public_id",
        help_text=(
            "Cloudinary’deki görselin tam URL’si veya public_id. "
            "Aynı değeri birden fazla videoda kullanabilirsiniz (ortak önizleme)."
        ),
    )
    poster = CloudinaryField(
        "image",
        blank=True,
        null=True,
        help_text="İsteğe bağlı: önizlemi admin’den yükleyin (URL alanı yerine veya onun üzerine yazar).",
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
