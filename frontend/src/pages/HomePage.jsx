import { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function Icon({ name, size = 22 }) {
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
        case "book":
            return (
                <svg {...props}>
                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
                    <path d="M4 18a2.5 2.5 0 0 1 2.5-2.5H20M8 7h7M8 11h7" />
                </svg>
            );
        case "users":
            return (
                <svg {...props}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            );
        case "star":
            return (
                <svg {...props}>
                    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />
                </svg>
            );
        case "ball":
            return (
                <svg {...props}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18M3 12h18" />
                </svg>
            );
        case "calendar":
            return (
                <svg {...props}>
                    <rect x="3" y="5" width="18" height="16" rx="3" />
                    <path d="M16 3v4M8 3v4M3 10h18" />
                </svg>
            );
        case "check":
            return (
                <svg {...props}>
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
            );
        case "arrow":
            return (
                <svg {...props}>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
            );
        case "phone":
            return (
                <svg {...props}>
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
                </svg>
            );
        case "mail":
            return (
                <svg {...props}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                </svg>
            );
        case "pin":
            return (
                <svg {...props}>
                    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
                    <circle cx="12" cy="9.5" r="2.5" />
                </svg>
            );
        case "menu":
            return (
                <svg {...props}>
                    <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            );
        case "close":
            return (
                <svg {...props}>
                    <path d="M6 6l12 12M18 6 6 18" />
                </svg>
            );
        default:
            return null;
    }
}

const NAV_LINKS = [
    { href: "#top", label: "Home" },
    { href: "#about", label: "About Us" },
    { href: "#academics", label: "Academics" },
    { href: "#admissions", label: "Admissions" },
    { href: "#activities", label: "Student Life" },
    { href: "#contact", label: "Contact" },
];

const HIGHLIGHTS = [
    { value: "2019", label: "Year established" },
    { value: "Matale", label: "Sri Lanka" },
    { value: "3", label: "Pillars: knowledge, character, excellence" },
];

const ABOUT_POINTS = [
    "Academic excellence",
    "Personal development",
    "Discipline and character",
    "Extracurricular activities",
];

const FEATURES = [
    {
        icon: "book",
        title: "Academic Excellence",
        text: "Developing strong academic foundations and encouraging students to achieve their full potential.",
    },
    {
        icon: "users",
        title: "Student Development",
        text: "Supporting students in developing leadership, communication and teamwork skills.",
    },
    {
        icon: "star",
        title: "Extra Curricular Activities",
        text: "Encouraging students to participate in sports, clubs, societies and creative activities.",
    },
];

const ACTIVITIES = [
    {
        icon: "ball",
        title: "Sports",
        text: "Encouraging teamwork, discipline and a healthy lifestyle through sports.",
    },
    {
        icon: "users",
        title: "Clubs & Societies",
        text: "Providing opportunities for students to explore their interests and talents.",
    },
    {
        icon: "calendar",
        title: "Events",
        text: "Celebrating achievements and creating memorable school experiences.",
    },
];

