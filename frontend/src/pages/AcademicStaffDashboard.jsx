
import TeacherTimetable from "./TeacherTimetable.jsx";
import LeaveManagement from "./LeaveManagement.jsx";
import "./AcademicStaffDashboard.css";

function AcademicStaffDashboard() {
  return (
    <div className="academic-staff-dashboard">
      <header className="asd-welcome">
        <p className="asd-eyebrow">ACADEMIC STAFF PORTAL</p>

        <h1>My Academic Dashboard</h1>

        <p>
          View your assigned subjects and classes, check your leave
          balance, and submit leave requests from one place.
        </p>
      </header>

      {/* Subjects and Class Schedule */}
      <section
        className="asd-section"
        aria-labelledby="asd-classes-heading"
      >
        <div className="asd-section-heading">
          <span className="asd-section-number">01</span>

          <div>
            <h2 id="asd-classes-heading">
              My Subjects & Class Schedule
            </h2>
            <p>
              View your teaching timetable, subjects, class names,
              times, and classroom details.
            </p>
          </div>
        </div>

        <div className="asd-section-content">
          <TeacherTimetable />
        </div>
      </section>

      {/* Leave Summary and Request Form */}
      <section
        className="asd-section"
        aria-labelledby="asd-leave-heading"
      >
        <div className="asd-section-heading">
          <span className="asd-section-number">02</span>

          <div>
            <h2 id="asd-leave-heading">
              My Leave Summary & Requests
            </h2>
            <p>
              Check remaining leave, view upcoming leave days,
              submit a request, and review your request history.
            </p>
          </div>
        </div>

        <div className="asd-section-content">
          <LeaveManagement />
        </div>
      </section>
    </div>
  );
}

export default AcademicStaffDashboard;