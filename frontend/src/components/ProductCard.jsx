import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addToCart } from "../services/cartService";
import { getMediaUrl } from "../services/api";
import { getAuthenticatedUserId } from "../services/authService";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    const userId = getAuthenticatedUserId();

    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      setError("");
      await addToCart(product.id, userId);
      setMessage("Added to cart.");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      setError("Unable to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">

      {product.image ? (
        <img
          src={getMediaUrl(product.image)}
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
