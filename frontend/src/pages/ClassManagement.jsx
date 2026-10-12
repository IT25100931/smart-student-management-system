
import { useCallback, useEffect, useState } from "react";
import "./ClassManagement.css";

const API_BASE = "http://localhost:8081/api";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const EMPTY_FORM = {
  subjectId: "",
  staffId: "",
  className: "",
  roomNo: "",
  dayOfWeek: "Monday",
  startTime: "",
  endTime: "",
  semester: "",
  academicYear: String(new Date().getFullYear()),
};

// Read JSON responses and show useful API errors.
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

    throw new Error(message || `Request failed: ${response.status}`);
  }

  return data;
}

function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [classesResponse, subjectsResponse] = await Promise.all([
        fetch(`${API_BASE}/classes`),
        fetch(`${API_BASE}/subjects`),
      ]);

      const [classesData, subjectsData] = await Promise.all([
        readResponse(classesResponse),
        readResponse(subjectsResponse),
      ]);

      setClasses(Array.isArray(classesData) ? classesData : []);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (err) {
      setError(
        `${err.message}. Check that the backend is running on port 8081.`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
    setMessage("");
    setError("");
  }

  function handleEdit(classItem) {
    setEditingId(classItem.classId);

    setForm({
      subjectId: String(classItem.subject?.subjectId ?? ""),
      staffId: String(classItem.staff?.staffId ?? ""),
      className: classItem.className ?? "",
      roomNo: classItem.roomNo ?? "",
      dayOfWeek: classItem.dayOfWeek ?? "Monday",
      startTime: classItem.startTime?.slice(0, 5) ?? "",
      endTime: classItem.endTime?.slice(0, 5) ?? "",
      semester: classItem.semester ?? "",
      academicYear: String(classItem.academicYear ?? ""),
    });

    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      subject: {
        subjectId: Number(form.subjectId),
      },
      staff: {
        staffId: Number(form.staffId),
      },
      className: form.className.trim(),
      roomNo: form.roomNo.trim() || null,
      dayOfWeek: form.dayOfWeek,
      startTime: `${form.startTime}:00`,
      endTime: `${form.endTime}:00`,
      semester: form.semester.trim() || null,
      academicYear: form.academicYear
        ? Number(form.academicYear)
        : null,
    };

    try {
      const url = editingId
        ? `${API_BASE}/classes/${editingId}`
        : `${API_BASE}/classes`;

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
      await loadData();

      setMessage(`Class ${action} successfully.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(classItem) {
    const confirmed = window.confirm(
      `Delete class "${classItem.className}" (ID ${classItem.classId})?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE}/classes/${classItem.classId}`,
        { method: "DELETE" }
      );

      await readResponse(response);

      if (editingId === classItem.classId) {
        resetForm();
      }

      await loadData();
      setMessage("Class deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="class-management-page">
      <header className="class-management-header">
        <div>
          <p className="class-eyebrow">ACADEMIC STAFF SERVICES</p>
          <h1>Class Management</h1>
          <p>Manage classes, subjects, rooms, and weekly schedules.</p>
        </div>

        <button
          type="button"
          className="class-refresh-button"
          onClick={loadData}
          disabled={loading}
        >
          Refresh Classes
        </button>
      </header>

      {error && (
        <div className="class-message class-error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="class-message class-success" role="status">
          {message}
        </div>
      )}

      <section className="class-form-panel">
        <h2>{editingId ? "Edit Class" : "Create a Class"}</h2>
        <p className="class-panel-description">
          Select an existing subject and staff member. Their IDs must
          exist in your database.
        </p>

        <form onSubmit={handleSubmit} className="class-form">
          <label>
            Subject
            <select
              name="subjectId"
              value={form.subjectId}
              onChange={handleChange}
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectCode} — {subject.subjectName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Staff ID
            <input
              name="staffId"
              type="number"
              min="1"
              value={form.staffId}
              onChange={handleChange}
              placeholder="Enter an existing staff ID"
              required
            />
          </label>

          <label>
            Class Name
            <input
              name="className"
              value={form.className}
              onChange={handleChange}
              placeholder="e.g. 10 A"
              maxLength={50}
              required
            />
          </label>

          <label>
            Room
            <input
              name="roomNo"
              value={form.roomNo}
              onChange={handleChange}
              placeholder="e.g. Room 201"
              maxLength={30}
            />
          </label>

          <label>
            Day of Week
            <select
              name="dayOfWeek"
              value={form.dayOfWeek}
              onChange={handleChange}
              required
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </label>

          <label>
            Start Time
            <input
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            End Time
            <input
              name="endTime"
              type="time"
              value={form.endTime}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Semester
            <input
              name="semester"
              value={form.semester}
              onChange={handleChange}
              placeholder="e.g. Semester 1"
              maxLength={30}
            />
          </label>

          <label>
            Academic Year
            <input
              name="academicYear"
              type="number"
              min="2000"
              max="9999"
              value={form.academicYear}
              onChange={handleChange}
            />
          </label>

          <div className="class-form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Create Class"}
            </button>

            {editingId && (
              <button
                type="button"
                className="class-cancel-button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="class-list-section">
        <div className="class-list-heading">
          <div>
            <h2>Scheduled Classes</h2>
            <p>Classes currently saved in the database.</p>
          </div>
          <span className="class-count">{classes.length} classes</span>
        </div>

        {loading ? (
          <p className="class-empty-state">Loading classes...</p>
        ) : classes.length === 0 ? (
          <p className="class-empty-state">
            No classes found. Use the form above to create one.
          </p>
        ) : (
          <div className="class-table-wrapper">
            <table className="class-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Staff ID</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Room</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {classes.map((classItem) => (
                  <tr key={classItem.classId}>
                    <td>
                      <strong>{classItem.className}</strong>
                      <small>ID: {classItem.classId}</small>
                    </td>

                    <td>
                      {classItem.subject?.subjectName ?? "Unknown subject"}
                      <small>
                        {classItem.subject?.subjectCode ?? ""}
                      </small>
                    </td>

                    <td>{classItem.staff?.staffId ?? "—"}</td>
                    <td>{classItem.dayOfWeek}</td>

                    <td>
                      {classItem.startTime?.slice(0, 5)} –{" "}
                      {classItem.endTime?.slice(0, 5)}
                    </td>

                    <td>{classItem.roomNo || "—"}</td>

                    <td>
                      <div className="class-row-actions">
                        <button
                          type="button"
                          className="class-edit-button"
                          onClick={() => handleEdit(classItem)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="class-delete-button"
                          onClick={() => handleDelete(classItem)}
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
        )}
      </section>
    </main>
  );
}

export default ClassManagement;