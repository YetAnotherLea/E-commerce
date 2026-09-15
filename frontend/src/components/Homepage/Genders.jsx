import { useEffect, useState } from "react";
import { getProducts } from "../../pages/Admin/api-client";

const GENDERS = [
  { key: "Femme", label: "Femme", className: "female" },
  { key: "Homme", label: "Homme", className: "male" },
];

function Genders() {
  const [images, setImages] = useState({});

  // Une image de produit représentative par genre
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const products = await getProducts({ pageSize: 100 });
        const byGender = {};
        for (const p of products) {
          if (p.Gender && p.ImageURL && !byGender[p.Gender]) {
            byGender[p.Gender] = p.ImageURL;
          }
        }
        setImages(byGender);
      } catch (error) {
        console.error("Erreur lors du chargement des genres :", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <>
      <section className="genders-section">
        <h3>Parcourez les articles pour femmes ou hommes</h3>
        <div className="genders-container">
          {GENDERS.map(({ key, label, className }) => (
            <div
              className={`genders-under-container ${className}`}
              title={label}
              key={key}
            >
              <a href={`/catalog?page=1&gender=${encodeURIComponent(key)}`}>
                <p>{label}</p>
                {images[key] && (
                  <img
                    loading="lazy"
                    className={`gender-${className}`}
                    src={images[key]}
                    alt={label}
                  />
                )}
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Genders;
