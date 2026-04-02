from rest_framework import serializers

from .models import Announcement, FAQ, Project, ProjectImage, SiteSettings


def _absolute_file_url(request, file_field) -> str | None:
    if not file_field:
        return None
    url = file_field.url
    if request:
        return request.build_absolute_uri(url)
    return url


class ProjectImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProjectImage
        fields = ("id", "image", "caption", "sort_order")

    def get_image(self, obj):
        return _absolute_file_url(self.context.get("request"), obj.image)


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight list view (no nested images)."""

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "slug",
            "summary",
            "status",
            "location",
            "features",
            "featured",
            "sort_order",
            "created_at",
            "updated_at",
        )


class ProjectDetailSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "slug",
            "summary",
            "description",
            "status",
            "location",
            "features",
            "featured",
            "sort_order",
            "images",
            "created_at",
            "updated_at",
        )


class AnnouncementSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Announcement
        fields = (
            "id",
            "title",
            "body",
            "image",
            "is_published",
            "published_at",
            "updated_at",
        )
        read_only_fields = ("published_at", "updated_at")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["image"] = _absolute_file_url(
            self.context.get("request"),
            instance.image if instance.image else None,
        )
        return data


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = (
            "id",
            "question",
            "answer",
            "section",
            "sort_order",
        )


class SiteSettingsPublicSerializer(serializers.ModelSerializer):
    """Public read: absolute URL for hero video (if uploaded)."""

    hero_video_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = ("hero_video_url",)

    def get_hero_video_url(self, obj):
        return _absolute_file_url(self.context.get("request"), obj.hero_video)
