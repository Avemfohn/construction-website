# Generated manually for SiteSettings singleton

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("website", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="SiteSettings",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "hero_video",
                    models.FileField(
                        blank=True,
                        help_text="MP4 (H.264) recommended for broad browser support.",
                        null=True,
                        upload_to="site/hero/",
                    ),
                ),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Site settings",
                "verbose_name_plural": "Site settings",
            },
        ),
    ]
