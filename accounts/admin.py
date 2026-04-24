from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Trading Profile", {"fields": ("balance", "referral_code")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Trading Profile", {"fields": ("balance", "referral_code")}),
    )
    list_display = ("username", "email", "balance", "referral_code", "is_staff")
