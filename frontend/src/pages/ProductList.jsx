import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div>
      <h1>Product Catalog</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div key={product._id}>
            <Link to={`/products/${product._id}`}>
              <img
                loading="lazy"
                src={product.ImageURL}
                alt={product.ProductTitle}
                style={{ maxWidth: "100%" }}
              />
              <h3>{product.ProductTitle}</h3>
              <p>Price: ${product.Price}</p>
              <p>Category: {product.Category}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
