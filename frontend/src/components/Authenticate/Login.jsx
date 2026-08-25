import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logo } from "../../assets";
import { useUserAuth } from "../../hooks";

function Login() {
  const { setUser } = useUserAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target["login-email"].value.trim();
    const password = e.target["login-password"].value;

    if (!email || !password) {
      setError("Veuillez remplir tous les champs correctement");
      return;
    }

    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Échec de la connexion.");
      }
      const data = await response.json();
      alert("Connexion réussie !");
      console.log("Utilisateur connecté :", data.user);
      const loggedInUser = data.user;
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Échec de la connexion. Veuillez vérifier vos identifiants.");
    }
  };
  return (
    <>
      <div className="container">
        <div className="form-card">
          <img loading="lazy" className="logo" src={logo} />

          <form id="form-signin" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label htmlFor="login-email">E-mail</label>
              <input
                className="input"
                type="email"
                id="login-email"
                name="email"
                placeholder="Entrez votre e-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Mot de passe</label>
              <input
                className="input"
                type="password"
                id="login-password"
                name="password"
                placeholder="Entrez votre mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Se connecter
            </button>

            {error && <div className="error">{error}</div>}

            <div className="links">
              <p>
                Vous n'avez pas de compte ? <a href="/register">En créer un</a>
              </p>
            </div>

            <div className="links">
              <a href="/reset">Mot de passe oublié ?</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
