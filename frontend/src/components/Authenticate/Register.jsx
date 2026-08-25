import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logo } from "../../assets";

function Register({ onUserAdded }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    roles: ["ROLE_USER"],
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
    const email = e.target["signup-email"].value.trim();
    const password = e.target["signup-password"].value;

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Échec de l'ajout de l'utilisateur.");
      }
      alert("Utilisateur ajouté avec succès !");
      setFormData({ email: "", password: "", roles: ["ROLE_USER"] });
      onUserAdded;
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", error);
      alert("Erreur lors de l'ajout de l'utilisateur.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="form-card" id="signup-card">
          <img loading="lazy" className="logo" src={logo} />

          <form id="form-register" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label htmlFor="signup-email">E-mail</label>
              <input
                className="input"
                type="email"
                id="signup-email"
                name="email"
                placeholder="Entrez un e-mail valide"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Mot de passe</label>
              <input
                className="input"
                type="password"
                id="signup-password"
                name="password"
                placeholder="Entrez un mot de passe d'au moins 8 caractères"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Créer votre compte
            </button>

            {error && <div className="error">{error}</div>}

            <div className="links">
              <p>Vous avez déjà un compte ?</p>
              <a href="/login">Se connecter</a>
            </div>

            <p className="terms">
              En créant un compte, vous acceptez les{" "}
              <a href="#">conditions d'utilisation et de vente</a> de Hainarie.
              Consultez notre <a href="#">déclaration de confidentialité</a>,
              notre <a href="#">politique relative aux cookies</a> ainsi que
              notre{" "}
              <a href="#">
                politique de publicité ciblée par centres d'intérêt
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
