import { Navigate } from 'react-router-dom';
import { getUser, isTokenExpired } from '../utils/authFetch';

function ProtectedRoute({ children, allowedRoles }) {
    const user = getUser();

    // Not logged in, or token has expired: back to login
    if (!user || !user.token || isTokenExpired(user.token)) {
        return <Navigate to="/" replace />;
    }

    // Logged in, but this role isn't allowed on this page
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <div style={{ padding: 48, fontFamily: 'Inter, sans-serif', color: '#1C2B3A' }}>
                <h2>Access denied</h2>
                <p>Your account ({user.role}) doesn't have permission to view this page.</p>
            </div>
        );
    }

    return children;
}

export default ProtectedRoute;