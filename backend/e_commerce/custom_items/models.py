from django.db import models
from django.contrib.auth.models import User
from products.models import Product

class CustomItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    design_image = models.ImageField(upload_to='custom_designs/')
    note = models.TextField(blank=True)  # special instructions
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Custom Design for {self.user.username} - {self.product.name}"
