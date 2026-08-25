import "../styles/Navbar.css";
import {
  logo,
  cartIcon,
  search,
  userIcon,
  userIconConnected,
  //closeIcon,
  emptyCartIcon,
} from "../assets";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserAuth, useCart } from "../hooks";

function Navbar() {
  const { user, setUser } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  useEffect(() => {
    if (location.pathname === "/catalog") {
      const urlParams = new URLSearchParams(location.search);
      const searchParam = urlParams.get("search") || "";
      setSearchText(searchParam);
    } else {
      setSearchText("");
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
      });
      localStorage.removeItem("user");
      setUser(null);
      alert("You have been logged out.");
      if (location.pathname !== "/") {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchText.trim()) {
      navigate(
        `/catalog?search=${encodeURIComponent(searchText.trim())}&page=1`,
      );
    } else {
      navigate("/catalog?page=1");
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
    if (e.key === "Escape") {
      setSearchText("");
    }
  };

  return (
    <header className="Navbar">
      <section className="nav-left-section">
        <a href="/" title="Accueil">
          <img loading="lazy" alt="Hainarie Logo" src={logo} />
        </a>
        <nav>
          <ul>
            <li>
              <a href="/catalog?page=1&gender=Women" title="Femme">
                Women
              </a>
            </li>
            <li>
              <a href="/catalog?page=1&gender=Men" title="Homme">
                Men
              </a>
            </li>
            <li>
              <a href="/catalog?page=1&gender=Girls" title="Filles">
                Girl
              </a>
            </li>
            <li>
              <a href="/catalog?page=1&gender=Boys" title="Garçons">
                Boy
              </a>
            </li>
            <li className="dropdown">
              <a href="/catalog" title="Catalogue">
                Catalog
              </a>
            </li>
            <li>
              <a href="/category" title="Derniers Stocks">
                Last Stock
              </a>
            </li>
          </ul>
        </nav>
      </section>
      <section className="nav-right-section">
        <div className="nav-search-container">
          <form className="nav-search-wrapper" onSubmit={handleSearchSubmit}>
            <input
              className="nav-input"
              placeholder="Rechercher..."
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
            <button className="nav-search-button" type="submit">
              <img
                loading="lazy"
                className="loop-icon"
                src={search}
                alt="Rechercher"
                title="Rechercher"
              />
            </button>
          </form>
        </div>
        <div className="nav-user-icon-container dropdown user-dropdown">
          <img
            loading="lazy"
            alt="Authentification utilisateur"
            title="Utilisateur"
            src={userIcon}
          />
          <div className="dropdown-menu">
            {!user && (
              <div className="unlogged-user-dropdown-menu-container">
                <a href="/login" className="nav-log-button nav-sign-in">
                  Connexion
                </a>
                <a href="/register" className="nav-log-button">
                  Inscription
                </a>
              </div>
            )}
            {user && (
              <div className="connected-user-dropdown-menu-container">
                <div className="connected-user-info">
                  <img
                    loading="lazy"
                    className="user-icon-connected"
                    src={userIconConnected}
                    alt="Utilisateur Connecté"
                  />
                  <p>Connecté en tant que </p>
                  <p>
                    {user.roles.includes("ROLE_ADMIN")
                      ? `Administrateur ${user.email}`
                      : `Utilisateur ${user.email}`}
                  </p>
                </div>
                <div className="nav-admin-container">
                  {user.roles.includes("ROLE_ADMIN") && (
                    <a href="/admin" className="nav-admin-button">
                      Tableau de bord Admin
                    </a>
                  )}
                </div>
                <div className="nav-logout-container">
                  <button onClick={handleLogout} className="user-button-logout">
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="nav-cart-icon-container dropdown">
          <a href="/cart" title="Panier">
            <img
              loading="lazy"
              className="cart-icon"
              alt="Panier"
              src={cartIcon}
            />
          </a>
          {/* DROPDOWN MENU - CART
          <div className="dropdown-menu cart-dropdown-menu">
            <img loading="lazy"
              className="nav-empty-cart-icon"
              src={emptyCartIcon}
              alt="Cart Icon"
            />
            <p>Votre panier est vide</p>
          </div>
        */}
        </div>
        <button
          onClick={toggleTheme}
          style={{
            marginRight: "10px",
            fontSize: "1.2rem",
            padding: "0 10px",
            background: "transparent",
            border: "none",
          }}
        >
          {isDark ? "⚪️" : "⚫"}
        </button>
      </section>
    </header>
  );
}

export default Navbar;
