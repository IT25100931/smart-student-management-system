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

import "./AdminDashboard.css";
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
        case "logout":
            return (
                <svg {...props}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="m16 17 5-5-5-5M21 12H9" />
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

/* ---------- Navigation per role ---------- */

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
    ],
    TEACHER: [
        { id: "overview", label: "Overview", icon: "grid" },
        { id: "search-student", label: "Search Student", icon: "search" },
        { id: "leave-management", label: "Leave Management", icon: "clipboard" },
    ],
    PARENT: [
        { id: "overview", label: "Overview", icon: "grid" },
        { id: "payments", label: "Fee Payments", icon: "wallet" },
    ],
};

/* ---------- Overview module cards per role ---------- */

const ADMIN_MODULES = [
    {
        id: "subjects",
        variant: "subjects",
        icon: "book",
        eyebrow: "ACADEMIC CATALOGUE",
        title: "Subject Management",
        text: "Create subjects, update details, and maintain the subject catalogue.",
        cta: "Open Subject Management",
    },
    {
        id: "classes",
        variant: "classes",
        icon: "calendar",
        eyebrow: "TIMETABLE & SCHEDULING",
        title: "Class Management",
        text: "Create classes, assign subjects and staff, and maintain schedules.",
        cta: "Open Class Management",
    },
    {
        id: "leaves",
        variant: "leaves",
        icon: "clipboard",
        eyebrow: "STAFF SERVICES",
        title: "Leave Approvals",
        text: "Review leave requests, approve suitable requests, or reject them.",
        cta: "Review Leave Requests",
    },
    {
        id: "payments",
        variant: "payments",
        icon: "wallet",
        eyebrow: "FEES & BILLING",
        title: "Payment Review",
        text: "Check submitted payment slips, approve or reject them, and update records.",
        cta: "Open Payment Review",
    },
    {
        id: "register-student",
        variant: "register",
        icon: "user-plus",
        eyebrow: "ADMISSIONS",
        title: "Register Student",
        text: "Enroll new students into the system and record their initial details.",
        cta: "Register Student",
    },
    {
        id: "edit-student",
        variant: "edit",
        icon: "user-edit",
        eyebrow: "RECORDS",
        title: "Edit Student",
        text: "Modify existing student profiles, grades, and academic records.",
        cta: "Edit Student Records",
    },
    {
        id: "create-user",
        variant: "create-user",
        icon: "users",
        eyebrow: "ADMINISTRATION",
        title: "Create User Profile",
        text: "Add new system users and assign their respective access roles.",
        cta: "Create User",
    },
];

const TEACHER_MODULES = [
    {
        id: "search-student",
        variant: "subjects",
        icon: "search",
        eyebrow: "STUDENT RECORDS",
        title: "Search Student",
        text: "Look up student profiles, view academic details, and check information.",
        cta: "Open Student Search",
    },
    {
        id: "leave-management",
        variant: "classes",
        icon: "clipboard",
        eyebrow: "STAFF PORTAL",
        title: "Leave Management",
        text: "Submit leave requests, check leave balances, and track approvals.",
        cta: "Manage Leave Requests",
    },
];

const PARENT_MODULES = [
    {
        id: "payments",
        variant: "payments",
        icon: "wallet",
        eyebrow: "FEES & BILLING",
        title: "Fee Payments",
        text: "Check your child's fee balance and upload payment slips.",
        cta: "Open Fee Payments",
    },
];

/* ---------- Small presentational pieces ---------- */

function HeroArt() {
    return (
        <div className="admin-welcome-art" aria-hidden="true">
            <span className="admin-art-ring admin-art-ring-one" />
            <span className="admin-art-ring admin-art-ring-two" />
            <span className="admin-art-icon">
                <DashboardIcon name="shield" size={34} />
            </span>
            <span className="admin-art-dot admin-art-dot-one" />
            <span className="admin-art-dot admin-art-dot-two" />
            <span className="admin-art-dot admin-art-dot-three" />
        </div>
    );
}

function Hero({ eyebrow, title, highlight, text, actionLabel, onAction }) {
    return (
        <div className="admin-welcome-panel">
            <div className="admin-welcome-copy">
                <span className="admin-eyebrow">{eyebrow}</span>

                <h2>
                    {title}
                    {highlight && <span>{highlight}</span>}
                </h2>

                <p>{text}</p>

                {actionLabel && (
                    <button
                        type="button"
                        className="admin-primary-button"
                        onClick={onAction}
                    >
                        {actionLabel} <DashboardIcon name="arrow" size={17} />
                    </button>
                )}
            </div>

            <HeroArt />
        </div>
    );
}

