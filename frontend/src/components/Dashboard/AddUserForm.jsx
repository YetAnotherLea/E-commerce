import { useState } from "react";
import "../../styles/Dashboard.css";
import { api } from "../../api";

function AddUserForm({ onUserAdded }) {
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
    try {
      await api.post("admin/users", formData);
      setFormData({ email: "", password: "", roles: ["ROLE_USER"] });
      onUserAdded();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding user.");
    }
  };

  return (
    <div className="add-user-form">
      <h2 className="form-title">Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">
            Email:{" "}
            <input
              className="form-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="form-field">
          <label className="form-label">
            Password:{" "}
            <input
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button className="submit-btn" type="submit">
          Add User
        </button>
      </form>
    </div>
  );
}

export default AddUserForm;
