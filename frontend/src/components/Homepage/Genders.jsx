function Genders() {
  return (
    <>
      <section className="genders-section">
        <h3>Parcourez les articles pour femmes ou hommes</h3>
        <div className="genders-container">
          <div className="genders-under-container female" title="Femme">
            <a href="/catalog?page=1&gender=Femme">
              <p>Femme</p>
              <img loading="lazy" className="gender-female" alt="Femme" />
            </a>
          </div>
          <div className="genders-under-container male" title="Homme">
            <a href="/catalog?page=1&gender=Homme">
              <p>Homme</p>
              <img loading="lazy" className="gender-male" alt="Homme" />
            </a>
          </div>
          <div className="genders-under-container girl" title="Filles">
            <a href="/catalog?page=1&gender=Fille">
              <p>Filles</p>
              <img loading="lazy" className="gender-girls" alt="Filles" />
            </a>
          </div>
          <div className="genders-under-container boys" title="Garçons">
            <a href="/catalog?page=1&gender=Garçon">
              <p>Garçons</p>
              <img loading="lazy" className="gender-male" alt="Garçons" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Genders;
