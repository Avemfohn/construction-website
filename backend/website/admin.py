from django import forms
from django.contrib import admin
from django.core.files.uploadedfile import UploadedFile

from .models import (
    Announcement,
    FAQ,
    FounderVideo,
    Project,
    ProjectImage,
    ProjectUpdate,
    ProjectUpdateMedia,
    SiteSettings,
)

admin.site.site_header = "Ercan İnşaat"
admin.site.site_title = "Ercan İnşaat"


class SiteSettingsAdminForm(forms.ModelForm):
    """
    Cloudinary's default widget keeps the current asset in a hidden input, so clearing the
    file input does not remove it. This checkbox forces the field empty and triggers
    Cloudinary cleanup in website.signals (pre_save).
    """

    clear_hero_video = forms.BooleanField(
        required=False,
        label="Remove hero video from Cloudinary",
    )

    class Meta:
        model = SiteSettings
        fields = "__all__"

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("clear_hero_video") and not isinstance(
            cleaned.get("hero_video"), UploadedFile
        ):
            cleaned["hero_video"] = None
        return cleaned


class AnnouncementAdminForm(forms.ModelForm):
    clear_image = forms.BooleanField(
        required=False,
        label="Remove image from Cloudinary",
    )
    clear_video = forms.BooleanField(
        required=False,
        label="Remove video from Cloudinary",
    )

    class Meta:
        model = Announcement
        fields = "__all__"

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("clear_image") and not isinstance(cleaned.get("image"), UploadedFile):
            cleaned["image"] = None
        if cleaned.get("clear_video") and not isinstance(cleaned.get("video"), UploadedFile):
            cleaned["video"] = None
        return cleaned


class FounderVideoAdminForm(forms.ModelForm):
    clear_video = forms.BooleanField(
        required=False,
        label="Remove video from Cloudinary",
    )
    clear_poster = forms.BooleanField(
        required=False,
        label="Remove preview image from Cloudinary",
    )

    class Meta:
        model = FounderVideo
        fields = "__all__"

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("clear_video") and not isinstance(cleaned.get("video"), UploadedFile):
            cleaned["video"] = None
        if cleaned.get("clear_poster") and not isinstance(cleaned.get("poster"), UploadedFile):
            cleaned["poster"] = None
        return cleaned


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    form = SiteSettingsAdminForm
    list_display = ("__str__", "updated_at")
    fields = ("hero_video", "clear_hero_video", "founder_video_poster_ref")

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 0


class ProjectUpdateMediaInlineForm(forms.ModelForm):
    class Meta:
        model = ProjectUpdateMedia
        fields = ("image", "video", "caption", "sort_order")

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("DELETE"):
            return cleaned
        has_image = bool(cleaned.get("image"))
        has_video = bool(cleaned.get("video"))
        if has_image == has_video:
            raise forms.ValidationError(
                "Her satırda ya bir görsel ya da bir video yükleyin (ikisi birden veya hiçbiri olamaz)."
            )
        return cleaned


class ProjectUpdateMediaInline(admin.TabularInline):
    model = ProjectUpdateMedia
    form = ProjectUpdateMediaInlineForm
    extra = 1
    fields = ("image", "video", "caption", "sort_order")


class ProjectUpdateInline(admin.StackedInline):
    model = ProjectUpdate
    extra = 0
    show_change_link = True
    fields = ("title", "body", "is_published", "published_at", "sort_order")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "featured", "sort_order", "updated_at")
    list_filter = ("status", "featured")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "location", "summary")
    inlines = [ProjectImageInline, ProjectUpdateInline]


@admin.register(ProjectUpdate)
class ProjectUpdateAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "is_published", "published_at", "sort_order")
    list_filter = ("is_published", "project")
    search_fields = ("title", "body", "project__title")
    date_hierarchy = "published_at"
    inlines = [ProjectUpdateMediaInline]
    fields = ("project", "title", "body", "is_published", "published_at", "sort_order")


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ("project", "caption", "sort_order")
    list_filter = ("project",)


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    form = AnnouncementAdminForm
    list_display = ("title", "is_published", "published_at")
    list_filter = ("is_published",)
    search_fields = ("title", "body")
    fields = (
        "title",
        "body",
        "image",
        "clear_image",
        "video",
        "clear_video",
        "is_published",
    )


@admin.register(FounderVideo)
class FounderVideoAdmin(admin.ModelAdmin):
    form = FounderVideoAdminForm
    list_display = ("title", "sort_order", "is_published", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("title",)
    ordering = ("sort_order", "id")
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "video",
                    "clear_video",
                    "sort_order",
                    "is_published",
                ),
            },
        ),
        (
            "Önizleme (isteğe bağlı)",
            {
                "description": (
                    "Cloudinary’deki bir görselin URL’sini veya public_id’sini yapıştırın — "
                    "aynı değeri istediğiniz kadar videoda tekrar kullanabilirsiniz. "
                    "Boş bırakırsanız Site settings’teki varsayılan önizleme (varsa) "
                    "veya yüklenen görsel kullanılır."
                ),
                "fields": ("poster_ref", "poster", "clear_poster"),
            },
        ),
    )


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "section", "sort_order", "is_published")
    list_filter = ("section", "is_published")
