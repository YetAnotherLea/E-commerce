import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../pages/Admin/api-client";

function Popular() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const data = await getProducts({ pageSize: 9 });
        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

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

  if (loading) return <div>Chargement des produits populaires...</div>;
  if (!products.length) return <div>Aucun produit populaire trouvé.</div>;

  const cards = [
    {
      id: "intro",
      type: "intro",
      title: "Une sélection de nos produits les plus populaires",
      buttonText: "Tout voir",
    },
    ...products.map((product) => ({
      id: product.ProductId,
      type: product.Type,
      name: product.ProductTitle,
      price: product.Price,
      image: product.ImageURL || "default-image.jpg",
    })),
  ];

  return (
    <section className="carousel-container popular-section">
      <div className="carousel">
        <div id="carousel-track" className="carousel-track">
          {cards.map((card, index) => (
            <div className="card" key={index}>
              {card.type === "intro" ? (
                <div className="intro-card">
                  <h3>{card.title}</h3>
                  <a href="/populaire" className="cta-button">
                    {card.buttonText}
                  </a>
                </div>
              ) : (
                <div className="product-card">
                  <Link className="popular-link" to={`/product/${card.id}`}>
                    <img loading="lazy" src={card.image} alt={card.name} />
                    <div className="popular-product-info">
                      <h4>{card.name}</h4>
                      <p className="popular-product-price">${card.price}</p>
                    </div>
                  </Link>
                </div>
              )}
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
  );
}

export default Popular;
