import { hero } from "../../assets";

function HeroSection() {
  return (
    <section className="hero-container">
      <div className="hero-section">
        <img className="hero-image" alt="Nouvelle collection" src={hero} />
        <div className="hero-info">
          <h2 className="hero-title">NOUVELLE COLLECTION SPORT</h2>
          <a
            className="hero-link"
            href="/catalog?page=1&gender=Women"
          >
            Voir la Section Femme
          </a>
          <a
            className="hero-link"
            href="/catalog?page=1&gender=Men&usage=Sports"
          >
            Voir la Section Homme
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
