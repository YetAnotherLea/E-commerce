import { useState, useEffect } from "react";
import "../../styles/Dashboard.css";

function ProductManagement({ reloadProducts }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }

      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [reloadProducts]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/admin/products/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete product.");
        }

        alert("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product.");
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setEditFormData({
      ProductTitle: product.ProductTitle || "",
      Price: product.Price || "",
      Gender: product.Gender || "",
      Category: product.Category || "",
      SubCategory: product.SubCategory || "",
      ProductType: product.ProductType || "",
      Colour: product.Colour || "",
      ProductUsage: product.ProductUsage || "",
      ImageURL: product.ImageURL || "",
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/products/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editFormData,
            Price: parseFloat(editFormData.Price),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product.");
      }

      alert("Product updated successfully!");
      setEditingProduct(null);
      setEditFormData({});
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product.");
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditFormData({});
  };

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return <div className="loading">Loading products for management...</div>;
  }

  return (
    <div className="product-management">
      <h2 className="management-title">Manage Products</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Gender</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Type</th>
            <th>Colour</th>
            <th>Usage</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id || "-"}</td>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="text"
                    value={editFormData.ProductTitle}
                    onChange={(e) =>
                      handleInputChange("ProductTitle", e.target.value)
                    }
                  />
                ) : (
                  product.ProductTitle || "-"
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="number"
                    value={editFormData.Price}
                    onChange={(e) => handleInputChange("Price", e.target.value)}
                  />
                ) : (
                  `$${product.Price}`
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="text"
                    value={editFormData.Gender}
                    onChange={(e) =>
                      handleInputChange("Gender", e.target.value)
                    }
                  />
                ) : (
                  product.Gender || "-"
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="text"
                    value={editFormData.Category}
                    onChange={(e) =>
                      handleInputChange("Category", e.target.value)
                    }
                  />
                ) : (
                  product.Category || "-"
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="text"
                    value={editFormData.SubCategory}
                    onChange={(e) =>
                      handleInputChange("SubCategory", e.target.value)
                    }
                  />
                ) : (
                  product.SubCategory || "-"
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="text"
                    value={editFormData.ProductType}
                    onChange={(e) =>
                      handleInputChange("ProductType", e.target.value)
                    }
                  />
                ) : (
                  product.ProductType || "-"
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="text"
                    value={editFormData.Colour}
                    onChange={(e) =>
                      handleInputChange("Colour", e.target.value)
                    }
                  />
                ) : (
                  product.Colour || "-"
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="text"
                    value={editFormData.ProductUsage}
                    onChange={(e) =>
                      handleInputChange("ProductUsage", e.target.value)
                    }
                  />
                ) : (
                  product.ProductUsage || "-"
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <input
                    type="url"
                    value={editFormData.ImageURL}
                    onChange={(e) =>
                      handleInputChange("ImageURL", e.target.value)
                    }
                  />
                ) : (
                  product.ImageURL || "-"
                )}
              </td>
              <td>
                {editingProduct === product.id ? (
                  <div>
                    <button
                      className="save-btn"
                      onClick={() => handleSaveEdit(product.id)}
                    >
                      Save
                    </button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductManagement;
