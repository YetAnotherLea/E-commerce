import { useState } from "react";

function AdminProduct() {
  const [formData, setFormData] = useState({
    ProductId: "",
    ProductTitle: "",
    Price: "",
    // ... tous les autres champs
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu feras la requête POST vers /admin/api/products
    fetch("http://localhost:8000/admin/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => console.log("Product added:", data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="ProductTitle"
        value={formData.ProductTitle}
        onChange={handleChange}
        placeholder="Product Title"
      />
      <input
        type="number"
        name="Price"
        value={formData.Price}
        onChange={handleChange}
        placeholder="Price"
      />
      <button type="submit">Add Product</button>
    </form>
  );
}
export default AdminProduct;