function ModuleGrid({ modules, onOpen }) {
    return (
        <div className="admin-module-grid">
            {modules.map((module, index) => (
                <button
                    type="button"
                    key={module.id}
                    className={`admin-module-card admin-module-${module.variant}`}
                    onClick={() => onOpen(module.id)}
                >
                    <div className="admin-module-card-top">
                        <span className="admin-module-icon">
                            <DashboardIcon name={module.icon} size={26} />
                        </span>

                        <span className="admin-module-number">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                    </div>

                    <div className="admin-module-copy">
                        <span className="admin-module-eyebrow">{module.eyebrow}</span>
                        <h3>{module.title}</h3>
                        <p>{module.text}</p>
                    </div>

                    <span className="admin-module-footer">
                        {module.cta} <DashboardIcon name="arrow" size={18} />
                    </span>
                </button>
            ))}
        </div>
    );
}

function SectionIntro({ eyebrow, title, text }) {
    return (
        <div className="admin-section-intro">
            <div>
                <span className="admin-eyebrow">{eyebrow}</span>
                <h2>{title}</h2>
                <p>{text}</p>
            </div>
        </div>
    );
}

/* ---------- Dashboard ---------- */

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
                default:
                    return (
                        <section className="admin-overview">
                            <Hero
                                eyebrow="ADMINISTRATIVE WORKSPACE"
                                title="Manage academics."
                                highlight="Keep everything organized."
                                text="Maintain subject records, schedules, leave approvals, user profiles, and student enrollments from one central workspace."
                                actionLabel="Review leave requests"
                                onAction={() => navigateTo("leaves")}
                            />

                            <SectionIntro
                                eyebrow="WORKSPACE MODULES"
                                title="What would you like to manage?"
                                text="Select a module to view records or perform an administrative task."
                            />

                            <ModuleGrid modules={ADMIN_MODULES} onOpen={navigateTo} />
                        </section>
                    );
            }
        }

        if (role === "TEACHER") {
            switch (activeSection) {
                case "search-student": return <StudentSearch />;
                case "leave-management": return <LeaveManagement />;
                default:
                    return (
                        <section className="admin-overview">
                            <Hero
                                eyebrow="TEACHER PORTAL"
                                title="Welcome, Teacher."
                                highlight="Manage your daily tasks."
                                text="Search student profiles or manage your leave requests from one central workspace."
                                actionLabel="Search student records"
                                onAction={() => navigateTo("search-student")}
                            />

                            <SectionIntro
                                eyebrow="TEACHER MODULES"
                                title="What would you like to do?"
                                text="Select a module to search student information or manage leave."
                            />

                            <ModuleGrid modules={TEACHER_MODULES} onOpen={navigateTo} />
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
                            <Hero
                                eyebrow="PARENT PORTAL"
                                title="Fee Payments"
                                highlight="& Status"
                                text="Check your child's fee balance and upload payment slips."
                                actionLabel="Open fee payments"
                                onAction={() => navigateTo("payments")}
                            />

                            <ModuleGrid modules={PARENT_MODULES} onOpen={navigateTo} />
                        </section>
                    );
            }
        }

        return null;
    }

    return (
        <div className="admin-dashboard-layout">
            {mobileNavOpen && (
                <button
                    type="button"
                    className="admin-mobile-backdrop"
                    aria-label="Close menu"
                    onClick={() => setMobileNavOpen(false)}
                />
            )}

            <aside
                className={`admin-sidebar ${mobileNavOpen ? "admin-sidebar-open" : ""}`}
            >
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
                            className={`admin-sidebar-link ${
                                activeSection === item.id ? "admin-link-active" : ""
                            }`}
                            onClick={() => navigateTo(item.id)}
                        >
                            <span className="admin-sidebar-link-icon">
                                <DashboardIcon name={item.icon} size={19} />
                            </span>

                            <span className="admin-sidebar-link-label">{item.label}</span>

                            {activeSection === item.id && (
                                <span className="admin-sidebar-active-dot" />
                            )}
                        </button>
                    ))}
                </nav>

                <button
                    type="button"
                    className="admin-sidebar-signout"
                    onClick={handleLogout}
                >
                    <DashboardIcon name="logout" size={18} />
                    Sign out
                </button>
            </aside>

            <div className="admin-dashboard-main">
                <header className="admin-topbar">
                    <button
                        type="button"
                        className="admin-mobile-menu"
                        aria-label="Toggle menu"
                        onClick={() => setMobileNavOpen((open) => !open)}
                    >
                        <DashboardIcon name="menu" size={21} />
                    </button>

                    <div className="admin-topbar-heading">
                        <span className="admin-topbar-breadcrumb">
                            PORTAL <span>/</span> WORKSPACE
                        </span>
                        <h1>{currentItem.label}</h1>
                    </div>

                    <div className="admin-header-actions">
                        <AccountMenu />
                    </div>
                </header>

                <main className="admin-dashboard-content">{renderContent()}</main>
            </div>
        </div>
    );
}

export default Dashboard;