import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks";
import { visa, mastercard, cb, logo } from "../assets";
import "../styles/Checkout.css";

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    address: "",
    city: "",
    zip: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (name) => {
    if (name === "cvv") setIsFlipped(true);
    else setIsFlipped(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 3000);
  };

  const formatCardNumber = (num) => {
    return num
      .replace(/\s?/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
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
        <h2>Paiement Réussi !</h2>
        <p>Votre commande a été traitée avec succès. Merci !</p>
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
          <div className="card-wrapper">
            <div className={`credit-card ${isFlipped ? "flipped" : ""}`}>
              <div className="card-front">
                <div className="card-bg"></div>
                <div className="card-content">
                  <div className="card-header">
                    <img
                      loading="lazy"
                      src={logo}
                      alt="Hainarie"
                      className="card-logo"
                    />
                    <img
                      loading="lazy"
                      src={visa}
                      alt="Visa"
                      className="card-type"
                    />
                  </div>
                  <div className="card-chip"></div>
                  <div className="card-number">
                    {formData.cardNumber
                      ? formatCardNumber(formData.cardNumber)
                      : "XXXX XXXX XXXX XXXX"}
                  </div>
                  <div className="card-footer">
                    <div className="card-holder">
                      <span className="label">Titulaire du compte</span>
                      <span className="value">
                        {formData.name || "NOM PRÉNOM"}
                      </span>
                    </div>
                    <div className="card-expiry">
                      <span className="label">Expire le</span>
                      <span className="value">
                        {formData.expiry || "MM/YY"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-back">
                <div className="card-bg"></div>
                <div className="card-black-line"></div>
                <div className="card-cvv-section">
                  <span className="label">CVV</span>
                  <div className="cvv-value">{formData.cvv || "***"}</div>
                  <div className="card-type-back">
                    <img loading="lazy" src={visa} alt="Visa" />
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                  onFocus={() => handleFocus("name")}
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

            <h3>Détails de Paiement</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Numéro de Carte</label>
                <input
                  type="text"
                  name="cardNumber"
                  maxLength="16"
                  placeholder="4000 0000 0000 0000"
                  required
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("cardNumber")}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date d'expiration</label>
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                  value={formData.expiry}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("expiry")}
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  maxLength="3"
                  placeholder="***"
                  required
                  value={formData.cvv}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("cvv")}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isProcessing}
            >
              {isProcessing
                ? "Traitement en cours..."
                : `Payer $${getTotalPrice().toFixed(2)}`}
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
