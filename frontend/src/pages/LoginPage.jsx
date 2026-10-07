import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8081/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data));
                if (data.role === 'ADMIN') navigate('/admin-dashboard');
                else if (data.role === 'TEACHER') navigate('/teacher-dashboard');
                else if (data.role === 'PARENT') navigate('/parent-dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Could not connect to server');
        }
    };

    return (
        <div className="login-screen">
            <div className="login-panel-identity">
                <div className="login-identity-inner">
                    <p className="login-eyebrow">Student management system</p>
                    <h1 className="login-title">Welcome back</h1>
                    <div className="login-rule" />
                    <p className="login-subtext">
                        Sign in to manage student records, attendance, and school operations.
                    </p>
                </div>
            </div>

            <div className="login-panel-form">
                <form className="login-form" onSubmit={handleLogin}>
                    <h2 className="login-form-heading">Log in</h2>

                    <label className="login-label" htmlFor="username">Username</label>
                    <input
                        id="username"
                        className="login-input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        required
                    />

                    <label className="login-label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        className="login-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    {error && <p className="login-error">{error}</p>}

                    <button className="login-button" type="submit">Log in</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;