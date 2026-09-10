import { Link } from "react-router-dom";
import { useState } from "react";
import { addToCart } from "../services/cartService";

function ProductCard({ product }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setError("Please login before adding products to cart.");
      return;
    }

    try {
      setAdding(true);
      setError("");
      await addToCart(product.id, userId);
      setMessage("Added to cart.");
    } catch (err) {
      console.error(err);
      setError("Unable to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">

      {product.image ? (
        <img
          src={`http://127.0.0.1:8000${product.image}`}
          alt={product.name}
        />
      ) : (
        <div className="product-placeholder">
          No Image
        </div>
      )}

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="category">
          {product.category}
        </p>

        <p className="price">
          ₹{product.price}
        </p>

        <p className="stock">
          Stock: {product.stock}
        </p>

        <div className="product-card-actions">
          <Link
            to={`/products/${product.id}`}
            className="view-btn"
          >
            View Product
          </Link>

          <button
            type="button"
            className="add-cart-btn card-add-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>

        {message && <p className="card-success-message">{message}</p>}
        {error && <p className="card-error-message">{error}</p>}
      </div>

    </div>
  );
}

export default ProductCard;
