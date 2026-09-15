import { useState, useEffect } from "react";
import "../../styles/Dashboard.css";
import { api } from "../../api";

function ProductManagement({ reloadProducts }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("admin/products");
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
    if (window.confirm("Supprimer ce produit ?")) {
      try {
        await api.delete(`admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Erreur lors de la suppression du produit :", error);
        alert("Erreur lors de la suppression du produit.");
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
      await api.patch(`admin/products/${id}`, {
        ...editFormData,
        Price: parseFloat(editFormData.Price),
      });

      setEditingProduct(null);
      setEditFormData({});
      fetchProducts();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
      alert("Erreur lors de la mise à jour du produit.");
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
    return <div className="loading">Chargement des produits…</div>;
  }

  return (
    <div className="product-management">
      <h2 className="management-title">Gestion des produits</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Prix</th>
            <th>Genre</th>
            <th>Catégorie</th>
            <th>Sous-catégorie</th>
            <th>Type</th>
            <th>Couleur</th>
            <th>Utilisation</th>
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
                      Enregistrer
                    </button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      Supprimer
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Modifier
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
