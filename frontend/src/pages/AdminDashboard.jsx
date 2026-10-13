import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/authFetch";

import SubjectManagement from "./SubjectManagement";
import ClassManagement from "./ClassManagement.jsx";
import LeaveApprovalManagement from "./LeaveApprovalManagement.jsx";
import LeaveManagement from "./LeaveManagement.jsx";
import PaymentReview from "./PaymentReview.jsx";
import PaymentPage from "./PaymentPage.jsx";
import RegisterStudentPage from "./RegisterStudentPage.jsx";
import EditStudentPage from "./EditStudentPage.jsx";
import StudentSearch from "./StudentSearch.jsx";
import CreateUserPage from "./CreateUserPage.jsx";
import SalaryDetails from "./SalaryDetails.jsx";
import SalaryCalculation from "./SalaryCalculation.jsx";
import SalarySummary from "./SalarySummary.jsx";
import StaffAttendance from "./StaffAttendance.jsx";
import AttendanceByDate from "./AttendanceByDate.jsx";
import MarkAttendance from "./MarkAttendance.jsx";

import "./AdminDashboard.css";
import "../StaffManagement.css";
import AccountMenu from "../components/AccountMenu.jsx";

function DashboardIcon({ name, size = 21 }) {
    const props = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
    };

    switch (name) {
        case "grid":
            return (
                <svg {...props}>
                    <rect x="3" y="3" width="7" height="7" rx="2" />
                    <rect x="14" y="3" width="7" height="7" rx="2" />
                    <rect x="3" y="14" width="7" height="7" rx="2" />
                    <rect x="14" y="14" width="7" height="7" rx="2" />
                </svg>
            );
        case "book":
            return (
                <svg {...props}>
                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
                    <path d="M4 18a2.5 2.5 0 0 1 2.5-2.5H20M8 7h7M8 11h7" />
                </svg>
            );
        case "calendar":
            return (
                <svg {...props}>
                    <rect x="3" y="5" width="18" height="16" rx="3" />
                    <path d="M16 3v4M8 3v4M3 10h18" />
                    <path d="M8 14h2M14 14h2M8 17h2" />
                </svg>
            );
        case "clipboard":
            return (
                <svg {...props}>
                    <rect x="5" y="4" width="14" height="17" rx="2" />
                    <path d="M9 4V2h6v2M9 10h6M9 14h3" />
                    <path d="m9 17 1.5 1.5L15 14" />
                </svg>
            );
        case "wallet":
            return (
                <svg {...props}>
                    <rect x="3" y="6" width="18" height="14" rx="3" />
                    <path d="M3 10h18M16 15h2M6 6V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
                </svg>
            );
        case "user-plus":
            return (
                <svg {...props}>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
            );
        case "user-edit":
            return (
                <svg {...props}>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M13.5 13.5L18 9l3 3-4.5 4.5H16v-2.5z" />
                </svg>
            );
        case "users":
            return (
                <svg {...props}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            );
        case "search":
            return (
                <svg {...props}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            );
        case "arrow":
            return (
                <svg {...props}>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
            );
        case "shield":
            return (
                <svg {...props}>
                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                    <path d="m9 12 2 2 4-4" />
                </svg>
            );
        case "menu":
            return (
                <svg {...props}>
                    <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            );
        default:
            return null;
    }
}

const ROLE_NAV = {
    ADMIN: [
        { id: "overview", label: "Overview", icon: "grid" },
        { id: "subjects", label: "Subjects", icon: "book" },
        { id: "classes", label: "Classes", icon: "calendar" },
        { id: "leaves", label: "Leave Approvals", icon: "clipboard" },
        { id: "payments", label: "Payments", icon: "wallet" },
        { id: "register-student", label: "Register Student", icon: "user-plus" },
        { id: "edit-student", label: "Edit Student", icon: "user-edit" },
        { id: "create-user", label: "Create User", icon: "users" },
        { id: "salary-details", label: "Salary Details", icon: "wallet" },
        { id: "salary-calculation", label: "Salary Calculation", icon: "wallet" },
        { id: "salary-summary", label: "Salary Summary", icon: "wallet" },
        { id: "staff-attendance", label: "Staff Attendance", icon: "calendar" },
        { id: "attendance-by-date", label: "Daily Attendance", icon: "calendar" },
        { id: "mark-attendance", label: "Mark Attendance", icon: "clipboard" },
    ],
    TEACHER: [
        { id: "overview", label: "Overview", icon: "grid" },
        { id: "search-student", label: "Search Student", icon: "search" },
        { id: "leave-management", label: "Leave Management", icon: "clipboard" },
        { id: "salary-summary", label: "Salary Summary", icon: "wallet" },
        { id: "attendance-by-date", label: "Daily Attendance", icon: "calendar" },
        { id: "mark-attendance", label: "Mark Attendance", icon: "clipboard" },
    ],
    PARENT: [
        { id: "overview", label: "Overview", icon: "grid" },
        { id: "payments", label: "Fee Payments", icon: "wallet" },
    ],
};

