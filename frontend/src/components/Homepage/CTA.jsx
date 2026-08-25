function CTA() {
  return (
    <div className="newsletter-footer">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <p className="newsletter-description">
            Profitez de -20% sur votre première commande en vous inscrivant à notre newsletter
          </p>
        </div>
        <div className="newsletter-form">
          <h3 className="newsletter-title">Votre e-mail</h3>
          <div className="email-input-container">
            <input
              type="email"
              placeholder="email@exemple.com"
              className="email-input"
            />
            <button type="submit" className="submit-button" title="Envoyer">
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CTA;
