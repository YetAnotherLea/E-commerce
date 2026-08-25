function CatalogSort({ sortFields, sortField, sortOrder, onSortChange }) {
  const getSortIcon = (field) => {
    if (sortField !== field) return "↕";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="sort-controls">
      <label>Trier par :</label>
      <div className="sort-controls-buttons">
        {sortFields.map((field) => (
          <button
            key={field.key}
            onClick={() => onSortChange(field.key)}
            className={sortField === field.key ? "active" : ""}
          >
            {field.label} {getSortIcon(field.key)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CatalogSort;
