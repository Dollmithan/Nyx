from decimal import Decimal

from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.core.exceptions import ValidationError
from django.utils.text import slugify

from .models import User


INPUT_CLASSES = "input"


class SignUpForm(UserCreationForm):
    full_name = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={"class": INPUT_CLASSES, "placeholder": "Alex Morgan"}),
    )
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={"class": INPUT_CLASSES, "placeholder": "you@domain.com"}),
    )
    goal = forms.CharField(widget=forms.HiddenInput(), initial="growth", required=False)
    risk_profile = forms.CharField(widget=forms.HiddenInput(), initial="balanced", required=False)
    initial_deposit = forms.DecimalField(
        widget=forms.HiddenInput(),
        initial=Decimal("250"),
        required=False,
        min_value=Decimal("0"),
    )

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("full_name", "email", "password1", "password2", "goal", "risk_profile", "initial_deposit")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["password1"].widget.attrs.update(
            {"class": INPUT_CLASSES, "placeholder": "At least 10 characters"}
        )
        self.fields["password2"].widget.attrs.update(
            {"class": INPUT_CLASSES, "placeholder": "Confirm password"}
        )

    def clean_email(self):
        email = self.cleaned_data["email"].strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise ValidationError("An account with this email already exists.")
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        full_name = self.cleaned_data["full_name"].strip()
        parts = full_name.split(maxsplit=1)
        user.first_name = parts[0]
        user.last_name = parts[1] if len(parts) > 1 else ""
        user.email = self.cleaned_data["email"]
        user.username = self._generate_username(full_name, user.email)
        user.balance = self.cleaned_data.get("initial_deposit") or Decimal("0.00")
        if commit:
            user.save()
        return user

    def _generate_username(self, full_name, email):
        base = slugify(full_name) or slugify(email.split("@")[0]) or "nyx-user"
        candidate = base[:150]
        suffix = 1
        while User.objects.filter(username=candidate).exists():
            suffix += 1
            candidate = f"{base[:140]}-{suffix}"
        return candidate


class FintechAuthenticationForm(AuthenticationForm):
    username = forms.CharField(
        label="Email",
        widget=forms.EmailInput(
            attrs={"class": INPUT_CLASSES, "placeholder": "you@domain.com", "style": "padding-left: 40px;"}
        ),
    )
    password = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(
            attrs={"class": INPUT_CLASSES, "placeholder": "••••••••", "style": "padding-left: 40px; padding-right: 40px;"}
        ),
    )

    error_messages = {
        "invalid_login": "Enter a valid email and password.",
        "inactive": "This account is inactive.",
    }

    def clean(self):
        email = self.cleaned_data.get("username")
        password = self.cleaned_data.get("password")

        if email and password:
            user_lookup = User.objects.filter(email__iexact=email.strip()).first()
            username = user_lookup.username if user_lookup else email.strip()
            self.user_cache = authenticate(
                self.request,
                username=username,
                password=password,
            )
            if self.user_cache is None:
                raise self.get_invalid_login_error()
            self.confirm_login_allowed(self.user_cache)

        return self.cleaned_data
