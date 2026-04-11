from django.contrib import admin

from .models import Announcement, FAQ, FounderVideo, Project, ProjectImage, SiteSettings

admin.site.site_header = "Ercan İnşaat"
admin.site.site_title = "Ercan İnşaat"


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("__str__", "updated_at")
    fields = ("hero_video",)

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 0


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "featured", "sort_order", "updated_at")
    list_filter = ("status", "featured")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "location", "summary")
    inlines = [ProjectImageInline]


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ("project", "caption", "sort_order")
    list_filter = ("project",)


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ("title", "is_published", "published_at")
    list_filter = ("is_published",)
    search_fields = ("title", "body")


@admin.register(FounderVideo)
class FounderVideoAdmin(admin.ModelAdmin):
    list_display = ("title", "sort_order", "is_published", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("title",)
    ordering = ("sort_order", "id")


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "section", "sort_order", "is_published")
    list_filter = ("section", "is_published")
