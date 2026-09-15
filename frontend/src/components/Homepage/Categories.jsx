import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../pages/Admin/api-client";
import { assetUrl } from "../../api";

function Categories() {
  //JS pour scroll
  const scrollLeft = () => {
    document
      .querySelector("#categories-track")
      .scrollBy({ left: -260, behavior: "smooth" });
  };

  const scrollRight = () => {
    document
      .querySelector("#categories-track")
      .scrollBy({ left: 260, behavior: "smooth" });
  };

  //FETCH CATEGORIES
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getCategories();
        setSubCategories(cats);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories :", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <section className="carousel-container categories-section">
        <h3>Catégories de vêtements</h3>
        <div className="carousel">
          <div id="categories-track" className="carousel-track">
            {subCategories.map((subCat, index) => (
              <div className="card" key={index}>
                <div className="product-card">
                  <Link
                    to={`/catalog?page=1&subCategory=${encodeURIComponent(subCat.name)}`}
                  >
                    <h4>{subCat.name}</h4>
                    <img
                      loading="lazy"
                      src={assetUrl(subCat.image)}
                      alt={subCat.name}
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="navigation-buttons">
          <button className="carousel-btn" onClick={scrollLeft} title="Précédent">
            &#8592;
          </button>
          <button className="carousel-btn" onClick={scrollRight} title="Suivant">
            &#8594;
          </button>
        </div>
      </section>
    </>
  );
}

export default Categories;
