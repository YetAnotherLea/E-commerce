import api from "./client";

export const login = async (email, password) => {
  const { data } = await api.post("login", { email, password });
  return data.user;
};

export const logout = async () => {
  await api.post("logout");
};

// Le rôle est imposé par le serveur : ne jamais envoyer de `roles` ici
export const register = async (email, password) => {
  const { data } = await api.post("register", { email, password });
  return data.user;
};

// Source de vérité de l'état connecté, null si la session est fermée
export const fetchCurrentUser = async () => {
  try {
    const { data } = await api.get("me");
    return data;
  } catch {
    return null;
  }
};
