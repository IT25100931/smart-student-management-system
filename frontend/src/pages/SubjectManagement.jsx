import { useCallback, useEffect, useMemo, useState } from "react";
import "./SubjectManagement.css";

const API_URL = "http://localhost:8081/api/subjects";

const EMPTY_FORM = {
    subjectCode: "",
    subjectName: "",
    description: "",
    credits: "3",
};

async function readResponse(response) {
    const text = await response.text();

    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        const message =
            typeof data === "object" && data !== null
                ? data.message || data.error
                : data;

        if (response.status === 401 || response.status === 403) {
            throw new Error(
                "Access denied. Authentication must be connected to this request."
            );
        }

        throw new Error(message || `Request failed: ${response.status}`);
    }

    return data;
}

function SubjectManagement() {
    const [subjects, setSubjects] = useState([]);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadSubjects = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(API_URL);
            const data = await readResponse(response);

            setSubjects(Array.isArray(data) ? data : []);
        } catch (err) {
            setSubjects([]);
            setError(err.message || "Unable to load subjects.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSubjects();
    }, [loadSubjects]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function resetForm() {
        setForm({ ...EMPTY_FORM });
        setEditingId(null);
    }

    function handleEdit(subject) {
        setEditingId(subject.subjectId);

        setForm({
            subjectCode: subject.subjectCode ?? "",
            subjectName: subject.subjectName ?? "",
            description: subject.description ?? "",
            credits: String(subject.credits ?? 3),
        });

        setMessage("");
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setError("");
        setMessage("");

        const payload = {
            subjectCode: form.subjectCode.trim(),
            subjectName: form.subjectName.trim(),
            description: form.description.trim(),
            credits: Number(form.credits),
        };

        try {
            const url = editingId ? `${API_URL}/${editingId}` : API_URL;

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            await readResponse(response);

            const action = editingId ? "updated" : "created";

            resetForm();
            await loadSubjects();

            setMessage(`Subject ${action} successfully.`);
        } catch (err) {
            setError(err.message || "Unable to save subject.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(subject) {
        const confirmed = window.confirm(
            `Delete subject "${subject.subjectName}"?`
        );

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            const response = await fetch(`${API_URL}/${subject.subjectId}`, {
                method: "DELETE",
            });

            await readResponse(response);

            if (editingId === subject.subjectId) {
                resetForm();
            }

            await loadSubjects();
            setMessage("Subject deleted successfully.");
        } catch (err) {
            setError(err.message || "Unable to delete subject.");
        }
    }

    return (
        <div className="admin-subject-page">
            <header className="admin-subject-header">
                <div>
                    <p className="admin-subject-eyebrow">
                        ADMINISTRATION / SUBJECTS
                    </p>

                    <h2>Subject Management</h2>

                    <p>Maintain the subjects offered by your institution.</p>
                </div>

                <button
                    type="button"
                    className="admin-subject-refresh"
                    onClick={loadSubjects}
                    disabled={loading}
                >
                    <span aria-hidden="true">↻</span>
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </header>

            <section className="admin-subject-stats" aria-label="Summary">
                <article className="admin-subject-stat">
                    <span className="admin-subject-stat-label">
                        Total Subjects
                    </span>
                    <strong>{stats.total}</strong>
                </article>

                <article className="admin-subject-stat">
                    <span className="admin-subject-stat-label">
                        Total Credits
                    </span>
                    <strong>{stats.totalCredits}</strong>
                </article>

                <article className="admin-subject-stat">
                    <span className="admin-subject-stat-label">
                        Average Credits
                    </span>
                    <strong>{stats.average}</strong>
                </article>
            </section>

            {error && (
                <div className="admin-subject-message is-error" role="alert">
                    {error}
                </div>
            )}

            {message && (
                <div className="admin-subject-message is-success" role="status">
                    {message}
                </div>
            )}

            <section className="admin-subject-form-panel">
                <div className="admin-subject-panel-heading">
                    <div>
                        <span className="admin-subject-step">
                            {editingId ? "EDIT SUBJECT" : "NEW SUBJECT"}
                        </span>

                        <h3>
                            {editingId ? "Update subject details" : "Add a subject"}
                        </h3>
                    </div>

                    <span className="admin-subject-panel-icon">
                        {editingId ? "✎" : "+"}
                    </span>
                </div>

                <form className="admin-subject-form" onSubmit={handleSubmit}>
                    <label>
                        Subject Code
                        <input
                            name="subjectCode"
                            value={form.subjectCode}
                            onChange={handleChange}
                            placeholder="e.g. SCI101"
                            maxLength={20}
                            required
                        />
                    </label>

                    <label>
                        Subject Name
                        <input
                            name="subjectName"
                            value={form.subjectName}
                            onChange={handleChange}
                            placeholder="e.g. Science"
                            maxLength={100}
                            required
                        />
                    </label>

                    <label>
                        Credits
                        <input
                            name="credits"
                            type="number"
                            min="1"
                            step="1"
                            value={form.credits}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="admin-subject-description-field">
                        Description
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the subject..."
                            maxLength={500}
                            rows={3}
                        />
                    </label>

                    <div className="admin-subject-form-actions">
                        <button
                            type="submit"
                            className="admin-subject-save"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Save Changes"
                                    : "Create Subject"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="admin-subject-cancel"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="admin-subject-list-panel">
                <div className="admin-subject-list-heading">
                    <div>
                        <h3>Existing Subjects</h3>
                        <p>Subjects currently recorded in the database.</p>
                    </div>

                    <div className="admin-subject-list-tools">
                        <input
                            type="search"
                            className="admin-subject-search"
                            placeholder="Search subjects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search subjects"
                        />

                        <span className="admin-subject-count">
                            {filteredSubjects.length} subjects
                        </span>
                    </div>
                </div>

                {loading ? (
                    <p className="admin-subject-empty">Loading subjects...</p>
                ) : subjects.length === 0 && !error ? (
                    <p className="admin-subject-empty">
                        No subjects found. Create your first subject above.
                    </p>
                ) : subjects.length > 0 && filteredSubjects.length === 0 ? (
                    <p className="admin-subject-empty">
                        No subjects match "{search}".
                    </p>
                ) : filteredSubjects.length > 0 ? (
                    <div className="admin-subject-table-wrapper">
                        <table className="admin-subject-table">
                            <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Code</th>
                                <th>Credits</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.subjectId}>
                                    <td>
                                        <strong>{subject.subjectName}</strong>
                                        <small>ID: {subject.subjectId}</small>
                                    </td>

                                    <td>
                                        <span className="admin-subject-code">
                                            {subject.subjectCode}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="admin-subject-credits">
                                            {subject.credits}
                                        </span>
                                    </td>

                                    <td className="admin-subject-description">
                                        {subject.description || "—"}
                                    </td>

                                    <td>
                                        <div className="admin-subject-row-actions">
                                            <button
                                                type="button"
                                                className="admin-subject-edit"
                                                onClick={() => handleEdit(subject)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="admin-subject-delete"
                                                onClick={() => handleDelete(subject)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </section>
        </div>
    );
}

export default SubjectManagement;