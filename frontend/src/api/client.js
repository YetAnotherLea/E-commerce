import axios from "axios";

// Dev : http://localhost:8000/api — Prod : /api (même domaine)
const API_URL = import.meta.env.VITE_API_URL ?? "/api";

// Préfixe des fichiers servis hors /api (images produits). Vide en production.
export const API_ORIGIN = /^https?:\/\//.test(API_URL)
  ? new URL(API_URL).origin
  : "";

export const assetUrl = (path) =>
  path?.startsWith("/uploads/") ? `${API_ORIGIN}${path}` : path;

// withCredentials : l'authentification repose sur le cookie de session Symfony
export const api = axios.create({
  baseURL: API_URL.endsWith("/") ? API_URL : `${API_URL}/`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;
