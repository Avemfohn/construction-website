from django.db import migrations
import cloudinary.models


class Migration(migrations.Migration):

    dependencies = [
        ("website", "0004_cloudinary_site_media"),
    ]

    operations = [
        migrations.AddField(
            model_name="foundervideo",
            name="poster",
            field=cloudinary.models.CloudinaryField(
                blank=True,
                help_text="Oynatılmadan önce görünen önizleme görseli (16:9 önerilir).",
                max_length=255,
                null=True,
                verbose_name="image",
            ),
        ),
    ]
