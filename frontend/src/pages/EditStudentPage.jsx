import { useState, useRef } from 'react';
import { authHeaders } from '../utils/authFetch';
import './LoginPage.css';

const today = new Date().toISOString().split('T')[0];

function EditStudentPage() {
    const [searchId, setSearchId] = useState('');
    const [formData, setFormData] = useState(null);
    const [message, setMessage] = useState('');
    const dobRef = useRef(null);

    const handleSearch = async () => {
        setMessage('');
        setFormData(null);
        try {
            const response = await fetch(`http://localhost:8081/students/${searchId}`, {
                headers: authHeaders(),
            });
            if (response.ok) {
                const data = await response.json();
                data ? setFormData(data) : setMessage('Student not found.');
            } else if (response.status === 401) {
                setMessage('Session expired or not logged in. Please log in again.');
            } else {
                setMessage('Student not found.');
            }
        } catch (err) {
            setMessage('Could not connect to server.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8081/students/${formData.studentId}`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify(formData),
            });
            setMessage(response.ok ? 'Student updated successfully.' : 'Update failed.');
        } catch (err) {
            setMessage('Could not connect to server.');
        }
    };

    return (
        <div className="login-screen">
            <div className="login-panel-identity">
                <div className="login-identity-inner">
                    <p className="login-eyebrow">Student management system</p>
                    <h1 className="login-title">Edit Student</h1>
                    <div className="login-rule" />
                    <p className="login-subtext">Search a student by ID, then update their details.</p>
                </div>
            </div>

            <div className="login-panel-form">
                <div className="login-form">
                    <h2 className="login-form-heading">Edit Student Details</h2>

                    <label className="login-label">Student ID</label>
                    <input className="login-input" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="e.g. STU1001" />
                    <button className="login-button" type="button" onClick={handleSearch} style={{ marginTop: 12 }}>Search</button>

                    {message && <p className="login-error">{message}</p>}

                    {formData && (
                        <form onSubmit={handleUpdate}>
                            <div>
                                <label className="login-label">First Name</label>
                                <input className="login-input" name="firstName" value={formData.firstName || ''} onChange={handleChange} />
                            </div>

                            <div>
                                <label className="login-label">Last Name</label>
                                <input className="login-input" name="lastName" value={formData.lastName || ''} onChange={handleChange} />
                            </div>

                            <div>
                                <label className="login-label">Date of Birth</label>
                                <input
                                    ref={dobRef}
                                    className="login-input"
                                    type="date"
                                    name="dob"
                                    max={today}
                                    value={formData.dob || ''}
                                    onChange={handleChange}
                                    onClick={() => dobRef.current.showPicker()}
                                />
                            </div>

                            <div>
                                <label className="login-label">Gender</label>
                                <select className="login-input" name="gender" value={formData.gender || ''} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                            </div>

                            <div>
                                <label className="login-label">Email</label>
                                <input className="login-input" name="email" value={formData.email || ''} onChange={handleChange} />
                            </div>

                            <div>
                                <label className="login-label">Contact No</label>
                                <input className="login-input" name="contactNo" value={formData.contactNo || ''} onChange={handleChange} />
                            </div>

                            <div>
                                <label className="login-label">Address</label>
                                <input className="login-input" name="address" value={formData.address || ''} onChange={handleChange} />
                            </div>

                            <button className="login-button" type="submit" style={{ marginTop: 20 }}>Save Changes</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditStudentPage;