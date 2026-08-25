function CatalogSearch({ searchText, onSearchChange, onKeyDown }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={searchText}
        onChange={onSearchChange}
        onKeyDown={onKeyDown}
        className="search-input"
      />
    </div>
  );
}

export default CatalogSearch;