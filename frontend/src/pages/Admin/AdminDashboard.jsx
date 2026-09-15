import { useState } from "react";
import {
  AddProductForm,
  AddUserForm,
  ProductManagement,
  UserManagement,
} from "../../components/index";
import "../../styles/Dashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [reloadProductsKey, setReloadProductsKey] = useState(0);
  const [reloadUsersKey, setReloadUsersKey] = useState(0);

  const handleProductAdded = () => {
    setReloadProductsKey((prev) => prev + 1);
  };

  const handleUserAdded = () => {
    setReloadUsersKey((prev) => prev + 1);
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <>
      <div className="admin-dashboard">
        <h1 className="admin-title">Tableau de bord</h1>

        <div className="tabs-container">
          <div className="tab-buttons">
            <button
              className={`tab-button ${
                activeTab === "products" ? "active" : ""
              }`}
              onClick={() => switchTab("products")}
            >
              Gestion des produits
            </button>
            <button
              className={`tab-button ${activeTab === "users" ? "active" : ""}`}
              onClick={() => switchTab("users")}
            >
              Gestion des utilisateurs
            </button>
          </div>

          {/*Products*/}
          {activeTab === "products" && (
            <div className="tab-content">
              <AddProductForm onProductAdded={handleProductAdded} />
              <hr />
              <ProductManagement reloadProducts={reloadProductsKey} />
            </div>
          )}

          {/*Users*/}
          {activeTab === "users" && (
            <div className="tab-content">
              <AddUserForm onUserAdded={handleUserAdded} />
              <hr />
              <UserManagement reloadUsers={reloadUsersKey} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
