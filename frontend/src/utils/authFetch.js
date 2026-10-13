export function getUser() {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
}

export function getToken() {
    const user = getUser();
    return user ? user.token : null;
}

// JSON requests: Content-Type + token
export function authHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

// Token only: for GET, FormData and URLSearchParams requests
export function bearer() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Reads the "exp" claim from the JWT payload
export function isTokenExpired(token) {
    try {
        const payload = JSON.parse(
            atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        );
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

export async function logout(navigate) {
    try {
        await fetch('http://localhost:8081/logout', {
            method: 'POST',
            headers: authHeaders(),
        });
    } catch (err) {
        // server unreachable: still clear the local session below
    }
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
}