
import { useCallback, useEffect, useState } from "react";
import "./TeacherTimetable.css";

const API_BASE = "http://localhost:8081/api";

// Temporary demo ID.
// Later, use the staff ID of the logged-in teacher.
const staffId = 1;

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TODAY = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
}).format(new Date());

function formatTime(time) {
  if (!time) return "—";

  const [hours, minutes] = time.slice(0, 5).split(":");
  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

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

function TeacherTimetable() {
  const [selectedDay, setSelectedDay] = useState(
    DAYS.includes(TODAY) ? TODAY : "Monday"
  );
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTimetable = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/classes/staff/${staffId}/day/${selectedDay}`
      );

      const data = await readResponse(response);

      setClasses(Array.isArray(data) ? data : []);
    } catch (err) {
      setClasses([]);
      setError(
        `${err.message}. Check that the backend is running on port 8081.`
      );
    } finally {
      setLoading(false);
    }
  }, [selectedDay]);

  useEffect(() => {
    loadTimetable();
  }, [loadTimetable]);

  return (
    <main className="teacher-timetable-page">
      <header className="timetable-header">
        <div>
          <p className="timetable-eyebrow">ACADEMIC STAFF SERVICES</p>
          <h1>My Teaching Timetable</h1>
          <p>View your scheduled classes for the selected day.</p>
        </div>

        <div className="timetable-day-control">
          <label htmlFor="timetable-day">Select day</label>
          <select
            id="timetable-day"
            value={selectedDay}
            onChange={(event) => setSelectedDay(event.target.value)}
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="timetable-summary">
        <div>
          <span className="timetable-summary-label">Selected day</span>
          <strong>{selectedDay}</strong>
        </div>

        <div>
          <span className="timetable-summary-label">Scheduled classes</span>
          <strong>{loading ? "…" : classes.length}</strong>
        </div>
      </section>

      {error && (
        <div className="timetable-error" role="alert">
          {error}
        </div>
      )}

      <section className="timetable-list-section">
        <h2>{selectedDay}'s Classes</h2>

        {loading ? (
          <p className="timetable-empty">Loading your timetable...</p>
        ) : error ? (
          <p className="timetable-empty">
            Your timetable couldn't be loaded.
          </p>
        ) : classes.length === 0 ? (
          <div className="timetable-empty">
            <h3>No classes scheduled</h3>
            <p>You have no classes assigned for {selectedDay}.</p>
          </div>
        ) : (
          <div className="timetable-class-list">
            {classes.map((classItem) => (
              <article
                className="timetable-class-card"
                key={classItem.classId}
              >
                <div className="timetable-time">
                  <strong>{formatTime(classItem.startTime)}</strong>
                  <span>{formatTime(classItem.endTime)}</span>
                </div>

                <div className="timetable-class-details">
                  <h3>{classItem.className}</h3>

                  <p className="timetable-subject">
                    {classItem.subject?.subjectName ?? "Unknown subject"}
                  </p>

                  <div className="timetable-class-meta">
                    {classItem.roomNo && (
                      <span>Room: {classItem.roomNo}</span>
                    )}

                    {classItem.subject?.subjectCode && (
                      <span>
                        Subject code: {classItem.subject.subjectCode}
                      </span>
                    )}

                    {classItem.semester && (
                      <span>{classItem.semester}</span>
                    )}
                  </div>
                </div>

                <span className="timetable-day-badge">
                  {classItem.dayOfWeek}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default TeacherTimetable;