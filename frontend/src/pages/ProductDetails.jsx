import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../services/productService";
import { addToCart } from "../services/cartService";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setError("Please login before adding products to cart.");
      return;
    }

    try {
      setError("");
      await addToCart(product.id, userId);
      setMessage("Product added to cart successfully!");
    } catch (err) {
      console.error(err);
      setError("Unable to add product to cart.");
    }
  };

  if (loading) {
    return <p className="status-message">Loading product...</p>;
  }

  if (error && !product) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <section className="product-details">
      <div className="product-details-image">
        {product.image ? (
          <img
            src={`http://127.0.0.1:8000${product.image}`}
            alt={product.name}
          />
        ) : (
          <div className="product-placeholder">No Image</div>
        )}
      </div>

      <div className="product-details-info">
        <p className="category">{product.category}</p>

        <h1>{product.name}</h1>

        <p className="details-price">₹{product.price}</p>

        <p className="details-description">
          {product.description || "No description available."}
        </p>

        <p className="stock">
          {product.stock > 0
            ? `In Stock: ${product.stock}`
            : "Out of Stock"}
        </p>

        <button
          className="add-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          Add to Cart
        </button>

        {message && (
          <p className="success-message">{message}</p>
        )}

        {error && (
          <p className="error-message">{error}</p>
        )}
      </div>
    </section>
  );
}

export default ProductDetails;