function StaffPage({ children }) {
    return <div className="staff-module staff-embedded">{children}</div>;
}

function Dashboard() {
    const user = getUser();
    const role = (user?.role || "ADMIN").toUpperCase();
    const navItems = ROLE_NAV[role] || ROLE_NAV.ADMIN;

    const [activeSection, setActiveSection] = useState("overview");
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const navigate = useNavigate();

    const currentItem =
        navItems.find((item) => item.id === activeSection) ?? navItems[0];

    function navigateTo(section) {
        setActiveSection(section);
        setMobileNavOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    function renderContent() {
        if (role === "ADMIN") {
            switch (activeSection) {
                case "subjects": return <SubjectManagement />;
                case "classes": return <ClassManagement />;
                case "leaves": return <LeaveApprovalManagement />;
                case "payments": return <PaymentReview />;
                case "register-student": return <RegisterStudentPage />;
                case "edit-student": return <EditStudentPage />;
                case "create-user": return <CreateUserPage />;
                case "salary-details": return <StaffPage><SalaryDetails /></StaffPage>;
                case "salary-calculation": return <StaffPage><SalaryCalculation /></StaffPage>;
                case "salary-summary": return <StaffPage><SalarySummary /></StaffPage>;
                case "staff-attendance": return <StaffPage><StaffAttendance /></StaffPage>;
                case "attendance-by-date": return <StaffPage><AttendanceByDate /></StaffPage>;
                case "mark-attendance": return <StaffPage><MarkAttendance /></StaffPage>;
                default:
                    return (
                        <section className="admin-overview">
                            <div className="admin-welcome-panel">
                                <div className="admin-welcome-copy">
                                    <span className="admin-eyebrow">ADMINISTRATIVE WORKSPACE</span>
                                    <h2>Manage academics. <span>Keep everything organized.</span></h2>
                                    <p>Maintain subject records, schedules, leave approvals, user profiles, and student enrollments from one central workspace.</p>
                                    <button type="button" className="admin-primary-button" onClick={() => navigateTo("leaves")}>
                                        Review leave requests <DashboardIcon name="arrow" size={17} />
                                    </button>
                                </div>
                            </div>

                            <div className="admin-section-intro">
                                <div>
                                    <span className="admin-eyebrow">WORKSPACE MODULES</span>
                                    <h2>What would you like to manage?</h2>
                                    <p>Select a module to view records or perform an administrative task.</p>
                                </div>
                            </div>

                            <div className="admin-module-grid">
                                <button type="button" className="admin-module-card admin-module-subjects" onClick={() => navigateTo("subjects")}>
                                    <div className="admin-module-card-top">
                                        <span className="admin-module-icon"><DashboardIcon name="book" size={27} /></span>
                                        <span className="admin-module-number">01</span>
                                    </div>
                                    <div className="admin-module-copy">
                                        <span className="admin-module-eyebrow">ACADEMIC CATALOGUE</span>
                                        <h3>Subject Management</h3>
                                        <p>Create subjects, update details, and maintain the subject catalogue.</p>
                                    </div>
                                    <span className="admin-module-footer">Open Subject Management <DashboardIcon name="arrow" size={18} /></span>
                                </button>

                                <button type="button" className="admin-module-card admin-module-classes" onClick={() => navigateTo("classes")}>
                                    <div className="admin-module-card-top">
                                        <span className="admin-module-icon"><DashboardIcon name="calendar" size={27} /></span>
                                        <span className="admin-module-number">02</span>
                                    </div>
                                    <div className="admin-module-copy">
                                        <span className="admin-module-eyebrow">TIMETABLE & SCHEDULING</span>
                                        <h3>Class Management</h3>
                                        <p>Create classes, assign subjects and staff, and maintain schedules.</p>
                                    </div>
                                    <span className="admin-module-footer">Open Class Management <DashboardIcon name="arrow" size={18} /></span>
                                </button>

                                <button type="button" className="admin-module-card admin-module-leaves" onClick={() => navigateTo("leaves")}>
                                    <div className="admin-module-card-top">
                                        <span className="admin-module-icon"><DashboardIcon name="clipboard" size={27} /></span>
                                        <span className="admin-module-number">03</span>
                                    </div>
                                    <div className="admin-module-copy">
                                        <span className="admin-module-eyebrow">STAFF SERVICES</span>
                                        <h3>Leave Approvals</h3>
                                        <p>Review leave requests, approve suitable requests, or reject them.</p>
                                    </div>
                                    <span className="admin-module-footer">Review Leave Requests <DashboardIcon name="arrow" size={18} /></span>
                                </button>

                                <button type="button" className="admin-module-card admin-module-payments" onClick={() => navigateTo("payments")}>
                                    <div className="admin-module-card-top">
                                        <span className="admin-module-icon"><DashboardIcon name="wallet" size={27} /></span>
                                        <span className="admin-module-number">04</span>
                                    </div>
                                    <div className="admin-module-copy">
                                        <span className="admin-module-eyebrow">FEES & BILLING</span>
                                        <h3>Payment Review</h3>
                                        <p>Check submitted payment slips, approve or reject them, and update records.</p>
                                    </div>
                                    <span className="admin-module-footer">Open Payment Review <DashboardIcon name="arrow" size={18} /></span>
                                </button>

                                <button type="button" className="admin-module-card admin-module-register" onClick={() => navigateTo("register-student")}>
                                    <div className="admin-module-card-top">
                                        <span className="admin-module-icon"><DashboardIcon name="user-plus" size={27} /></span>
                                        <span className="admin-module-number">05</span>
                                    </div>
                                    <div className="admin-module-copy">
                                        <span className="admin-module-eyebrow">ADMISSIONS</span>
                                        <h3>Register Student</h3>
                                        <p>Enroll new students into the system and record their initial details.</p>
                                    </div>
                                    <span className="admin-module-footer">Register Student <DashboardIcon name="arrow" size={18} /></span>
                                </button>

                                <button type="button" className="admin-module-card admin-module-edit" onClick={() => navigateTo("edit-student")}>
                                    <div className="admin-module-card-top">
                                        <span className="admin-module-icon"><DashboardIcon name="user-edit" size={27} /></span>
                                        <span className="admin-module-number">06</span>
                                    </div>
                                    <div className="admin-module-copy">
                                        <span className="admin-module-eyebrow">RECORDS</span>
                                        <h3>Edit Student</h3>
                                        <p>Modify existing student profiles, grades, and academic records.</p>
                                    </div>
                                    <span className="admin-module-footer">Edit Student Records <DashboardIcon name="arrow" size={18} /></span>
                                </button>

                                <button type="button" className="admin-module-card admin-module-create-user" onClick={() => navigateTo("create-user")}>
                                    <div className="admin-module-card-top">
                                        <span className="admin-module-icon"><DashboardIcon name="users" size={27} /></span>
                                        <span className="admin-module-number">07</span>
                                    </div>
                                    <div className="admin-module-copy">
                                        <span className="admin-module-eyebrow">ADMINISTRATION</span>
                                        <h3>Create User Profile</h3>
                                        <p>Add new system users and assign their respective access roles.</p>
                                    </div>
                                    <span className="admin-module-footer">Create User <DashboardIcon name="arrow" size={18} /></span>
                                </button>
                            </div>
                        </section>
                    );
            }
        }

        if (role === "TEACHER") {
            switch (activeSection) {
                case "search-student": return <StudentSearch />;
                case "leave-management": return <LeaveManagement />;
                case "salary-summary": return <StaffPage><SalarySummary /></StaffPage>;
                case "attendance-by-date": return <StaffPage><AttendanceByDate /></StaffPage>;
                case "mark-attendance": return <StaffPage><MarkAttendance /></StaffPage>;
                default:
                    return (
                        <section className="admin-overview">
                            <div className="admin-welcome-panel">
                                <div className="admin-welcome-copy">
                                    <span className="admin-eyebrow">TEACHER PORTAL</span>
                                    <h2>Welcome, Teacher. <span>Manage your daily tasks.</span></h2>
                                    <p>Search student profiles or manage your leave requests from one central workspace.</p>
                                    <button type="button" className="admin-primary-button" onClick={() => navigateTo("search-student")}>
                                        Search student records <DashboardIcon name="arrow" size={17} />
                                    </button>
                                </div>
                            </div>

                            <div className="admin-section-intro">
                                <div>
                                    <span className="admin-eyebrow">TEACHER MODULES</span>
                                    <h2>What would you like to do?</h2>
                                    <p>Select a module to search student information or manage leave.</p>
                                </div>
                            </div>

                            <div className="admin-module-grid">
                                <button type="button" className="admin-module-card admin-module-subjects" onClick={() => navigateTo("search-student")}>
                                    <div className="admin-module-card-top">
                                        <span className="admin-module-icon"><DashboardIcon name="search" size={27} /></span>
                                        <span className="admin-module-number">01</span>
                                    </div>
                                    <div className="admin-module-copy">
                                        <span className="admin-module-eyebrow">STUDENT RECORDS</span>
                                        <h3>Search Student</h3>
                                        <p>Look up student profiles, view academic details, and check information.</p>
                                    </div>
                                    <span className="admin-module-footer">Open Student Search <DashboardIcon name="arrow" size={18} /></span>
                                </button>

                                <button type="button" className="admin-module-card admin-module-classes" onClick={() => navigateTo("leave-management")}>
                                    <div className="admin-module-card-top">
                                        <span className="admin-module-icon"><DashboardIcon name="clipboard" size={27} /></span>
                                        <span className="admin-module-number">02</span>
                                    </div>
                                    <div className="admin-module-copy">
                                        <span className="admin-module-eyebrow">STAFF PORTAL</span>
                                        <h3>Leave Management</h3>
                                        <p>Submit leave requests, check leave balances, and track approvals.</p>
                                    </div>
                                    <span className="admin-module-footer">Manage Leave Requests <DashboardIcon name="arrow" size={18} /></span>
                                </button>
                            </div>
                        </section>
                    );
            }
        }

        if (role === "PARENT") {
            switch (activeSection) {
                case "payments": return <PaymentPage />;
                default:
                    return (
                        <section className="admin-overview">
                            <div className="admin-welcome-panel">
                                <div className="admin-welcome-copy">
                                    <span className="admin-eyebrow">PARENT PORTAL</span>
                                    <h2>Fee Payments & Status</h2>
                                    <p>Check your child's fee balance and upload payment slips.</p>
                                </div>
                            </div>
                        </section>
                    );
            }
        }
    }

    return (
        <div className="admin-dashboard-layout">
            <aside className={`admin-sidebar ${mobileNavOpen ? "admin-sidebar-open" : ""}`}>
                <div className="admin-sidebar-brand">
          <span className="admin-brand-icon">
            <DashboardIcon name="shield" size={25} />
          </span>
                    <div>
                        <strong>School Portal</strong>
                        <span>{role.charAt(0) + role.slice(1).toLowerCase()} Console</span>
                    </div>
                </div>

                <div className="admin-sidebar-label">MAIN MENU</div>

                <nav className="admin-sidebar-navigation" aria-label="Main menu">
                    {navItems.map((item) => (
                        <button
                            type="button"
                            key={item.id}
                            className={`admin-sidebar-link ${activeSection === item.id ? "admin-link-active" : ""}`}
                            onClick={() => navigateTo(item.id)}
                        >
              <span className="admin-sidebar-link-icon">
                <DashboardIcon name={item.icon} size={19} />
              </span>
                            <span className="admin-sidebar-link-label">{item.label}</span>
                            {activeSection === item.id && <span className="admin-sidebar-active-dot" />}
                        </button>
                    ))}
                </nav>
            </aside>

            <div className="admin-dashboard-main">
                <header className="admin-topbar">
                    <button
                        type="button"
                        className="admin-mobile-menu"
                        onClick={() => setMobileNavOpen((open) => !open)}
                    >
                        <DashboardIcon name="menu" size={21} />
                    </button>

                    <div className="admin-topbar-heading">
                        <span className="admin-topbar-breadcrumb">PORTAL <span>/</span> WORKSPACE</span>
                        <h1>{currentItem.label}</h1>
                    </div>

                    <div className="admin-header-actions">
                        <AccountMenu />
                    </div>
                </header>

                <main className="admin-dashboard-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
