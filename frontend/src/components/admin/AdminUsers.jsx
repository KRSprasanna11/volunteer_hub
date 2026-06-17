import React, { useEffect, useState } from "react";
import "./adminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://volunteer-hub-jp64.onrender.com/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await fetch(
      `https://volunteer-hub-jp64.onrender.com/api/admin/users/${id}/status?status=${status}`,
      { method: "PUT" }
    );
    fetchUsers();
  };

  const filteredUsers =
    filterRole === "ALL"
      ? users
      : users.filter((u) => u.role === filterRole);

  return (
    <div className="admin-users-page">
      <h2 className="admin-title">User Management</h2>

      <div className="admin-filters">
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="ALL">All Users</option>
          <option value="VOLUNTEER">Volunteers</option>
          <option value="ORGANIZER">Organizers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => {
                const status = user.status ?? "ACTIVE"; // ✅ fallback
                const name = user.fullName || user.name || "-";

                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{name}</td>
                    <td>{user.email}</td>

                    <td>
                      <span className={`role ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span className={`status ${status.toLowerCase()}`}>
                        {status}
                      </span>
                    </td>

                    <td>
                      {status === "ACTIVE" ? (
                        <button
                          className="btn-danger"
                          onClick={() => updateStatus(user.id, "BLOCKED")}
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          className="btn-success"
                          onClick={() => updateStatus(user.id, "ACTIVE")}
                        >
                          Unblock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
