from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer
from django.contrib.auth.models import User

class CartView(APIView):
    def get(self, request, user_id):
        try:
            cart, created = Cart.objects.get_or_create(user_id=user_id)
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class AddToCartView(APIView):
    def post(self, request):
        product_id = request.data.get("product_id")
        user_id = request.data.get("user_id")

        try:
            cart, created = Cart.objects.get_or_create(user_id=user_id)
            product = Product.objects.get(id=product_id)
        except (User.DoesNotExist, Product.DoesNotExist):
            return Response(
                {"error": "User or product not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"quantity": 1},
        )

        if not item_created:
            cart_item.quantity += 1
            cart_item.save()

        return Response(
            {"message": "Item added to cart", "cart": CartSerializer(cart).data},
            status=status.HTTP_201_CREATED,
        )


class CartItemView(APIView):
    def patch(self, request, item_id):
        user_id = request.data.get("user_id")
        quantity = request.data.get("quantity")

        if not isinstance(quantity, int) or quantity < 1:
            return Response(
                {"error": "Quantity must be at least 1"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            cart_item = CartItem.objects.select_related("cart").get(
                id=item_id,
                cart__user_id=user_id,
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart_item.quantity = quantity
        cart_item.save()
        return Response(CartSerializer(cart_item.cart).data)

    def delete(self, request, item_id):
        user_id = request.data.get("user_id")

        try:
            cart_item = CartItem.objects.select_related("cart").get(
                id=item_id,
                cart__user_id=user_id,
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart = cart_item.cart
        cart_item.delete()
        return Response(CartSerializer(cart).data)
