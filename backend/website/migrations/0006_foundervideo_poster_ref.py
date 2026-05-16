from django.db import migrations, models
import cloudinary.models


class Migration(migrations.Migration):

    dependencies = [
        ("website", "0005_foundervideo_poster"),
    ]

    operations = [
        migrations.AddField(
            model_name="sitesettings",
            name="founder_video_poster_ref",
            field=models.CharField(
                blank=True,
                help_text=(
                    "Varsayılan kentsel dönüşüm video önizlemesi: Cloudinary görsel URL’si veya "
                    "public_id. Her videoda ayrı önizleme yoksa bu kullanılır."
                ),
                max_length=512,
            ),
        ),
        migrations.AddField(
            model_name="foundervideo",
            name="poster_ref",
            field=models.CharField(
                blank=True,
                help_text=(
                    "Cloudinary’deki görselin tam URL’si veya public_id. "
                    "Aynı değeri birden fazla videoda kullanabilirsiniz (ortak önizleme)."
                ),
                max_length=512,
                verbose_name="Preview image URL or public_id",
            ),
        ),
        migrations.AlterField(
            model_name="foundervideo",
            name="poster",
            field=cloudinary.models.CloudinaryField(
                blank=True,
                help_text="İsteğe bağlı: önizlemi admin’den yükleyin (URL alanı yerine veya onun üzerine yazar).",
                max_length=255,
                null=True,
                verbose_name="image",
            ),
        ),
    ]
