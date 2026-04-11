from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Announcement, FAQ, FounderVideo, Project, SiteSettings
from .serializers import (
    AnnouncementSerializer,
    FAQSerializer,
    FounderVideoPublicSerializer,
    ProjectDetailSerializer,
    ProjectListSerializer,
    SiteSettingsPublicSerializer,
)


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public read-only API. Filter with ?status=ongoing or ?status=completed
    """

    queryset = Project.objects.all()
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProjectDetailSerializer
        return ProjectListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        status = self.request.query_params.get("status")
        if status in ("ongoing", "completed"):
            qs = qs.filter(status=status)
        return qs


class AnnouncementViewSet(viewsets.ModelViewSet):
    """
    GET: public sees only published; authenticated users see all.
    POST/PUT/PATCH/DELETE: require authentication (Token or session).
    Supports multipart image uploads for mobile / PWA.
    """

    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        qs = Announcement.objects.all()
        user = self.request.user
        if not user.is_authenticated:
            qs = qs.filter(is_published=True)
        return qs

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAuthenticated()]
        return super().get_permissions()


class SiteSettingsPublicView(APIView):
    """GET singleton site settings (hero video URL, etc.)."""

    def get(self, request):
        settings_obj = SiteSettings.load()
        ser = SiteSettingsPublicSerializer(
            settings_obj,
            context={"request": request},
        )
        return Response(ser.data)


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    """Published FAQs only."""

    serializer_class = FAQSerializer

    def get_queryset(self):
        qs = FAQ.objects.filter(is_published=True)
        section = self.request.query_params.get("section")
        if section in ("general", "urban_renewal"):
            qs = qs.filter(section=section)
        return qs


class FounderVideoViewSet(viewsets.ReadOnlyModelViewSet):
    """Published founder Q&A videos (Cloudinary URLs)."""

    serializer_class = FounderVideoPublicSerializer

    def get_queryset(self):
        return (
            FounderVideo.objects.filter(is_published=True)
            .exclude(Q(video__isnull=True) | Q(video=""))
            .order_by("sort_order", "id")
        )
