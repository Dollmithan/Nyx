from django.test import Client, TestCase
from django.urls import reverse

from .models import User


class AuthFlowTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_signup_creates_user_and_redirects_to_dashboard(self):
        response = self.client.post(
            reverse("signup"),
            {
                "full_name": "Alex Morgan",
                "email": "alpha@example.com",
                "password1": "ComplexPass123!",
                "password2": "ComplexPass123!",
                "goal": "growth",
                "risk_profile": "balanced",
                "initial_deposit": "250",
            },
        )

        self.assertRedirects(response, reverse("dashboard"))
        user = User.objects.get(email="alpha@example.com")
        self.assertTrue(user.referral_code.startswith("FT"))
        self.assertEqual(str(user.balance), "250.00")

    def test_dashboard_requires_authentication(self):
        response = self.client.get(reverse("dashboard"))
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('dashboard')}")

    def test_dashboard_context_contains_mock_ai_data(self):
        user = User.objects.create_user(
            username="deskuser",
            email="desk@example.com",
            password="ComplexPass123!",
        )
        self.client.force_login(user)

        response = self.client.get(reverse("dashboard"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context["holdings"]), 6)
        self.assertIn("portfolio_chart", response.context)
        self.assertContains(response, "Agent journal")

    def test_email_login_authenticates_user(self):
        user = User.objects.create_user(
            username="email-login-user",
            email="login@example.com",
            password="ComplexPass123!",
        )

        response = self.client.post(
            reverse("login"),
            {"username": user.email, "password": "ComplexPass123!"},
        )

        self.assertRedirects(response, reverse("dashboard"))

    def test_authenticated_pages_render(self):
        user = User.objects.create_user(
            username="route-user",
            email="routes@example.com",
            password="ComplexPass123!",
        )
        self.client.force_login(user)

        for route_name in ["dashboard", "markets", "statistics", "alerts", "settings"]:
            with self.subTest(route=route_name):
                response = self.client.get(reverse(route_name))
                self.assertEqual(response.status_code, 200)
