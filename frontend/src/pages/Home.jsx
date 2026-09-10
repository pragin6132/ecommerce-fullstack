import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="home">

      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Store</h1>

          <p>
            Discover quality products at great prices.
          </p>

          <Link to="/products" className="hero-btn">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="products-section">
        <div className="section-header">
          <h2>Featured Products</h2>

          <Link to="/products">
            View All →
          </Link>
        </div>

        {loading && (
          <p className="status-message">
            Loading products...
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="status-message">
            No products available.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default Home;