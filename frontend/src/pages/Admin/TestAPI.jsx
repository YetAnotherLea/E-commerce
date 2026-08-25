import { useEffect, useState } from "react";
import { getDistinct, getProducts } from "./api-client";

function TestAPI() {
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getDistinct("SubCategory");
        setSubCategories(cats);

        const generalProds = await getProducts(10);
        setProducts(generalProds);
      } catch (err) {
        setError("Erreur : " + err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>SubCategories</h2>
      {error && <p>{error}</p>}
      <ul>
        {subCategories.map((cat, index) => (
          <li key={index}>{cat}</li>
        ))}
      </ul>

      <h2>Produits (10 généraux)</h2>
      <ul>
        {products.map((p) => (
          <li key={p._id}>
            {p.ImageURL ? (
              <img
                loading="lazy"
                src={p.ImageURL}
                alt={p.ProductTitle}
                width={100}
              />
            ) : (
              <span>Image indisponible</span>
            )}
            <br />
            {p.ProductTitle} - {p.Price}€
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestAPI;
