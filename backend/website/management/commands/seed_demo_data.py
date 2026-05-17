from django.core.management.base import BaseCommand

from website.models import Announcement, FAQ, Project, ProjectUpdate


class Command(BaseCommand):
    help = "Örnek proje, SSS ve duyuru metni ekler (görseller Cloudinary üzerinden yönetimden)"

    def handle(self, *args, **options):
        # Projects
        p1, _ = Project.objects.update_or_create(
            slug="bosphorus-residence",
            defaults={
                "title": "Boğaz Residence",
                "summary": "Denize sıfır, üst segment konut alanları.",
                "description": "Özel olanaklar ve taşıyıcı güvenliği merkezde olan karma kullanımlı bir proje.",
                "status": Project.Status.ONGOING,
                "location": "İstanbul / Beşiktaş",
                "features": ["Depreme dayanıklı taşıyıcı", "Özel otopark", "Özel karşılama hizmeti"],
                "featured": True,
                "sort_order": 1,
            },
        )

        p2, _ = Project.objects.update_or_create(
            slug="golden-gate-villas",
            defaults={
                "title": "Golden Gate Villaları",
                "summary": "Tamamlanmış butik villa koleksiyonu.",
                "description": "Mahremiyet, seçkin malzemeler ve mühendislik kalitesine odaklı tamamlanmış geliştirme.",
                "status": Project.Status.COMPLETED,
                "location": "İstanbul / Sarıyer",
                "features": ["Akıllı ev", "Peyzaj terasları", "7/24 güvenlik"],
                "featured": False,
                "sort_order": 2,
            },
        )

        # Galeri görselleri artık Cloudinary — yerel dosya yolu kullanılmaz.
        # Projeler oluşturulduktan sonra Django yönetiminden Project images ekleyin.

        ProjectUpdate.objects.update_or_create(
            project=p1,
            title="Karot numunesi alındı",
            defaults={
                "body": (
                    "Şantiyede çekirdek (karot) örneği alındı. Numuneler laboratuvara "
                    "gönderildi; taşıyıcı sistem değerlendirmesi için sonuçlar bekleniyor. "
                    "Fotoğraf ve videoları bu güncellemeye Django yönetiminden ekleyebilirsiniz."
                ),
                "is_published": True,
                "sort_order": 0,
            },
        )

        Announcement.objects.update_or_create(
            title="Ayhan Ercan — şantiye notu (12. hafta)",
            defaults={
                "body": "Ercan İnşaat sahasında taşıyıcı sistem ve cephe ilerlemesi planlandığı gibi devam ediyor.",
                "is_published": True,
            },
        )

        Announcement.objects.update_or_create(
            title="Bayram tebriği",
            defaults={
                "body": "Ayhan Ercan ve Ercan İnşaat ailesi olarak ortaklarımıza ve müşterilerimize sağlık, bereket ve güvenli yuvalar dileriz.",
                "is_published": True,
            },
        )

        faqs = [
            (
                FAQ.Section.URBAN_RENEWAL,
                "Kentsel dönüşüm süreciniz nasıl işliyor?",
                "Statik değerlendirme, hukuki planlama, sakin uyumu ve şeffaf kilometre taşlarıyla aşamalı uygulama ile başlarız.",
                1,
            ),
            (
                FAQ.Section.URBAN_RENEWAL,
                "Yıkım ve yeniden yapım sırasında güvenliği nasıl sağlıyorsunuz?",
                "Sertifikalı ekipler, mühendislik koruma planları ve belediye uyumlu operasyonlar her aşamada zorunludur.",
                2,
            ),
            (
                FAQ.Section.GENERAL,
                "Proje ilerlemesini uzaktan takip edebilir miyim?",
                "Evet. Fotoğraflar ve kilometre taşı özetleriyle düzenli güncellemeleri Ayhan Ercan medya sayfasında paylaşıyoruz.",
                1,
            ),
        ]

        for section, question, answer, sort_order in faqs:
            FAQ.objects.update_or_create(
                question=question,
                defaults={
                    "section": section,
                    "answer": answer,
                    "sort_order": sort_order,
                    "is_published": True,
                },
            )

        self.stdout.write(self.style.SUCCESS("Örnek veri başarıyla eklendi."))
