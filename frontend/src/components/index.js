// /
import Navbar from "./Navbar";
import Footer from "./Footer";

export { Navbar, Footer };

// Authentification
import Login from "./Authenticate/Login";
import Register from "./Authenticate/Register";
import { ProtectedRoute } from "./Authenticate/ProtectedRoutes";

export { Login, Register, ProtectedRoute };

// /Homepage
import Categories from "./Homepage/Categories";
import CTA from "./Homepage/CTA";
import Genders from "./Homepage/Genders";
import HeroSection from "./Homepage/HeroSection";
import Popular from "./Homepage/Popular";

export { Categories, CTA, Genders, HeroSection, Popular };

// /Dashboard
import AddProductForm from "../components/Dashboard/AddProductForm";
import AddUserForm from "../components/Dashboard/AddUserForm";
import AdminProduct from "../components/Dashboard/AdminProduct";
import ProductManagement from "../components/Dashboard/ProductManagement";
import UserManagement from "../components/Dashboard/UserManagement";

export {
  AddProductForm,
  AddUserForm,
  AdminProduct,
  ProductManagement,
  UserManagement,
};

// Catalog
import CatalogSearch from "./Catalog/CatalogSearch";
import CatalogFilters from "./Catalog/CatalogFilters";
import CatalogSort from "./Catalog/CatalogSort";
import CatalogFilterActions from "./Catalog/CatalogFilterActions";
import CatalogProductGrid from "./Catalog/CatalogProductGrid";
import CatalogPagination from "./Catalog/CatalogPagination";

export {
  CatalogSearch,
  CatalogFilters,
  CatalogSort,
  CatalogFilterActions,
  CatalogProductGrid,
  CatalogPagination,
};
