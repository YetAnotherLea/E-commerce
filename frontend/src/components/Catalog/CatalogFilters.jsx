function CatalogFilters({
  filterFields,
  filters,
  filterOptions,
  onFilterChange,
}) {
  const renderFilterSelect = (field) => (
    <div className="filter-group" key={field.key}>
      <label>{field.label}</label>
      <select
        value={filters[field.key]}
        onChange={(e) => onFilterChange(field.key, e.target.value)}
      >
        <option value="All">Tous</option>
        {filterOptions[field.key].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="filters-grid">
      {filterFields.map((field) => renderFilterSelect(field))}
    </div>
  );
}

export default CatalogFilters;
