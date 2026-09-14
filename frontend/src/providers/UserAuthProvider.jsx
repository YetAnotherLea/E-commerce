import { useState, useEffect } from "react";
import { UserAuthContext } from "../contexts";
import { fetchCurrentUser } from "../api";

export const UserAuthProvider = ({ children }) => {
  // Valeur initiale issue du localStorage, pour éviter un clignotement au
  // chargement. Elle est remplacée par la réponse du serveur juste après.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // C'est la session serveur qui détermine qui est connecté
  useEffect(() => {
    let active = true;

    fetchCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserAuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserAuthContext.Provider>
  );
};
