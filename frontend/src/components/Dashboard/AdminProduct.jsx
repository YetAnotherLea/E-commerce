import { useState } from "react";
import { api } from "../../api";

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
    api
      .post("admin/products", formData)
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
