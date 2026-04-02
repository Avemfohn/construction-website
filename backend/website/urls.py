from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AnnouncementViewSet,
    FAQViewSet,
    ProjectViewSet,
    SiteSettingsPublicView,
)

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"announcements", AnnouncementViewSet, basename="announcement")
router.register(r"faqs", FAQViewSet, basename="faq")

urlpatterns = [
    path("site-settings/", SiteSettingsPublicView.as_view(), name="site-settings"),
    path("", include(router.urls)),
]
