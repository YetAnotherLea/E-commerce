import { useEffect } from "react";
import { getProducts, getDistinct } from "../pages/Admin/api-client";

export const useCatalogData = (state) => {
  const {
    FILTER_FIELDS,
    isInitialized,
    currentPage,
    searchText,
    sortField,
    sortOrder,
    filters,
    setProducts,
    setHasMore,
    setError,
    setLoading,
    setFilterOptions,
    setTotalProducts,
  } = state;

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const promises = FILTER_FIELDS.map((field) =>
          getDistinct(field.distinctField)
        );

        const results = await Promise.all(promises);

        const newFilterOptions = {};
        FILTER_FIELDS.forEach((field, index) => {
          newFilterOptions[field.key] = results[index] || [];
        });

        setFilterOptions(newFilterOptions);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des options de filtres:",
          err
        );
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch products
  useEffect(() => {
    if (!isInitialized) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const sort = {};
        if (sortField) {
          sort[sortField] = sortOrder === "asc" ? 1 : -1;
        }

        const params = {
          page: currentPage,
          pageSize: 20,
          searchText: searchText || null,
          sort,
        };

        FILTER_FIELDS.forEach((field) => {
          if (filters[field.key] !== "All") {
            params[field.key] = filters[field.key];
          }
        });

        console.log("Paramètres envoyés à getProducts:", params);
        const data = await getProducts(params);
        console.log("Données reçues:", data);

        setProducts(data);
        setHasMore(data.length === 20);
      } catch (err) {
        setError("Erreur : " + err.message);
        console.error("Erreur dans fetchProducts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    isInitialized,
    currentPage,
    searchText,
    sortField,
    sortOrder,
    ...Object.values(filters),
  ]);

  // Fetch total products count
  useEffect(() => {
    if (!isInitialized) return;

    const fetchTotalProducts = async () => {
      try {
        const sort = {};
        if (sortField) {
          sort[sortField] = sortOrder === "asc" ? 1 : -1;
        }

        const countParams = {
          page: 1,
          pageSize: 10000,
          searchText: searchText || null,
          sort,
        };

        FILTER_FIELDS.forEach((field) => {
          if (filters[field.key] !== "All") {
            countParams[field.key] = filters[field.key];
          }
        });

        console.log("Paramètres pour le comptage:", countParams);
        const allData = await getProducts(countParams);
        console.log("Nombre total de produits:", allData.length);
        setTotalProducts(allData.length);
      } catch (err) {
        console.error("Erreur lors du comptage des produits:", err);
        setTotalProducts(0);
      }
    };

    fetchTotalProducts();
  }, [
    isInitialized,
    ...FILTER_FIELDS.map((field) => filters[field.key]),
    searchText,
    sortField,
    sortOrder,
  ]);
};
