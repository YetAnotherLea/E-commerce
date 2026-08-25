import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../pages/Admin/api-client";

function Categories() {
  //JS pour scroll
  const scrollLeft = () => {
    document
      .querySelector("#carousel-track")
      .scrollBy({ left: -260, behavior: "smooth" });
  };

  const scrollRight = () => {
    document
      .querySelector("#carousel-track")
      .scrollBy({ left: 260, behavior: "smooth" });
  };

  //FETCH CATEGORIES
  const [subCategories, setSubCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getCategories();
        setSubCategories(cats);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <section className="carousel-container categories-section">
        <h3>Catégories de vêtements</h3>
        <div className="carousel">
          <div id="carousel-track" className="carousel-track">
            {subCategories.map((subCat, index) => (
              <div className="card" key={index}>
                <div className="product-card">
                  <Link
                    to={`/catalog?page=1&category=${subCat.name || "Vêtements"}`}
                  >
                    <h4>{subCat.name || "Vêtements"}</h4>
                    <img
                      loading="lazy"
                      src={
                        subCat.image ||
                        "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
                      }
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
          <button className="carousel-btn" onClick={scrollLeft} title="Left">
            &#8592;
          </button>
          <button className="carousel-btn" onClick={scrollRight} title="Right">
            &#8594;
          </button>
        </div>
      </section>
    </>
  );
}

export default Categories;
