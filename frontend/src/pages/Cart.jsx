import { useEffect, useState } from "react";
import { getCart, removeCartItem, updateCartItem } from "../services/cartService";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const loadCart = async () => {
      if (!userId) {
        setError("Please login to view your cart.");
        setLoading(false);
        return;
      }

      try {
        const data = await getCart(userId);
        setCart(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load cart.");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [userId]);

  if (loading) {
    return <p className="status-message">Loading cart...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  const items = cart?.items || [];

  const handleQuantityChange = async (item, quantity) => {
    try {
      setError("");
      const updatedCart = await updateCartItem(item.id, quantity, userId);
      setCart(updatedCart);
    } catch (err) {
      console.error(err);
      setError("Unable to update cart item.");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      setError("");
      const updatedCart = await removeCartItem(itemId, userId);
      setCart(updatedCart);
    } catch (err) {
      console.error(err);
      setError("Unable to remove cart item.");
    }
  };

  const total = items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  return (
    <section className="cart-page">
      <h1>Your Cart</h1>

      {items.length === 0 ? (
        <p className="status-message">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                {item.product.image && (
                  <img
                    src={`http://127.0.0.1:8000${item.product.image}`}
                    alt={item.product.name}
                  />
                )}

                <div className="cart-item-info">
                  <h2>{item.product.name}</h2>
                  <p>₹{item.product.price}</p>
                  <div className="quantity-controls">
                    <span>Quantity:</span>
                    <button
                      type="button"
                      aria-label={`Decrease ${item.product.name} quantity`}
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      −
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${item.product.name} quantity`}
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="remove-cart-item"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <p>
                    Subtotal: ₹
                    {(
                      Number(item.product.price) * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Total: ₹{total.toFixed(2)}</h2>

            <button className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;
