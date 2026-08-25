import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const FILTER_FIELDS = [
  {
    key: "category",
    label: "Catégorie",
    apiField: "Category",
    distinctField: "Category",
  },
  {
    key: "gender",
    label: "Genre",
    apiField: "Gender",
    distinctField: "Gender",
  },
  {
    key: "subCategory",
    label: "Sous-catégorie",
    apiField: "SubCategory",
    distinctField: "SubCategory",
  },
  {
    key: "productType",
    label: "Type de produit",
    apiField: "ProductType",
    distinctField: "ProductType",
  },
  {
    key: "colour",
    label: "Couleur",
    apiField: "Colour",
    distinctField: "Colour",
  },
  {
    key: "usage",
    label: "Utilisation",
    apiField: "Usage",
    distinctField: "Usage",
  },
];

const SORT_FIELDS = [
  { key: "ProductTitle", label: "Nom" },
  { key: "Price", label: "Prix" },
  { key: "Weight", label: "Poids" },
];

export const useCatalogState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState(() => {
    const initialFilters = {};
    FILTER_FIELDS.forEach((field) => {
      initialFilters[field.key] = "All";
    });
    return initialFilters;
  });
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterOptions, setFilterOptions] = useState(() => {
    const initialOptions = {};
    FILTER_FIELDS.forEach((field) => {
      initialOptions[field.key] = [];
    });
    return initialOptions;
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // URL synchronization
  useEffect(() => {
    const urlSearchText = searchParams.get("search") || "";
    const urlPage = parseInt(searchParams.get("page")) || 1;
    const urlSortField = searchParams.get("sortField") || "";
    const urlSortOrder = searchParams.get("sortOrder") || "asc";

    const urlFilters = {};
    FILTER_FIELDS.forEach((field) => {
      urlFilters[field.key] = searchParams.get(field.key) || "All";
    });

    setSearchText(urlSearchText);
    setFilters(urlFilters);
    setCurrentPage(urlPage);
    setSortField(urlSortField);
    setSortOrder(urlSortOrder);
    setPageInputValue(urlPage.toString());

    setIsInitialized(true);
  }, [searchParams]);

  useEffect(() => {
    setPageInputValue(currentPage.toString());
  }, [currentPage]);

  // Helper functions
  const updateURL = (newParams) => {
    const params = new URLSearchParams(searchParams);

    Object.keys(newParams).forEach((key) => {
      if (newParams[key] && newParams[key] !== "All" && newParams[key] !== "") {
        params.set(key, newParams[key]);
      } else {
        params.delete(key);
      }
    });

    setSearchParams(params);
  };

  const hasActiveFilters = () => {
    if (searchText) return true;
    return FILTER_FIELDS.some((field) => filters[field.key] !== "All");
  };

  const maxPages = Math.ceil(totalProducts / 20);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    // State
    products,
    setProducts,

    totalProducts,
    setTotalProducts,

    currentPage,
    setCurrentPage,

    pageInputValue,
    setPageInputValue,

    hasMore,
    setHasMore,

    error,
    setError,

    loading,
    setLoading,

    searchText,
    setSearchText,

    filters,
    setFilters,

    sortField,
    setSortField,

    sortOrder,
    setSortOrder,

    filterOptions,
    setFilterOptions,

    isInitialized,

    // Helpers
    updateURL,
    hasActiveFilters,
    maxPages,
    scrollUp,

    // Constants
    FILTER_FIELDS,
    SORT_FIELDS,
  };
};
