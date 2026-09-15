import { useState } from "react";
import "../../styles/Dashboard.css";
import { api } from "../../api";

function AddProductForm({ onProductAdded }) {
  const [formData, setFormData] = useState({
    ProductId: "",
    Gender: "",
    Category: "",
    SubCategory: "",
    ProductType: "",
    Colour: "",
    ProductUsage: "",
    ProductTitle: "",
    Image: "",
    ImageURL: "",
    Price: 0.0,
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
    try {
      await api.post("admin/products", formData);
      setFormData({
        ProductId: "",
        Gender: "",
        Category: "",
        SubCategory: "",
        ProductType: "",
        Colour: "",
        ProductUsage: "",
        ProductTitle: "",
        Image: "",
        ImageURL: "",
        Price: 0.0,
      });
      onProductAdded();
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit :", error);
      alert(`Erreur lors de l'ajout du produit : ${error.message}`);
    }
  };

  return (
    <div className="add-product-form">
      <h2 className="form-title">Nouveau produit</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">
            Titre :{" "}
            <input
              className="form-input"
              type="text"
              name="ProductTitle"
              value={formData.ProductTitle}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="form-field">
          <label className="form-label">
            Prix :{" "}
            <input
              className="form-input"
              type="number"
              name="Price"
              step="0.01"
              value={formData.Price}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="form-field">
          <label className="form-label">
            Identifiant produit :{" "}
            <input
              className="form-input"
              type="text"
              name="ProductId"
              value={formData.ProductId}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-field">
          <label className="form-label">
            Catégorie :{" "}
            <input
              className="form-input"
              type="text"
              name="Category"
              value={formData.Category}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="form-field">
          <label className="form-label">
            Genre :{" "}
            <input
              className="form-input"
              type="text"
              name="Gender"
              value={formData.Gender}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-field">
          <label className="form-label">
            Sous-catégorie :{" "}
            <input
              className="form-input"
              type="text"
              name="SubCategory"
              value={formData.SubCategory}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-field">
          <label className="form-label">
            Type de produit :{" "}
            <input
              className="form-input"
              type="text"
              name="ProductType"
              value={formData.ProductType}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-field">
          <label className="form-label">
            Couleur :{" "}
            <input
              className="form-input"
              type="text"
              name="Colour"
              value={formData.Colour}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-field">
          <label className="form-label">
            Utilisation :{" "}
            <input
              className="form-input"
              type="text"
              name="ProductUsage"
              value={formData.ProductUsage}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-field">
          <label className="form-label">
            Fichier image :{" "}
            <input
              className="form-input"
              type="text"
              name="Image"
              value={formData.Image}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-field">
          <label className="form-label">
            URL de l'image :{" "}
            <input
              className="form-input"
              type="text"
              name="ImageURL"
              value={formData.ImageURL}
              onChange={handleChange}
            />
          </label>
        </div>
        <button className="submit-btn" type="submit">
          Ajouter le produit
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;
