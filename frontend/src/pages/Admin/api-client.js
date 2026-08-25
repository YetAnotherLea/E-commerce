import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

const cache = {};

const normalizeProduct = (product) => ({
  ...product,
  ImageURL: product.ImageURL?.startsWith("/uploads/")
    ? `${API_URL.replace("/api/", "")}${product.ImageURL}`
    : product.ImageURL,
});

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "x-auth": "bCdhbm7pZSBwcm9jaGFpbmUgYydlc3QgZHlsYW4h" },
});

const FIELD_MAPPING = {
  category: "Category",
  gender: "Gender",
  subCategory: "SubCategory",
  productType: "ProductType",
  colour: "Colour",
  usage: "Usage",
};

export const getProducts = async ({
  page = 1,
  pageSize = 20,
  searchText = null,
  sort = {},
  ...otherParams
}) => {
  let payload = {};

  Object.keys(otherParams).forEach((key) => {
    const value = otherParams[key];
    if (value && value !== "All") {
      const apiField = FIELD_MAPPING[key] || key;
      payload[apiField] = value;
    }
  });

  if (searchText && searchText.trim() !== "") {
    payload.ProductTitle = { $regex: searchText.trim(), $options: "i" };
  }

  const hasFilters = Object.keys(payload).length > 0;
  const hasSort = Object.keys(sort).length > 0;

  console.log("API getProducts - hasFilters:", hasFilters, "payload:", payload);
  console.log("API getProducts - hasSort:", hasSort, "sort:", sort);

  try {
    console.log("Utilisation de POST /products");
    const response = await axiosInstance.post(
      "products",
      {
        payload,
        sort,
      },
      {
        params: { page, pageSize },
      },
    );
    console.log("Réponse POST:", response.data.length, "produits");
    const normalized = response.data.map(normalizeProduct);
    console.log("Premier produit normalisé:", normalized[0]?.ImageURL);
    return normalized;
  } catch (error) {
    console.error("Erreur dans getProducts:", error);
    throw error;
  }
};

//GET Distinct - Récupère les valeurs distinctes pour un champ
export const getDistinct = async (field) => {
  try {
    const response = await axiosInstance.get("distinct", {
      params: { field },
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur dans getDistinct pour le champ ${field}:`, error);
    throw error;
  }
};

//POST Products - Récupère le total produit (pour compatibilité)
export const getTotalProducts = async () => {
  try {
    const response = await axiosInstance.post(
      "products",
      {
        payload: {},
        sort: {},
      },
      {
        params: { page: 1, pageSize: 10000 },
      },
    );
    return response.data.length;
  } catch (error) {
    console.error("Erreur dans getTotalProducts:", error);
    throw error;
  }
};

//POST Category (pour compatibilité)
export const getCategoryAll = async (category, page = 1) => {
  try {
    const response = await axiosInstance.post(
      "products",
      {
        payload: { Category: category },
        sort: {},
      },
      {
        params: { page },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur dans getCategoryAll pour ${category}:`, error);
    throw error;
  }
};

// Fonctions spécifiques pour les catégories (pour compatibilité)
export const getCategoryBelts = async () => {
  try {
    const response = await axiosInstance.get("products", {
      params: {
        Category: "Belt",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans getCategoryBelts:", error);
    throw error;
  }
};

export const getCategoryApparels = async () => {
  try {
    const response = await axiosInstance.get("products", {
      params: {
        Category: "Apparel",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans getCategoryApparels:", error);
    throw error;
  }
};

export const getCategoryFootwear = async () => {
  try {
    const response = await axiosInstance.get("products", {
      params: {
        Category: "Footwear",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans getCategoryFootwear:", error);
    throw error;
  }
};

// POST Gender (pour compatibilité)
export const getGenderProducts = async (gender, page = 1) => {
  try {
    const response = await axiosInstance.post(
      "products",
      {
        payload: { Gender: gender },
        sort: {},
      },
      {
        params: { page },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur dans getGenderProducts pour ${gender}:`, error);
    throw error;
  }
};

//GET Gender (pour compatibilité)
export const getBoysProducts = async () => {
  try {
    const response = await axiosInstance.get("products", {
      params: {
        Gender: "Boys",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans getBoysProducts:", error);
    throw error;
  }
};

export const getGirlsProducts = async () => {
  try {
    const response = await axiosInstance.get("products", {
      params: {
        Gender: "Girls",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans getGirlsProducts:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("categories");
    return response.data;
  } catch (error) {
    console.error("Erreur dans getCategories:", error);
    throw error;
  }
};
