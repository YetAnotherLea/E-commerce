import { Link } from "react-router-dom";

function CatalogProductGrid({ products, loading, hasActiveFilters }) {
  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="grid-catalog-product">
      {products.length > 0 ? (
        products.map((p) => (
          <div className="catalog-product" key={p.ProductId}>
            <Link to={`/product/${p.ProductId}`}>
              <div className="catalog-product-image">
                {p.ImageURL ? (
                  <img
                    loading="lazy"
                    src={p.ImageURL}
                    alt={p.ProductTitle}
                    width={100}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                ) : (
                  <span>No image available</span>
                )}
              </div>
              <br />
              <div className="catalog-product-description">
                <h4>{p.ProductTitle}</h4>
                <p className="product-price">{p.Price}$</p>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <div className="no-products">
          {hasActiveFilters
            ? "No product found with those filters"
            : "No product found"}
        </div>
      )}
    </div>
  );
}

export default CatalogProductGrid;
