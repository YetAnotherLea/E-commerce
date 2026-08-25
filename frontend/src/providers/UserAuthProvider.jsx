import { useState, useEffect } from "react";
import { UserAuthContext } from "../contexts";

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserAuthContext.Provider value={{ user, setUser }}>
      {children}
    </UserAuthContext.Provider>
  );
};
