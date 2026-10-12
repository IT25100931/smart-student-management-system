import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/authFetch';
import './TopBar.css';

function TopBar() {
    const navigate = useNavigate();
    const user = getUser();

    if (!user) return null;

    return (
        <div className="topbar">
            <span className="topbar-user">{user.username} · {user.role}</span>
            <button className="topbar-logout" onClick={() => logout(navigate)}>
                Log out
            </button>
        </div>
    );
}

export default TopBar;