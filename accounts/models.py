from decimal import Decimal
import secrets

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    referral_code = models.CharField(max_length=12, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.referral_code:
            self.referral_code = self._generate_referral_code()
        super().save(*args, **kwargs)

    def _generate_referral_code(self):
        while True:
            code = f"FT{secrets.token_hex(4).upper()}"
            if not type(self).objects.filter(referral_code=code).exists():
                return code
