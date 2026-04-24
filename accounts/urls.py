from django.contrib.auth.views import LogoutView
from django.urls import path

from .views import AlertsView, DashboardView, FintechLoginView, LandingPageView, MarketsView, SettingsView, SignUpView, StatisticsView

urlpatterns = [
    path("", LandingPageView.as_view(), name="landing"),
    path("signup/", SignUpView.as_view(), name="signup"),
    path("login/", FintechLoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("markets/", MarketsView.as_view(), name="markets"),
    path("statistics/", StatisticsView.as_view(), name="statistics"),
    path("alerts/", AlertsView.as_view(), name="alerts"),
    path("settings/", SettingsView.as_view(), name="settings"),
]
