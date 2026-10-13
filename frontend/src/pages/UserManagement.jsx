import { useEffect, useState, useCallback } from "react";
import { bearer } from "../utils/authFetch";
import CreateUserPage from "./CreateUserPage.jsx";
import "./UserManagement.css";

const API_BASE = "http://localhost:8081/api/users";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(API_BASE, {
                headers: bearer(),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Failed to fetch user list.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const toggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        setUpdatingId(userId);

        try {
            const response = await fetch(`${API_BASE}/${userId}/status`, {
                method: "PUT",
                headers: {
                    ...bearer(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error("Failed to update status.");
            }

            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.userId === userId ? { ...u, status: newStatus } : u
                )
            );
        } catch (err) {
            alert(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleUserCreated = () => {
        setShowCreateModal(false);
        fetchUsers(); // Refreshes table to display the newly created user instantly
    };

    return (
        <main className="user-mgmt-page">
            <header className="user-mgmt-header">
                <div>
                    <p className="user-mgmt-eyebrow">ADMINISTRATIVE SERVICES</p>
                    <h1>User Accounts Management</h1>
                    <p>View system users, manage access statuses, and add new profiles.</p>
                </div>

                <button
                    type="button"
                    className="user-mgmt-create-btn"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Add New User
                </button>
            </header>

            {error && <div className="user-mgmt-error">{error}</div>}

            <section className="user-mgmt-card">
                {loading ? (
                    <p className="user-mgmt-empty">Loading users...</p>
                ) : users.length === 0 ? (
                    <p className="user-mgmt-empty">No user accounts found.</p>
                ) : (
                    <div className="user-mgmt-table-wrapper">
                        <table className="user-mgmt-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((u) => (
                                <tr key={u.userId}>
                                    <td>#{u.userId}</td>
                                    <td className="user-mgmt-username">{u.username}</td>
                                    <td>{u.email || "—"}</td>
                                    <td>
                                        <span className="user-role-badge">{u.role}</span>
                                    </td>
                                    <td>
                                        {u.role?.roleName === "TEACHER" || u.role === "TEACHER" ? (
                                            <span className="staff-id-badge">Staff #{u.staffId || "—"}</span>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td>
                      <span
                          className={`status-pill ${
                              u.status === "ACTIVE" ? "status-active" : "status-inactive"
                          }`}
                      >
                        {u.status}
                      </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className={`toggle-btn ${
                                                u.status === "ACTIVE" ? "btn-deactivate" : "btn-activate"
                                            }`}
                                            disabled={updatingId === u.userId}
                                            onClick={() => toggleStatus(u.userId, u.status)}
                                        >
                                            {updatingId === u.userId
                                                ? "Saving..."
                                                : u.status === "ACTIVE"
                                                    ? "Set Inactive"
                                                    : "Set Active"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Modal loading your existing CreateUserPage */}
            {showCreateModal && (
                <div className="user-mgmt-modal-overlay">
                    <div className="user-mgmt-modal-content">
                        <button
                            type="button"
                            className="user-mgmt-modal-close"
                            onClick={() => setShowCreateModal(false)}
                        >
                            &times;
                        </button>
                        <CreateUserPage onSuccess={handleUserCreated} />
                    </div>
                </div>
            )}
        </main>
    );
}

export default UserManagement;