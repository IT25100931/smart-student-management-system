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

export function authHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

// Reads the "exp" claim from the JWT payload (it's only encoded, not encrypted)
export function isTokenExpired(token) {
    try {
        const payload = JSON.parse(
            atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        );
        return payload.exp * 1000 < Date.now();
    } catch {
        return true; // unreadable token: treat as expired
    }
}

export async function logout(navigate) {
    try {
        // Ask the server to revoke the token so it can't be reused
        await fetch('http://localhost:8081/logout', {
            method: 'POST',
            headers: authHeaders(),
        });
    } catch (err) {
        // Server unreachable: still log out locally below
    }
    localStorage.removeItem('user');
    navigate('/', { replace: true });
}