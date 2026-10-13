import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/authFetch';
import './AccountMenu.css';

function AccountMenu() {
    const navigate = useNavigate();
    const user = getUser();
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    // Close on outside click or Escape
    useEffect(() => {
        if (!open) return;
        const onClickOutside = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    if (!user) return null;

    return (
        <div className="am-wrap" ref={wrapRef}>
            <button
                type="button"
                className="am-pill"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
            >
                <span className="am-dot" />
                {user.role} Console
                <span className={`am-caret${open ? ' open' : ''}`} aria-hidden="true" />
            </button>

            {open && (
                <div className="am-menu" role="menu">
                    <div className="am-menu-header">
                        Signed in as <strong>{user.username}</strong>
                    </div>
                    <button
                        type="button"
                        role="menuitem"
                        className="am-item"
                        onClick={() => { setOpen(false); navigate('/account'); }}
                    >
                        Edit details
                    </button>
                    <button
                        type="button"
                        role="menuitem"
                        className="am-item am-item-danger"
                        onClick={() => { setOpen(false); logout(navigate); }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default AccountMenu;