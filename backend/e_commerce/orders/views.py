from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Order, OrderItem
from cart.models import Cart

class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        address = request.data.get("address")
        payment_method = request.data.get("payment_method", "COD")

        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_items = cart.items.all()

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        total = sum(item.product.price * item.quantity for item in cart_items)

        order = Order.objects.create(
            user=request.user,
            total_amount=total,
            address=address,
            payment_method=payment_method
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        cart_items.delete()

        return Response({"message": "Order placed successfully", "order_id": order.id}, status=201)
