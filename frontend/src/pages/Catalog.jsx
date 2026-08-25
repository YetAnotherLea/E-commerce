import { useCatalogState } from "../hooks/useCatalogState";
import { useCatalogData } from "../hooks/useCatalogData";
import { useCatalogHandlers } from "../hooks/useCatalogHandlers";
import {
  CatalogSearch,
  CatalogFilters,
  CatalogSort,
  CatalogFilterActions,
  CatalogProductGrid,
  CatalogPagination,
} from "../components";
import "../styles/Catalog.css";

function Catalog() {
  // State management
  const state = useCatalogState();

  // Data fetching
  useCatalogData(state);

  // Event handlers
  const handlers = useCatalogHandlers(state);

  const {
    products,
    totalProducts,
    currentPage,
    pageInputValue,
    hasMore,
    error,
    loading,
    searchText,
    filters,
    sortField,
    sortOrder,
    filterOptions,
    hasActiveFilters,
    maxPages,
    FILTER_FIELDS,
    SORT_FIELDS,
  } = state;

  const {
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handlePageInputChange,
    handlePageInputKeyPress,
    handlePageInputBlur,
    clearAllFilters,
    handleKeyDown,
  } = handlers;

  return (
    <div className="catalog-page">
      {error && <p className="error-message">{error}</p>}

      {/* FILTERS */}
      <div className="catalog-filters">
        <CatalogFilterActions
          totalProducts={totalProducts}
          onClearFilters={clearAllFilters}
        />

        <CatalogSearch
          searchText={searchText}
          onSearchChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />

        <CatalogFilters
          filterFields={FILTER_FIELDS}
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
        />

        <CatalogSort
          sortFields={SORT_FIELDS}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      {/* PRODUCTS GRID */}
      <div className="catalog-products-container">
        <CatalogProductGrid
          products={products}
          loading={loading}
          hasActiveFilters={hasActiveFilters()}
        />

        {/* PAGINATION */}
        <CatalogPagination
          currentPage={currentPage}
          maxPages={maxPages}
          pageInputValue={pageInputValue}
          hasMore={hasMore}
          products={products}
          loading={loading}
          onPageChange={handlePageChange}
          onPageInputChange={handlePageInputChange}
          onPageInputKeyPress={handlePageInputKeyPress}
          onPageInputBlur={handlePageInputBlur}
        />
      </div>
    </div>
  );
}

export default Catalog;
