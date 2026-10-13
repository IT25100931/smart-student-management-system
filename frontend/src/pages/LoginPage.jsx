import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function EyeIcon({ name, size = 18 }) {
    const props = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
    };

    if (name === 'eye') {
        return (
            <svg {...props}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        );
    } else {
        return (
            <svg {...props}>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
        );
    }
}

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

            if (data.success && (data.token || data.accessToken)) {
                const token = data.token || data.accessToken;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(data));
                navigate('/dashboard');
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
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                            id="password"
                            className="login-input"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            style={{ paddingRight: '45px', width: '100%' }}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#666',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '4px'
                            }}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            <EyeIcon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                        </button>
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button className="login-button" type="submit" style={{ marginTop: '20px' }}>Log in</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;