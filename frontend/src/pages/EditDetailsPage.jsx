import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authHeaders, bearer } from '../utils/authFetch';
import './EditDetailsPage.css';

const API = 'http://localhost:8081/api/users/me';

function EditDetailsPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loadError, setLoadError] = useState('');

    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [detailsMsg, setDetailsMsg] = useState(null);
    const [savingDetails, setSavingDetails] = useState(false);

    const [pw, setPw] = useState({ current: '', next: '', repeat: '' });
    const [pwMsg, setPwMsg] = useState(null);
    const [savingPw, setSavingPw] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(API, { headers: bearer() });
                if (res.status === 401) {
                    localStorage.removeItem('user');
                    navigate('/login', { replace: true });
                    return;
                }
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const data = await res.json();
                setProfile(data);
                setEmail(data.email);
            } catch {
                setLoadError('Could not load your details.');
            }
        })();
    }, [navigate]);

    const saveDetails = async (e) => {
        e.preventDefault();
        setDetailsMsg(null);
        setSavingDetails(true);
        try {
            const res = await fetch(API, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({ email, currentPassword: confirmPassword }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setProfile({ ...profile, email: data.email });
                setConfirmPassword('');
                setDetailsMsg({ t: 'ok', m: 'Details updated successfully.' });
            } else if (res.status === 401) {
                setDetailsMsg({ t: 'err', m: 'Your session has expired. Please log in again.' });
            } else {
                setDetailsMsg({ t: 'err', m: data.message || 'Could not update your details.' });
            }
        } catch {
            setDetailsMsg({ t: 'err', m: 'Could not connect to the server.' });
        } finally {
            setSavingDetails(false);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setPwMsg(null);
        if (pw.next !== pw.repeat) {
            setPwMsg({ t: 'err', m: 'The new passwords do not match.' });
            return;
        }
        setSavingPw(true);
        try {
            const res = await fetch(`${API}/password`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setPwMsg({ t: 'ok', m: 'Password changed. Signing you out...' });
                // The server has ended this session; sign in again with the new password
                setTimeout(() => {
                    localStorage.removeItem('user');
                    navigate('/login', { replace: true });
                }, 1500);
            } else if (res.status === 401) {
                setPwMsg({ t: 'err', m: 'Your session has expired. Please log in again.' });
            } else {
                setPwMsg({ t: 'err', m: data.message || 'Could not change your password.' });
            }
        } catch {
            setPwMsg({ t: 'err', m: 'Could not connect to the server.' });
        } finally {
            setSavingPw(false);
        }
    };

    if (loadError) return <div className="ed-page"><p className="ed-msg err">{loadError}</p></div>;
    if (!profile) return <div className="ed-page"><p className="ed-muted">Loading...</p></div>;

    return (
        <div className="ed-page">
            <button type="button" className="ed-back" onClick={() => navigate(-1)}>&larr; Back</button>

            <div className="ed-card">
                <h2>Account details</h2>
                <p className="ed-muted">Update the email linked to your account.</p>

                <form onSubmit={saveDetails}>
                    <label>Username</label>
                    <input value={profile.username} disabled />

                    <label>Role</label>
                    <input value={profile.role} disabled />

                    <label htmlFor="ed-email">Email address</label>
                    <input id="ed-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <label htmlFor="ed-confirm">Current password</label>
                    <input id="ed-confirm" type="password" value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)} required
                           placeholder="Required to save changes" autoComplete="current-password" />

                    {detailsMsg && <p className={`ed-msg ${detailsMsg.t}`} role="status">{detailsMsg.m}</p>}
                    <button type="submit" disabled={savingDetails}>{savingDetails ? 'Saving...' : 'Save changes'}</button>
                </form>
            </div>

            <div className="ed-card">
                <h2>Change password</h2>
                <p className="ed-muted">At least 8 characters, with a letter and a number. You will be signed out afterwards.</p>

                <form onSubmit={changePassword}>
                    <label htmlFor="ed-cur">Current password</label>
                    <input id="ed-cur" type="password" value={pw.current}
                           onChange={(e) => setPw({ ...pw, current: e.target.value })} required autoComplete="current-password" />

                    <label htmlFor="ed-new">New password</label>
                    <input id="ed-new" type="password" value={pw.next}
                           onChange={(e) => setPw({ ...pw, next: e.target.value })} required autoComplete="new-password" />

                    <label htmlFor="ed-rep">Confirm new password</label>
                    <input id="ed-rep" type="password" value={pw.repeat}
                           onChange={(e) => setPw({ ...pw, repeat: e.target.value })} required autoComplete="new-password" />

                    {pwMsg && <p className={`ed-msg ${pwMsg.t}`} role="status">{pwMsg.m}</p>}
                    <button type="submit" disabled={savingPw}>{savingPw ? 'Changing...' : 'Change password'}</button>
                </form>
            </div>
        </div>
    );
}

export default EditDetailsPage;