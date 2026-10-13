import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
    return (
        <div className="fh-page" id="top">
            <header>
                <div className="fh-top-bar">
                    <p>Focus International School - Matale</p>
                    <p>Contact: +94 XX XXX XXXX</p>
                </div>

                <nav className="fh-navbar">
                    <div className="fh-logo-section">
                        <img src="/focus.png" alt="Focus International School Logo" />
                        <div>
                            <h2>FOCUS</h2>
                            <p>INTERNATIONAL SCHOOL</p>
                        </div>
                    </div>

                    <ul className="fh-nav-links">
                        <li><a href="#top">Home</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#academics">Academics</a></li>
                        <li><a href="#admissions">Admissions</a></li>
                        <li><a href="#activities">Student Life</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>

                    <Link to="/login" className="fh-login-button">Login</Link>
                </nav>
            </header>

            <section className="fh-hero">
                <div className="fh-hero-content">
                    <p className="fh-welcome">WELCOME TO</p>
                    <h1>Focus International School</h1>
                    <p>Inspiring young minds through knowledge, character and excellence.</p>
                    <div className="fh-hero-buttons">
                        <a href="#about" className="fh-primary-button">Discover More</a>
                        <Link to="/login" className="fh-secondary-button">School Portal</Link>
                    </div>
                </div>
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
                        <a href="#academics" className="fh-read-more">Read More →</a>
                    </div>
                    <div className="fh-image-content">
                        <img src="/focus1.png" alt="Focus International School" />
                    </div>
                </div>
            </section>

            <section id="academics" className="fh-features">
                <div className="fh-section-heading">
                    <p className="fh-section-title">WHAT WE OFFER</p>
                    <h2>Education Beyond Classrooms</h2>
                </div>
                <div className="fh-feature-container">
                    <div className="fh-feature-card">
                        <div className="fh-icon">01</div>
                        <h3>Academic Excellence</h3>
                        <p>Developing strong academic foundations and encouraging students to achieve their full potential.</p>
                    </div>
                    <div className="fh-feature-card">
                        <div className="fh-icon">02</div>
                        <h3>Student Development</h3>
                        <p>Supporting students in developing leadership, communication and teamwork skills.</p>
                    </div>
                    <div className="fh-feature-card">
                        <div className="fh-icon">03</div>
                        <h3>Extra Curricular Activities</h3>
                        <p>Encouraging students to participate in sports, clubs, societies and creative activities.</p>
                    </div>
                </div>
            </section>

            <section id="admissions" className="fh-admission">
                <div>
                    <p className="fh-section-title">JOIN OUR SCHOOL</p>
                    <h2>Admissions Are Open</h2>
                    <p>
                        Give your child an environment where learning, creativity and character
                        development go hand in hand.
                    </p>
                    <a href="#contact" className="fh-primary-button">Learn About Admissions</a>
                </div>
            </section>

            <section id="activities" className="fh-section">
                <div className="fh-section-heading">
                    <p className="fh-section-title">SCHOOL LIFE</p>
                    <h2>Developing Well-Rounded Students</h2>
                </div>
                <div className="fh-activity-container">
                    <div className="fh-activity-card">
                        <h3>Sports</h3>
                        <p>Encouraging teamwork, discipline and a healthy lifestyle through sports.</p>
                    </div>
                    <div className="fh-activity-card">
                        <h3>Clubs &amp; Societies</h3>
                        <p>Providing opportunities for students to explore their interests and talents.</p>
                    </div>
                    <div className="fh-activity-card">
                        <h3>Events</h3>
                        <p>Celebrating achievements and creating memorable school experiences.</p>
                    </div>
                </div>
            </section>

            <footer id="contact" className="fh-footer">
                <div className="fh-footer-container">
                    <div>
                        <h2>FOCUS</h2>
                        <p>Focus International School<br />Matale, Sri Lanka</p>
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
                        <p>Matale, Sri Lanka</p>
                        <p>Phone: +94 XX XXX XXXX</p>
                        <p>Email: info@focusschool.lk</p>
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