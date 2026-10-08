export function getToken() {
    const user = localStorage.getItem('user');
    if (!user) return null;
    return JSON.parse(user).token;
}

export function authHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

export function logout(navigate) {
    localStorage.removeItem('user');
    navigate('/');
}