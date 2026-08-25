function CatalogPagination({
  currentPage,
  maxPages,
  pageInputValue,
  hasMore,
  products,
  loading,
  onPageChange,
  onPageInputChange,
  onPageInputKeyPress,
  onPageInputBlur,
}) {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
      >
        Précédent
      </button>

      <div className="page-info">
        <span>Page </span>
        <input
          type="text"
          min="1"
          max={maxPages}
          value={pageInputValue}
          onChange={onPageInputChange}
          onKeyDown={onPageInputKeyPress}
          onBlur={onPageInputBlur}
          style={{ width: "60px", padding: "2px 5px" }}
        />
        <span> sur {maxPages}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore || products.length === 0 || loading}
      >
        Suivant
      </button>
    </div>
  );
}

export default CatalogPagination;
