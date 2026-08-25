import { useState } from "react";
import "../../styles/Dashboard.css";

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
      const response = await fetch("http://localhost:8000/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product.");
      }
      const data = await response.json();
      alert("Product added successfully!");
      console.log("Product added:", data);
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
      console.error("Error adding product:", error);
      alert(`Error adding product: ${error.message}`);
    }
  };

  return (
    <div className="add-product-form">
      <h2 className="form-title">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">
            Product Title:{" "}
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
            Price:{" "}
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
            Product ID:{" "}
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
            Category:{" "}
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
            Gender:{" "}
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
            SubCategory:{" "}
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
            Product Type:{" "}
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
            Colour:{" "}
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
            Product Usage:{" "}
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
            Image file:{" "}
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
            Image URL:{" "}
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
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;
