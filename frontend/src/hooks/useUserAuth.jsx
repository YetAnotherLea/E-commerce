// contexts/useUserAuth.js
import { useContext } from "react";
import { UserAuthContext } from "../contexts";

export const useUserAuth = () => useContext(UserAuthContext);
