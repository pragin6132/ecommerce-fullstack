from django.db import models


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('mobile', 'Mobile'),
        ('accessory', 'Mobile Accessory'),
        ('case', 'Mobile Case'),
        ('skin', 'Custom Mobile Skin'),
        ('laptop_skin', 'Laptop Skin'),
        ('gift', 'Custom Gift'),
    ]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='products/')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name