function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="fh-page" id="top">
            <div className="fh-top-bar">
                <p>
                    <Icon name="pin" size={14} /> Focus International School - Matale
                </p>
                <p>
                    <Icon name="phone" size={14} /> Contact: +94 XX XXX XXXX
                </p>
            </div>

            <header className="fh-header">
                <nav className="fh-navbar" aria-label="Main navigation">
                    <a href="#top" className="fh-logo-section">
                        <img src="/focus.png" alt="Focus International School Logo" />
                        <div>
                            <h2>FOCUS</h2>
                            <p>INTERNATIONAL SCHOOL</p>
                        </div>
                    </a>

                    <ul className={`fh-nav-links ${menuOpen ? "is-open" : ""}`}>
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} onClick={() => setMenuOpen(false)}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li className="fh-nav-login-mobile">
                            <Link to="/login" onClick={() => setMenuOpen(false)}>
                                Login
                            </Link>
                        </li>
                    </ul>

                    <div className="fh-nav-actions">
                        <Link to="/login" className="fh-login-button">
                            Login
                        </Link>

                        <button
                            type="button"
                            className="fh-menu-toggle"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            <Icon name={menuOpen ? "close" : "menu"} size={22} />
                        </button>
                    </div>
                </nav>
            </header>

            <section className="fh-hero">
                <div className="fh-hero-content">
                    <p className="fh-welcome">WELCOME TO</p>
                    <h1 style={{color:'white'}}>
                        Focus International <span>School</span>
                    </h1>
                    <p className="fh-hero-text">
                        Inspiring young minds through knowledge, character and excellence.
                    </p>
                    <div className="fh-hero-buttons">
                        <a href="#about" className="fh-primary-button">
                            Discover More <Icon name="arrow" size={18} />
                        </a>
                        <Link to="/login" className="fh-secondary-button">
                            School Portal
                        </Link>
                    </div>
                </div>
            </section>

            <section className="fh-highlights" aria-label="School highlights">
                {HIGHLIGHTS.map((item) => (
                    <div className="fh-highlight" key={item.value}>
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                    </div>
                ))}
            </section>

            <section id="about" className="fh-section">
                <div className="fh-section-content">
                    <div className="fh-text-content">
                        <p className="fh-section-title">ABOUT OUR SCHOOL</p>
                        <h2>Welcome to Focus International School</h2>
                        <p>
                            Established in 2019, Focus International School – Matale is committed to
                            providing quality education in a supportive and inspiring learning
                            environment. The school focuses on academic excellence, character
                            development, and preparing students for a successful future.
                        </p>
                        <p>
                            Our school focuses on academic excellence, personal development,
                            discipline and extracurricular activities to help students become
                            confident and responsible individuals.
                        </p>

                        <ul className="fh-check-list">
                            {ABOUT_POINTS.map((point) => (
                                <li key={point}>
                                    <span>
                                        <Icon name="check" size={14} />
                                    </span>
                                    {point}
                                </li>
                            ))}
                        </ul>

                        <a href="#academics" className="fh-read-more">
                            Read More <Icon name="arrow" size={18} />
                        </a>
                    </div>

                    <div className="fh-image-content">
                        <div className="fh-image-frame">
                            <img src="/focus1.png" alt="Focus International School" />
                            <span className="fh-image-badge">
                                <strong>2019</strong>
                                Established
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section id="academics" className="fh-features">
                <div className="fh-section-heading">
                    <p className="fh-section-title">WHAT WE OFFER</p>
                    <h2>Education Beyond Classrooms</h2>
                </div>

                <div className="fh-feature-container">
                    {FEATURES.map((feature, index) => (
                        <article className="fh-feature-card" key={feature.title}>
                            <span className="fh-feature-number">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="fh-icon">
                                <Icon name={feature.icon} size={26} />
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section id="admissions" className="fh-admission">
                <div className="fh-admission-content">
                    <p className="fh-section-title">JOIN OUR SCHOOL</p>
                    <h2 style={{color:'white'}}>Admissions Are Open</h2>
                    <p>
                        Give your child an environment where learning, creativity and character
                        development go hand in hand.
                    </p>
                    <a href="#contact" className="fh-primary-button">
                        Learn About Admissions <Icon name="arrow" size={18} />
                    </a>
                </div>
            </section>

            <section id="activities" className="fh-section">
                <div className="fh-section-heading">
                    <p className="fh-section-title">SCHOOL LIFE</p>
                    <h2>Developing Well-Rounded Students</h2>
                </div>

                <div className="fh-activity-container">
                    {ACTIVITIES.map((activity) => (
                        <article className="fh-activity-card" key={activity.title}>
                            <div className="fh-activity-icon">
                                <Icon name={activity.icon} size={24} />
                            </div>
                            <h3>{activity.title}</h3>
                            <p>{activity.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="fh-portal-band">
                <div>
                    <h2>School Portal</h2>
                    <p>
                        Parents, teachers and administrators can sign in to manage fees, classes,
                        leave and student records.
                    </p>
                </div>
                <Link to="/login" className="fh-portal-button">
                    Login to Portal <Icon name="arrow" size={18} />
                </Link>
            </section>

            <footer id="contact" className="fh-footer">
                <div className="fh-footer-container">
                    <div>
                        <h2 style={{color:'white'}}>FOCUS</h2>
                        <p>
                            Focus International School
                            <br />
                            Matale, Sri Lanka
                        </p>
                    </div>

                    <div>
                        <h3>Quick Links</h3>
                        <a href="#top">Home</a>
                        <a href="#about">About Us</a>
                        <a href="#academics">Academics</a>
                        <a href="#admissions">Admissions</a>
                    </div>

                    <div>
                        <h3>Contact Us</h3>
                        <p>
                            <Icon name="pin" size={15} /> Matale, Sri Lanka
                        </p>
                        <p>
                            <Icon name="phone" size={15} /> Phone: +94 XX XXX XXXX
                        </p>
                        <p>
                            <Icon name="mail" size={15} /> Email: info@focusschool.lk
                        </p>
                    </div>
                </div>

                <div className="fh-copyright">
                    <p>© 2026 Focus International School. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;