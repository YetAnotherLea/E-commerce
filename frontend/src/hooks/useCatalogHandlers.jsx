export const useCatalogHandlers = (state) => {
  const {
    FILTER_FIELDS,
    setSearchText,
    setCurrentPage,
    updateURL,
    setFilters,
    filters,
    setSortField,
    setSortOrder,
    sortField,
    sortOrder,
    scrollUp,
    setPageInputValue,
    currentPage,
    maxPages,
    setSearchParams,
  } = state;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setCurrentPage(1);
    updateURL({ search: value, page: 1 });
  };

  const handleFilterChange = (filterKey, value) => {
    setCurrentPage(1);
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);

    const updates = { page: 1, [filterKey]: value };
    updateURL(updates);
  };

  const handleSortChange = (field) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
    updateURL({ sortField: field, sortOrder: newOrder });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateURL({ page: newPage });
    scrollUp();
  };

  const handlePageInputChange = (e) => {
    setPageInputValue(e.target.value);
  };

  const handlePageInputKeyPress = (e) => {
    if (e.key === "Enter") {
      const value = state.pageInputValue.trim();
      if (value === "") {
        setPageInputValue(currentPage.toString());
        return;
      }

      const page = parseInt(value);
      if (page && page >= 1 && page <= maxPages && page !== currentPage) {
        handlePageChange(page);
      } else if (!page || page < 1 || page > maxPages) {
        setPageInputValue(currentPage.toString());
      }
    }
  };

  const handlePageInputBlur = () => {
    const value = state.pageInputValue.trim();
    if (
      value === "" ||
      !parseInt(value) ||
      parseInt(value) < 1 ||
      parseInt(value) > maxPages
    ) {
      setPageInputValue(currentPage.toString());
    }
  };

  const clearAllFilters = () => {
    setSearchText("");

    const clearedFilters = {};
    FILTER_FIELDS.forEach((field) => {
      clearedFilters[field.key] = "All";
    });
    setFilters(clearedFilters);

    setSortField("");
    setSortOrder("asc");
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setSearchText("");
      updateURL({ search: "" });
    }
  };

  return {
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handlePageInputChange,
    handlePageInputKeyPress,
    handlePageInputBlur,
    clearAllFilters,
    handleKeyDown,
  };
};
