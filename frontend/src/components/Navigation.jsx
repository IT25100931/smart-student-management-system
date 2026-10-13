import { useNavigate, useLocation } from 'react-router-dom';

function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide navigation bar on the login screen
    if (location.pathname === '/') {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
            <button
                onClick={() => navigate('/services')}
                style={{ padding: '6px 12px', cursor: 'pointer', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }}
            >
                Dashboard / Services
            </button>
            <button
                onClick={handleLogout}
                style={{ padding: '6px 12px', cursor: 'pointer', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
                Logout
            </button>
        </nav>
    );
}

export default Navigation;