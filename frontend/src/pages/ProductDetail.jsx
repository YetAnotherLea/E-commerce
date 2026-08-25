import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAddToCart } from "../hooks";
import "../styles/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const addToCart = useAddToCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/products/${id}`,
          {
            method: "GET",
          },
        );
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        if (data.ImageURL?.startsWith("/uploads/")) {
          data.ImageURL = "http://127.0.0.1:8000" + data.ImageURL;
        }
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        id: product.ProductId,
      });
    }
  };

  if (loading)
    return (
      <div className="product-detail-container">
        <div className="loading-spinner">
          Chargement des détails du produit...
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="product-detail-container">
        <div className="error-message">
          <h2>Produit non trouvé</h2>
          <p>
            Désolé, mais le produit recherché n'existe plus ou a été supprimé.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );

  return (
    <div className="product-detail">
      <div className="product-image">
        <img
          loading="lazy"
          src={product.ImageURL}
          alt={product.ProductTitle}
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </div>
      <div className="product-info">
        <div className="product-header">
          <h2 className="product-title">{product.ProductTitle}</h2>
        </div>
        <div className="price">
          <h3 className="currency">$</h3>
          <h3 className="amount">{product.Price}</h3>
        </div>
        <p className="product-description">
          Catégorie: {product.Category || "Général"} /{" "}
          {product.SubCategory || "N/A"} / {product.ProductType || "N/A"}
        </p>
        <p className="product-description">
          Genre: {product.Gender || "Unisexe"}
        </p>
        <p className="product-description">
          Usage: {product.ProductUsage || product.Usage || "Quotidien"}
        </p>
        <p className="product-description">Poids: {product.Weight || "500"}g</p>
        <div className="product-options">
          <div className="option-group">
            <label className="option-label">Taille</label>
            <select className="option-select">
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>
          <div className="option-group">
            <label className="option-label">Couleur</label>
            <select className="option-select">
              <option>{product.Colour || "Standard"}</option>
            </select>
          </div>
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
