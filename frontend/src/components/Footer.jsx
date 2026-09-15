import {
  cb,
  mastercard,
  paypal,
  visa,
  twitter,
  instagram,
  linkedin,
  youtube,
} from "../assets";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-copyright">
            <p>© Hainarie -</p>
            <p>Tous droits réservés</p>
          </div>
        </div>

        <div className="footer-section">
          <h4>Modes de paiement</h4>
          <div className="payment-methods">
            <img
              loading="lazy"
              src={cb}
              alt="Carte bancaire"
              className="payment-icon"
            />
            <img
              loading="lazy"
              src={mastercard}
              alt="Mastercard"
              className="payment-icon"
            />
            <img
              loading="lazy"
              src={paypal}
              alt="PayPal"
              className="payment-icon"
            />
            <img
              loading="lazy"
              src={visa}
              alt="Visa"
              className="payment-icon"
            />
          </div>

          <h4 className="social-title">Réseaux sociaux</h4>
          <div className="social-icons">
            <img
              loading="lazy"
              src={twitter}
              alt="Twitter"
              className="social-icon"
            />
            <img
              loading="lazy"
              src={instagram}
              alt="Instagram"
              className="social-icon"
            />
            <img
              loading="lazy"
              src={youtube}
              alt="YouTube"
              className="social-icon"
            />
            <img
              loading="lazy"
              src={linkedin}
              alt="LinkedIn"
              className="social-icon"
            />
          </div>
        </div>

        <div className="footer-section">
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li>
              <a href="/">Accueil</a>
            </li>
            <li>
              <a href="/catalog?page=1&gender=Femme">Femme</a>
            </li>
            <li>
              <a href="/catalog?page=1&gender=Homme">Homme</a>
            </li>
            <li>
              <a href="/catalog?page=1&gender=Fille">Filles</a>
            </li>
            <li>
              <a href="/catalog?page=1&gender=Garçon">Garçons</a>
            </li>
            <li>
              <a href="/catalog">Catalogue</a>
            </li>
            <li>
              <a href="/profile">Utilisateur</a>
            </li>
            <li>
              <a href="/cart">Panier</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Réglementations</h4>
          <ul className="footer-links">
            <li>
              <a href="#cvg">Conditions de Vente Hainarie</a>
            </li>
            <li>
              <a href="#conditions-marketplace">
                Conditions Spécifiques Marketplace
              </a>
            </li>
            <li>
              <a href="#infos-reglementaires">
                Informations réglementaires et légales
              </a>
            </li>
            <li>
              <a href="#cgu">Conditions d'Utilisation Hainarie</a>
            </li>
            <li>
              <a href="#donnees-personnelles">Données personnelles</a>
            </li>
            <li>
              <a href="#cookies">Gérer mes cookies</a>
            </li>
            <li>
              <a href="#conditions-offres">Conditions des offres</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
