import { useState } from "react";
import { authHeaders } from "../utils/authFetch";

function CreateUserPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "TEACHER",
        studentIds: [],
    });

    const [currentStudentInput, setCurrentStudentInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "role" && value !== "PARENT" ? { studentIds: [] } : {}),
        }));
    }

    function handleAddStudentId() {
        const trimmed = currentStudentInput.trim();
        if (!trimmed) return;

        if (formData.studentIds.includes(trimmed)) {
            setMessage({ type: "error", text: "This student ID is already added." });
            return;
        }

        setFormData((prev) => ({
            ...prev,
            studentIds: [...prev.studentIds, trimmed],
        }));
        setCurrentStudentInput("");
        setMessage({ type: "", text: "" });
    }

    function handleRemoveStudentId(idToRemove) {
        setFormData((prev) => ({
            ...prev,
            studentIds: prev.studentIds.filter((id) => id !== idToRemove),
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        // Automatically include any student ID currently typed in the input box if not already added
        let finalStudentIds = [...formData.studentIds];
        const trimmedInput = currentStudentInput.trim();
        if (trimmedInput && !finalStudentIds.includes(trimmedInput)) {
            finalStudentIds.push(trimmedInput);
        }

        const payloadToSubmit = {
            ...formData,
            studentIds: finalStudentIds,
        };

        try {
            const response = await fetch("http://localhost:8081/api/users/register", {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify(payloadToSubmit),
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                setMessage({ type: "success", text: "User profile created successfully!" });
                setFormData({ username: "", email: "", password: "", role: "TEACHER", studentIds: [] });
                setCurrentStudentInput("");
            } else if (response.status === 401) {
                setMessage({ type: "error", text: "Your session has expired. Please log in again." });
            } else if (response.status === 403) {
                setMessage({ type: "error", text: "Only administrators can create user profiles." });
            } else {
                setMessage({ type: "error", text: data.message || "Failed to create user profile." });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Could not connect to the server." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-overview" style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div className="admin-welcome-panel" style={{ minHeight: "auto", padding: "24px" }}>
                <div className="admin-welcome-copy">
                    <span className="admin-eyebrow">USER ADMINISTRATION</span>
                    <h2>Create User Profile</h2>
                    <p>Add a new system user and assign their access role.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {message.text && (
                    <div style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        backgroundColor: message.type === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        border: `1px solid ${message.type === "success" ? "#22c55e" : "#ef4444"}`,
                        color: message.type === "success" ? "#4ade80" : "#f87171",
                        fontSize: "0.85rem"
                    }}>
                        {message.text}
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#d4d4d8" }}>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter username"
                        style={{ padding: "11px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "#16181e", color: "#fff", fontSize: "0.9rem" }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#d4d4d8" }}>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter email address"
                        style={{ padding: "11px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "#16181e", color: "#fff", fontSize: "0.9rem" }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#d4d4d8" }}>Temporary Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter temporary password"
                        style={{ padding: "11px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "#16181e", color: "#fff", fontSize: "0.9rem" }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.80rem", fontWeight: "600", color: "#d4d4d8" }}>User Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        style={{ padding: "11px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "#16181e", color: "#fff", fontSize: "0.9rem" }}
                    >
                        <option value="ADMIN">Admin</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="PARENT">Parent</option>
                    </select>
                </div>

                {formData.role === "PARENT" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "rgba(255,255,255,0.03)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#d4d4d8" }}>Link Student ID(s)</label>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <div style={{ display: "flex", alignItems: "center", background: "#16181e", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "0 12px", flex: 1 }}>
                                <span style={{ color: "#a1a1aa", fontSize: "0.9rem", fontWeight: "600", marginRight: "4px" }}>STU</span>
                                <input
                                    type="text"
                                    value={currentStudentInput}
                                    onChange={(e) => setCurrentStudentInput(e.target.value)}
                                    placeholder="Enter student number (e.g. 101)"
                                    style={{ border: "none", background: "transparent", color: "#fff", fontSize: "0.9rem", outline: "none", width: "100%", padding: "11px 0" }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddStudentId}
                                style={{ padding: "0 18px", borderRadius: "10px", background: "#ef4444", color: "#fff", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" }}
                            >
                                Add ID
                            </button>
                        </div>

                        {formData.studentIds.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                                {formData.studentIds.map((id) => (
                                    <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.1)", padding: "5px 10px", borderRadius: "6px", fontSize: "0.8rem", color: "#fff" }}>
                    STU{id}
                                        <button type="button" onClick={() => handleRemoveStudentId(id)} style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem" }}>×</button>
                  </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="admin-primary-button"
                    style={{ marginTop: "10px", width: "100%" }}
                >
                    {loading ? "Creating Profile..." : "Create User Profile"}
                </button>
            </form>
        </div>
    );
}

export default CreateUserPage;