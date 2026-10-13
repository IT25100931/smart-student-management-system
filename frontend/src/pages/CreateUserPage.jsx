import { useState } from "react";
import { authHeaders } from "../utils/authFetch";
import "./CreateUserPage.css";

const ROLES = [
    {
        value: "ADMIN",
        label: "Admin",
        description: "Full access to manage the system",
    },
    {
        value: "TEACHER",
        label: "Teacher",
        description: "Classes, students and leave",
    },
    {
        value: "PARENT",
        label: "Parent",
        description: "View fees and upload payment slips",
    },
];

const EMPTY_FORM = {
    username: "",
    email: "",
    password: "",
    role: "TEACHER",
    studentIds: [],
};

function CreateUserPage() {
    const [formData, setFormData] = useState({ ...EMPTY_FORM });

    const [currentStudentInput, setCurrentStudentInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
                setFormData({ ...EMPTY_FORM });
                setCurrentStudentInput("");
                setShowPassword(false);
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
        <div className="create-user-page">
            <header className="create-user-header">
                <p className="create-user-eyebrow">USER ADMINISTRATION</p>
                <h2>Create User Profile</h2>
                <p>Add a new system user and assign their access role.</p>
            </header>

            {message.text && (
                <div
                    className={`create-user-message ${
                        message.type === "success" ? "is-success" : "is-error"
                    }`}
                    role={message.type === "success" ? "status" : "alert"}
                >
                    {message.text}
                </div>
            )}

            <form className="create-user-panel" onSubmit={handleSubmit}>
                <div className="create-user-panel-heading">
                    <div>
                        <span className="create-user-step">NEW USER</span>
                        <h3>Account details</h3>
                    </div>

                    <span className="create-user-panel-icon" aria-hidden="true">
                        +
                    </span>
                </div>

                <div className="create-user-grid">
                    <label className="create-user-field">
                        Username
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter username"
                            autoComplete="off"
                        />
                    </label>

                    <label className="create-user-field">
                        Email Address
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email address"
                            autoComplete="off"
                        />
                    </label>

                    <label className="create-user-field create-user-field-wide">
                        Temporary Password
                        <div className="create-user-password">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter temporary password"
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="create-user-password-toggle"
                                onClick={() => setShowPassword((show) => !show)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </label>
                </div>

                <fieldset className="create-user-roles">
                    <legend>User Role</legend>

                    <div className="create-user-role-grid">
                        {ROLES.map((role) => (
                            <label
                                key={role.value}
                                className={`create-user-role-card ${
                                    formData.role === role.value ? "is-selected" : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value={role.value}
                                    checked={formData.role === role.value}
                                    onChange={handleChange}
                                />

                                <span className="create-user-role-dot" aria-hidden="true" />

                                <span className="create-user-role-copy">
                                    <strong>{role.label}</strong>
                                    <small>{role.description}</small>
                                </span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                {formData.role === "PARENT" && (
                    <div className="create-user-students">
                        <label htmlFor="create-user-student-input">
                            Link Student ID(s)
                        </label>

                        <div className="create-user-student-row">
                            <div className="create-user-student-input">
                                <span>STU</span>

                                <input
                                    id="create-user-student-input"
                                    type="text"
                                    value={currentStudentInput}
                                    onChange={(e) => setCurrentStudentInput(e.target.value)}
                                    placeholder="Enter student number (e.g. 101)"
                                />
                            </div>

                            <button
                                type="button"
                                className="create-user-add-button"
                                onClick={handleAddStudentId}
                            >
                                Add ID
                            </button>
                        </div>

                        {formData.studentIds.length > 0 && (
                            <div className="create-user-chips">
                                {formData.studentIds.map((id) => (
                                    <span key={id} className="create-user-chip">
                                        STU{id}

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStudentId(id)}
                                            aria-label={`Remove student ${id}`}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="create-user-actions">
                    <button
                        type="submit"
                        className="create-user-submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Profile..." : "Create User Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateUserPage;