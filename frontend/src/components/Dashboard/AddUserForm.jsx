import { useState } from "react";
import "../../styles/Dashboard.css";

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
      const response = await fetch("http://localhost:8000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to add user.");
      }
      alert("User added successfully!");
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
