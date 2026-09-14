import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks";
import "../styles/Checkout.css";

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setIsSuccess(true);
    setIsProcessing(false);
    clearCart();
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="checkout-empty">
        <h2>Oups ! Votre panier est vide.</h2>
        <button onClick={() => navigate("/catalog")} className="btn-primary">
          Retour à la boutique
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="checkout-success">
        <div className="success-icon">
          <svg viewBox="0 0 52 52">
            <circle
              className="checkmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark-check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <h2>Commande enregistrée !</h2>
        <p>
          Merci. Cette boutique est une démonstration : aucun paiement n'est
          traité et aucune commande ne sera expédiée.
        </p>
        <button onClick={() => navigate("/")} className="btn-primary">
          Aller à la page d'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-left">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Détails de Livraison</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Nom Complet</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jean Dupont"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Adresse</label>
                <input
                  type="text"
                  name="address"
                  placeholder="1 Rue de l'Exemple"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ville</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Paris"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Code Postal</label>
                <input
                  type="text"
                  name="zip"
                  placeholder="75000"
                  required
                  value={formData.zip}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <p className="checkout-demo-notice">
              Projet de démonstration : la commande n'est pas payée ni expédiée.
              Aucune coordonnée bancaire n'est demandée.
            </p>

            <button
              type="submit"
              className="btn-primary"
              disabled={isProcessing}
            >
              {`Valider la commande — $${getTotalPrice().toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="checkout-right">
          <div className="order-summary">
            <h3>Résumé de la commande</h3>
            <div className="summary-items">
              {cart.map((item) => (
                <div key={item.ProductId} className="summary-item">
                  <img
                    loading="lazy"
                    src={item.ImageURL}
                    alt={item.ProductTitle}
                  />
                  <div className="item-details">
                    <span className="item-name">{item.ProductTitle}</span>
                    <span className="item-price">
                      {item.quantity} x ${item.Price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <div className="summary-row">
                <span>Sous-total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Livraison</span>
                <span className="free">Gratuit</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
