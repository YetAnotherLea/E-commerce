import { useState, useEffect } from "react";
import "../../styles/Dashboard.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/admin/users/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete user.");
        }

        alert("User deleted successfully!");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user.");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <h2 className="management-title">Manage Users</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(", ")}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
