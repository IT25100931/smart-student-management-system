import { Link } from 'react-router-dom';
import { getUser } from '../utils/authFetch';
import './LoginPage.css';

function NotFoundPage() {
    const loggedIn = !!getUser();

    return (
        <div className="login-screen">
            <div className="login-panel-form">
                <div className="login-form">
                    <h2 className="login-form-heading">Page not found</h2>
                    <p className="login-label">
                        The page you are looking for doesn't exist.
                    </p>
                    <Link
                        to={loggedIn ? '/services' : '/'}
                        className="login-forgot"
                        style={{ textAlign: 'left' }}
                    >
                        {loggedIn ? 'Back to services' : 'Back to login'}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;