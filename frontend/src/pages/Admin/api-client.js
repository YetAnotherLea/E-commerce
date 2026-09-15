import { api as axiosInstance, assetUrl } from "../../api";

const normalizeProduct = (product) => ({
  ...product,
  ImageURL: assetUrl(product.ImageURL),
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

  try {
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
    const normalized = response.data.map(normalizeProduct);
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

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("categories");
    return response.data;
  } catch (error) {
    console.error("Erreur dans getCategories:", error);
    throw error;
  }
};
