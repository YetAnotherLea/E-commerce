function CatalogFilterActions({ totalProducts, onClearFilters }) {
  return (
    <div className="filter-actions">
      <button onClick={onClearFilters} className="clear-filters-btn">
        Effacer tous les filtres
      </button>
      <p className="results-count">{totalProducts} produit(s) trouvé(s)</p>
    </div>
  );
}

export default CatalogFilterActions;
