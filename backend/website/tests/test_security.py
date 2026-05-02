"""Security-related regression tests."""

from django.core.checks import run_checks
from django.test import TestCase, override_settings


class ProductionDeployCheckTests(TestCase):
    """With production-like settings, `check --deploy` must not report ERROR+ issues."""

    @override_settings(
        DEBUG=False,
        ALLOWED_HOSTS=["example.com"],
        SECRET_KEY="k8f#mP2$vL9nR4@jH6*wQ1!zX5%cB7&eN0^tY3+uI8=oA2sD4fG6hJ8kL0",
        SECURE_SSL_REDIRECT=True,
        SESSION_COOKIE_SECURE=True,
        CSRF_COOKIE_SECURE=True,
        SECURE_HSTS_SECONDS=31536000,
        SECURE_HSTS_INCLUDE_SUBDOMAINS=True,
        SECURE_HSTS_PRELOAD=False,
        SECURE_CONTENT_TYPE_NOSNIFF=True,
        SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO", "https"),
        X_FRAME_OPTIONS="DENY",
    )
    def test_deploy_checks_no_errors(self) -> None:
        messages = run_checks(include_deployment_checks=True)
        serious = [m for m in messages if m.level >= 40]
        self.assertEqual(
            serious,
            [],
            [f"{m.id}: {m.msg}" for m in serious],
        )
