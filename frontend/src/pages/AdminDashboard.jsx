// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
//
// import SubjectManagement from "./SubjectManagement";
// import ClassManagement from "./ClassManagement.jsx";
// import LeaveApprovalManagement from "./LeaveApprovalManagement.jsx";
// import PaymentReview from "./PaymentReview.jsx";
// import RegisterStudentPage from "./RegisterStudentPage.jsx";
// import EditStudentPage from "./EditStudentPage.jsx";
//
// import "./AdminDashboard.css";
//
// const NAV_ITEMS = [
//   {
//     id: "overview",
//     label: "Overview",
//     description: "Your administration workspace",
//     icon: "grid",
//   },
//   {
//     id: "subjects",
//     label: "Subjects",
//     description: "Manage the subject catalogue",
//     icon: "book",
//   },
//   {
//     id: "classes",
//     label: "Classes",
//     description: "Manage classes and schedules",
//     icon: "calendar",
//   },
//   {
//     id: "leaves",
//     label: "Leave Approvals",
//     description: "Review academic staff requests",
//     icon: "clipboard",
//   },
//   {
//     id: "payments",
//     label: "Payments",
//     description: "Review student payment slips",
//     icon: "wallet",
//   },
//   {
//     id: "register-student",
//     label: "Register Student",
//     description: "Enroll new students into the system",
//     icon: "user-plus",
//   },
//   {
//     id: "edit-student",
//     label: "Edit Student",
//     description: "Modify existing student records",
//     icon: "user-edit",
//   },
// ];
//
// function AdminIcon({ name, size = 21 }) {
//   const props = {
//     width: size,
//     height: size,
//     viewBox: "0 0 24 24",
//     fill: "none",
//     stroke: "currentColor",
//     strokeWidth: 1.7,
//     strokeLinecap: "round",
//     strokeLinejoin: "round",
//     "aria-hidden": true,
//   };
//
//   switch (name) {
//     case "grid":
//       return (
//           <svg {...props}>
//             <rect x="3" y="3" width="7" height="7" rx="2" />
//             <rect x="14" y="3" width="7" height="7" rx="2" />
//             <rect x="3" y="14" width="7" height="7" rx="2" />
//             <rect x="14" y="14" width="7" height="7" rx="2" />
//           </svg>
//       );
//
//     case "book":
//       return (
//           <svg {...props}>
//             <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
//             <path d="M4 18a2.5 2.5 0 0 1 2.5-2.5H20M8 7h7M8 11h7" />
//           </svg>
//       );
//
//     case "calendar":
//       return (
//           <svg {...props}>
//             <rect x="3" y="5" width="18" height="16" rx="3" />
//             <path d="M16 3v4M8 3v4M3 10h18" />
//             <path d="M8 14h2M14 14h2M8 17h2" />
//           </svg>
//       );
//
//     case "clipboard":
//       return (
//           <svg {...props}>
//             <rect x="5" y="4" width="14" height="17" rx="2" />
//             <path d="M9 4V2h6v2M9 10h6M9 14h3" />
//             <path d="m9 17 1.5 1.5L15 14" />
//           </svg>
//       );
//
//     case "arrow":
//       return (
//           <svg {...props}>
//             <path d="M5 12h14M13 6l6 6-6 6" />
//           </svg>
//       );
//
//     case "shield":
//       return (
//           <svg {...props}>
//             <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
//             <path d="m9 12 2 2 4-4" />
//           </svg>
//       );
//
//     case "menu":
//       return (
//           <svg {...props}>
//             <path d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//       );
//
//     case "wallet":
//       return (
//           <svg {...props}>
//             <rect x="3" y="6" width="18" height="14" rx="3" />
//             <path d="M3 10h18M16 15h2M6 6V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
//           </svg>
//       );
//
//     case "user-plus":
//       return (
//           <svg {...props}>
//             <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//             <circle cx="9" cy="7" r="4" />
//             <line x1="19" y1="8" x2="19" y2="14" />
//             <line x1="22" y1="11" x2="16" y2="11" />
//           </svg>
//       );
//
//     case "user-edit":
//       return (
//           <svg {...props}>
//             <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//             <circle cx="9" cy="7" r="4" />
//             <path d="M13.5 13.5L18 9l3 3-4.5 4.5H16v-2.5z" />
//           </svg>
//       );
//
//     default:
//       return null;
//   }
// }
//
// function AdminDashboard() {
//   const [activeSection, setActiveSection] = useState("overview");
//   const [mobileNavOpen, setMobileNavOpen] = useState(false);
//   const navigate = useNavigate();
//
//   const currentItem =
//       NAV_ITEMS.find((item) => item.id === activeSection) ?? NAV_ITEMS[0];
//
//   function navigateTo(section) {
//     setActiveSection(section);
//     setMobileNavOpen(false);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }
//
//   function handleLogout() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   }
//
//   function renderContent() {
//     switch (activeSection) {
//       case "subjects":
//         return <SubjectManagement />;
//
//       case "classes":
//         return <ClassManagement />;
//
//       case "leaves":
//         return <LeaveApprovalManagement />;
//
//       case "payments":
//         return <PaymentReview />;
//
//       case "register-student":
//         return <RegisterStudentPage />;
//
//       case "edit-student":
//         return <EditStudentPage />;
//
//       default:
//         return (
//             <section className="admin-overview">
//               <div className="admin-welcome-panel">
//                 <div className="admin-welcome-copy">
//                 <span className="admin-eyebrow">
//                   ADMINISTRATIVE WORKSPACE
//                 </span>
//
//                   <h2>
//                     Manage academics.
//                     <span> Keep everything organized.</span>
//                   </h2>
//
//                   <p>
//                     Maintain subject records, organize class schedules,
//                     review leave requests, manage student enrollments, and verify payments.
//                   </p>
//
//                   <button
//                       type="button"
//                       className="admin-primary-button"
//                       onClick={() => navigateTo("leaves")}
//                   >
//                     Review leave requests
//                     <AdminIcon name="arrow" size={17} />
//                   </button>
//                 </div>
//
//                 <div className="admin-welcome-art" aria-hidden="true">
//                   <div className="admin-art-ring admin-art-ring-one" />
//                   <div className="admin-art-ring admin-art-ring-two" />
//
//                   <div className="admin-art-icon">
//                     <AdminIcon name="shield" size={47} />
//                   </div>
//
//                   <span className="admin-art-dot admin-art-dot-one" />
//                   <span className="admin-art-dot admin-art-dot-two" />
//                   <span className="admin-art-dot admin-art-dot-three" />
//                 </div>
//               </div>
//
//               <div className="admin-section-intro">
//                 <div>
//                   <span className="admin-eyebrow">WORKSPACE MODULES</span>
//                   <h2>What would you like to manage?</h2>
//                   <p>
//                     Select a module to view records or perform an
//                     administrative task.
//                   </p>
//                 </div>
//               </div>
//
//               <div className="admin-module-grid">
//                 <button
//                     type="button"
//                     className="admin-module-card admin-module-subjects"
//                     onClick={() => navigateTo("subjects")}
//                 >
//                   <div className="admin-module-card-top">
//                   <span className="admin-module-icon">
//                     <AdminIcon name="book" size={27} />
//                   </span>
//
//                     <span className="admin-module-number">01</span>
//                   </div>
//
//                   <div className="admin-module-copy">
//                   <span className="admin-module-eyebrow">
//                     ACADEMIC CATALOGUE
//                   </span>
//
//                     <h3>Subject Management</h3>
//
//                     <p>
//                       Create subjects, update subject details, and
//                       maintain the institution's subject catalogue.
//                     </p>
//                   </div>
//
//                   <span className="admin-module-footer">
//                   Open Subject Management
//                   <AdminIcon name="arrow" size={18} />
//                 </span>
//                 </button>
//
//                 <button
//                     type="button"
//                     className="admin-module-card admin-module-classes"
//                     onClick={() => navigateTo("classes")}
//                 >
//                   <div className="admin-module-card-top">
//                   <span className="admin-module-icon">
//                     <AdminIcon name="calendar" size={27} />
//                   </span>
//
//                     <span className="admin-module-number">02</span>
//                   </div>
//
//                   <div className="admin-module-copy">
//                   <span className="admin-module-eyebrow">
//                     TIMETABLE & SCHEDULING
//                   </span>
//
//                     <h3>Class Management</h3>
//
//                     <p>
//                       Create classes, assign subjects and staff,
//                       and maintain weekly teaching schedules.
//                     </p>
//                   </div>
//
//                   <span className="admin-module-footer">
//                   Open Class Management
//                   <AdminIcon name="arrow" size={18} />
//                 </span>
//                 </button>
//
//                 <button
//                     type="button"
//                     className="admin-module-card admin-module-leaves"
//                     onClick={() => navigateTo("leaves")}
//                 >
//                   <div className="admin-module-card-top">
//                   <span className="admin-module-icon">
//                     <AdminIcon name="clipboard" size={27} />
//                   </span>
//
//                     <span className="admin-module-number">03</span>
//                   </div>
//
//                   <div className="admin-module-copy">
//                   <span className="admin-module-eyebrow">
//                     STAFF SERVICES
//                   </span>
//
//                     <h3>Leave Approvals</h3>
//
//                     <p>
//                       Review full-day and short-leave requests,
//                       approve suitable requests, or reject them.
//                     </p>
//                   </div>
//
//                   <span className="admin-module-footer">
//                   Review Leave Requests
//                   <AdminIcon name="arrow" size={18} />
//                 </span>
//                 </button>
//
//                 <button
//                     type="button"
//                     className="admin-module-card admin-module-payments"
//                     onClick={() => navigateTo("payments")}
//                 >
//                   <div className="admin-module-card-top">
//                   <span className="admin-module-icon">
//                     <AdminIcon name="wallet" size={27} />
//                   </span>
//                     <span className="admin-module-number">04</span>
//                   </div>
//                   <div className="admin-module-copy">
//                     <span className="admin-module-eyebrow">FEES & BILLING</span>
//                     <h3>Payment Review</h3>
//                     <p>
//                       Check submitted payment slips, approve or reject them,
//                       and keep the school's payment records up to date.
//                     </p>
//                   </div>
//                   <span className="admin-module-footer">
//                   Open Payment Review
//                   <AdminIcon name="arrow" size={18} />
//                 </span>
//                 </button>
//
//                 <button
//                     type="button"
//                     className="admin-module-card admin-module-register"
//                     onClick={() => navigateTo("register-student")}
//                 >
//                   <div className="admin-module-card-top">
//                   <span className="admin-module-icon">
//                     <AdminIcon name="user-plus" size={27} />
//                   </span>
//                     <span className="admin-module-number">05</span>
//                   </div>
//                   <div className="admin-module-copy">
//                     <span className="admin-module-eyebrow">ADMISSIONS</span>
//                     <h3>Register Student</h3>
//                     <p>
//                       Enroll new students into the system and record their initial details.
//                     </p>
//                   </div>
//                   <span className="admin-module-footer">
//                   Register Student
//                   <AdminIcon name="arrow" size={18} />
//                 </span>
//                 </button>
//
//                 <button
//                     type="button"
//                     className="admin-module-card admin-module-edit"
//                     onClick={() => navigateTo("edit-student")}
//                 >
//                   <div className="admin-module-card-top">
//                   <span className="admin-module-icon">
//                     <AdminIcon name="user-edit" size={27} />
//                   </span>
//                     <span className="admin-module-number">06</span>
//                   </div>
//                   <div className="admin-module-copy">
//                     <span className="admin-module-eyebrow">RECORDS</span>
//                     <h3>Edit Student</h3>
//                     <p>
//                       Modify existing student profiles, grades, and academic records.
//                     </p>
//                   </div>
//                   <span className="admin-module-footer">
//                   Edit Student Records
//                   <AdminIcon name="arrow" size={18} />
//                 </span>
//                 </button>
//               </div>
//
//               <div className="admin-overview-note">
//               <span className="admin-overview-note-icon">
//                 <AdminIcon name="shield" size={20} />
//               </span>
//
//                 <div>
//                   <strong>Administrative workspace</strong>
//                   <p>
//                     Changes made through these modules affect the
//                     shared academic management records. Verify the
//                     details before creating or deleting records.
//                   </p>
//                 </div>
//               </div>
//             </section>
//         );
//     }
//   }
//
//   return (
//       <div className="admin-dashboard-layout">
//         <aside
//             className={`admin-sidebar ${
//                 mobileNavOpen ? "admin-sidebar-open" : ""
//             }`}
//         >
//           <div className="admin-sidebar-brand">
//           <span className="admin-brand-icon">
//             <AdminIcon name="shield" size={25} />
//           </span>
//
//             <div>
//               <strong>Campus Admin</strong>
//               <span>Management Console</span>
//             </div>
//           </div>
//
//           <div className="admin-sidebar-label">MAIN MENU</div>
//
//           <nav className="admin-sidebar-navigation" aria-label="Admin menu">
//             {NAV_ITEMS.map((item) => (
//                 <button
//                     type="button"
//                     key={item.id}
//                     className={`admin-sidebar-link ${
//                         activeSection === item.id ? "admin-link-active" : ""
//                     }`}
//                     onClick={() => navigateTo(item.id)}
//                     aria-current={activeSection === item.id ? "page" : undefined}
//                 >
//               <span className="admin-sidebar-link-icon">
//                 <AdminIcon name={item.icon} size={19} />
//               </span>
//
//                   <span className="admin-sidebar-link-label">
//                 {item.label}
//               </span>
//
//                   {activeSection === item.id && (
//                       <span className="admin-sidebar-active-dot" />
//                   )}
//                 </button>
//             ))}
//           </nav>
//
//           <div className="admin-sidebar-footer">
//           <span className="admin-sidebar-footer-icon">
//             <AdminIcon name="shield" size={19} />
//           </span>
//
//             <div>
//               <strong>Administrative services</strong>
//               <span>Academic operations</span>
//             </div>
//           </div>
//         </aside>
//
//         <div className="admin-dashboard-main">
//           <header className="admin-topbar">
//             <button
//                 type="button"
//                 className="admin-mobile-menu"
//                 onClick={() => setMobileNavOpen((open) => !open)}
//                 aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
//                 aria-expanded={mobileNavOpen}
//             >
//               <AdminIcon name="menu" size={21} />
//             </button>
//
//             <div className="admin-topbar-heading">
//             <span className="admin-topbar-breadcrumb">
//               ADMINISTRATION <span>/</span> WORKSPACE
//             </span>
//
//               <h1>{currentItem.label}</h1>
//             </div>
//
//             <div className="admin-topbar-right" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//               <div className="admin-topbar-status">
//                 <span className="admin-topbar-status-dot" />
//                 Admin console
//               </div>
//               <button
//                   type="button"
//                   className="admin-logout-btn"
//                   onClick={handleLogout}
//               >
//                 Logout
//               </button>
//             </div>
//           </header>
//
//           {mobileNavOpen && (
//               <button
//                   type="button"
//                   className="admin-mobile-backdrop"
//                   aria-label="Close navigation menu"
//                   onClick={() => setMobileNavOpen(false)}
//               />
//           )}
//
//           <main className="admin-dashboard-content">
//             {renderContent()}
//           </main>
//
//           <footer className="admin-dashboard-footer">
//             <span>Smart Student Management System</span>
//             <span className="admin-footer-separator">•</span>
//             <span>Administrative Services</span>
//           </footer>
//         </div>
//       </div>
//   );
// }
//
// export default AdminDashboard;