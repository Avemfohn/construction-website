from django.core.management.base import BaseCommand

from website.models import Announcement, FAQ, Project, ProjectImage


class Command(BaseCommand):
    help = "Seed demo Projects, ProjectImages, FAQs, and Announcements"

    def handle(self, *args, **options):
        # Projects
        p1, _ = Project.objects.update_or_create(
            slug="bosphorus-residence",
            defaults={
                "title": "Bosphorus Residence",
                "summary": "Ultra-premium seafront living spaces.",
                "description": "A high-end mixed-use complex with private amenities and structural safety at its core.",
                "status": Project.Status.ONGOING,
                "location": "Istanbul / Besiktas",
                "features": ["Seismic-grade structure", "Private parking", "Concierge"],
                "featured": True,
                "sort_order": 1,
            },
        )

        p2, _ = Project.objects.update_or_create(
            slug="golden-gate-villas",
            defaults={
                "title": "Golden Gate Villas",
                "summary": "Completed boutique villa collection.",
                "description": "Completed development focused on privacy, luxury finishes, and engineering quality.",
                "status": Project.Status.COMPLETED,
                "location": "Istanbul / Sariyer",
                "features": ["Smart home", "Landscape terraces", "24/7 security"],
                "featured": False,
                "sort_order": 2,
            },
        )

        # Project image records (db-only placeholder file paths)
        demo_project_images = [
            (p1, "Main facade", "projects/demo/bosphorus-1.png", 1),
            (p1, "Lobby detail", "projects/demo/bosphorus-2.png", 2),
            (p2, "Villa exterior", "projects/demo/golden-gate-1.png", 1),
        ]

        for project, caption, image_path, sort_order in demo_project_images:
            ProjectImage.objects.update_or_create(
                project=project,
                caption=caption,
                defaults={
                    "image": image_path,
                    "sort_order": sort_order,
                },
            )

        # Announcements / media (db-only placeholder image path)
        Announcement.objects.update_or_create(
            title="Founder Site Visit - Week 12",
            defaults={
                "body": "On-site progress update: core structure and facade systems are advancing as planned.",
                "image": "announcements/demo/founder-site-visit.png",
                "is_published": True,
            },
        )

        Announcement.objects.update_or_create(
            title="Holiday Greeting",
            defaults={
                "body": "We wish all our partners and clients health, prosperity, and safe homes.",
                "is_published": True,
            },
        )

        # FAQs
        faqs = [
            (
                FAQ.Section.URBAN_RENEWAL,
                "What is your urban renewal process?",
                "We begin with structural assessment, legal planning, resident alignment, and phased execution with transparent milestones.",
                1,
            ),
            (
                FAQ.Section.URBAN_RENEWAL,
                "How do you ensure safety during demolition and rebuild?",
                "Certified teams, engineered protection plans, and municipality-compliant operations are mandatory at every stage.",
                2,
            ),
            (
                FAQ.Section.GENERAL,
                "Can I track project progress remotely?",
                "Yes. We publish scheduled updates with photos and milestone summaries in the Founder\'s Corner.",
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

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully."))
