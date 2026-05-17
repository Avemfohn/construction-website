from rest_framework import serializers

from .cloudinary_media import resolve_cloudinary_image_reference
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


def _cloudinary_media_url(request, field_value) -> str | None:
    """Absolute HTTPS URL for CloudinaryField (image or video)."""
    if not field_value:
        return None
    url = getattr(field_value, "url", None)
    if not url:
        return None
    if request and url.startswith("/"):
        return request.build_absolute_uri(url)
    return url


class ProjectImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProjectImage
        fields = ("id", "image", "caption", "sort_order")

    def get_image(self, obj):
        return _cloudinary_media_url(self.context.get("request"), obj.image)


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


class ProjectUpdateMediaSerializer(serializers.ModelSerializer):
    kind = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = ProjectUpdateMedia
        fields = ("id", "kind", "url", "caption", "sort_order")

    def get_kind(self, obj):
        if obj.video:
            return "video"
        return "image"

    def get_url(self, obj):
        field = obj.video if obj.video else obj.image
        return _cloudinary_media_url(self.context.get("request"), field)


class ProjectUpdateSerializer(serializers.ModelSerializer):
    media = serializers.SerializerMethodField()

    class Meta:
        model = ProjectUpdate
        fields = ("id", "title", "body", "published_at", "sort_order", "media")

    def get_media(self, obj):
        items = []
        request = self.context.get("request")
        for row in obj.media.all():
            ser = ProjectUpdateMediaSerializer(row, context={"request": request})
            data = ser.data
            if data.get("url"):
                items.append(data)
        return items


class ProjectDetailSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    updates = ProjectUpdateSerializer(many=True, read_only=True)

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
            "updates",
            "created_at",
            "updated_at",
        )


class AnnouncementSerializer(serializers.ModelSerializer):
    """
    Read: image / video are absolute URLs.
    Write: multipart files under keys ``image`` / ``video`` (optional).
    """

    class Meta:
        model = Announcement
        fields = (
            "id",
            "title",
            "body",
            "is_published",
            "published_at",
            "updated_at",
        )
        read_only_fields = ("published_at", "updated_at")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        req = self.context.get("request")
        data["image"] = _cloudinary_media_url(req, instance.image)
        data["video"] = _cloudinary_media_url(req, instance.video)
        return data

    def create(self, validated_data):
        request = self.context.get("request")
        instance = Announcement.objects.create(**validated_data)
        if request:
            if "image" in request.FILES:
                instance.image = request.FILES["image"]
            if "video" in request.FILES:
                instance.video = request.FILES["video"]
            if "image" in request.FILES or "video" in request.FILES:
                instance.save()
        return instance

    def update(self, instance, validated_data):
        request = self.context.get("request")
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if request:
            if "image" in request.FILES:
                instance.image = request.FILES["image"]
            if "video" in request.FILES:
                instance.video = request.FILES["video"]
        instance.save()
        return instance


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


class FounderVideoPublicSerializer(serializers.ModelSerializer):
    """Public read: HTTPS URL from Cloudinary."""

    video_url = serializers.SerializerMethodField()
    poster_url = serializers.SerializerMethodField()

    class Meta:
        model = FounderVideo
        fields = ("id", "title", "video_url", "poster_url", "sort_order")

    def get_video_url(self, obj):
        return _cloudinary_media_url(self.context.get("request"), obj.video)

    def get_poster_url(self, obj):
        uploaded = _cloudinary_media_url(self.context.get("request"), obj.poster)
        if uploaded:
            return uploaded
        from_ref = resolve_cloudinary_image_reference(obj.poster_ref)
        if from_ref:
            return from_ref
        settings = SiteSettings.objects.filter(pk=1).first()
        if settings:
            return resolve_cloudinary_image_reference(settings.founder_video_poster_ref)
        return None


class SiteSettingsPublicSerializer(serializers.ModelSerializer):
    """Public read: absolute URL for hero video (if uploaded)."""

    hero_video_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = ("hero_video_url",)

    def get_hero_video_url(self, obj):
        return _cloudinary_media_url(self.context.get("request"), obj.hero_video)
