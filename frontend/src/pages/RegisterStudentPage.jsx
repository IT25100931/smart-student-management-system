import { useState, useRef } from 'react';
import { authHeaders } from '../utils/authFetch';
import './LoginPage.css';

const today = new Date().toISOString().split('T')[0];

function RegisterStudentPage() {
    const dobRef = useRef(null);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', dob: '', gender: '',
        email: '', contactNo: '', address: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:8081/students', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(`Student registered successfully with ID: ${data.studentId}`);
                setFormData({ firstName: '', lastName: '', dob: '', gender: '', email: '', contactNo: '', address: '' });
            } else if (response.status === 401) {
                setMessage('Session expired or not logged in. Please log in again.');
            } else {
                setMessage('Registration failed. Please check the details.');
            }
        } catch (err) {
            setMessage('Could not connect to server.');
        }
    };

    return (
        <div className="login-screen">
            <div className="login-panel-identity">
                <div className="login-identity-inner">
                    <p className="login-eyebrow">Student management system</p>
                    <h1 className="login-title">New Student</h1>
                    <div className="login-rule" />
                    <p className="login-subtext">Register a new student into the school system.</p>
                </div>
            </div>

            <div className="login-panel-form">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2 className="login-form-heading">Register Student</h2>

                    <label className="login-label">First Name</label>
                    <input className="login-input" name="firstName" value={formData.firstName} onChange={handleChange} required />

                    <label className="login-label">Last Name</label>
                    <input className="login-input" name="lastName" value={formData.lastName} onChange={handleChange} required />

                    <label className="login-label">Date of Birth</label>
                    <input
                        ref={dobRef}
                        className="login-input"
                        type="date"
                        name="dob"
                        max={today}
                        value={formData.dob}
                        onChange={handleChange}
                        onClick={() => dobRef.current.showPicker()}
                        required
                    />

                    <label className="login-label">Gender</label>
                    <select className="login-input" name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>

                    <label className="login-label">Email</label>
                    <input className="login-input" type="email" name="email" value={formData.email} onChange={handleChange} />

                    <label className="login-label">Contact No</label>
                    <input className="login-input" name="contactNo" value={formData.contactNo} onChange={handleChange} required />

                    <label className="login-label">Address</label>
                    <input className="login-input" name="address" value={formData.address} onChange={handleChange} />

                    {message && <p className="login-error">{message}</p>}

                    <button className="login-button" type="submit">Register Student</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterStudentPage;