import { useState, useEffect } from 'react';

export const BASE = 'http://localhost:8081';
export const API = BASE + '/api/payments';
export const STUDENTS_API = BASE + '/students';

export const rs = (n) => 'Rs. ' + Number(n || 0).toLocaleString();
export const when = (d) => (d ? String(d).replace('T', ' ').slice(0, 16) : '-');
export const fileName = (p) => String(p || '').split(/[\\/]/).pop();

export const normalizeStudent = (s) => ({
    id: String(s.id ?? s.studentId ?? s.student_id ?? ''),
    name: s.name ?? s.fullName ?? ([s.firstName, s.lastName].filter(Boolean).join(' ') || 'Student'),
    grade: s.grade ?? s.className ?? s.classGrade ?? '',
});

export const getJson = async (url) => {
    const token = localStorage.getItem('token');
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) throw new Error(`HTTP ${r.status} from ${url}`);
    return r.json();
};

// Balance is always total - paid, so it works even if the DB column is empty
export const bal = (f) => Math.max(Number(f.totalAmount || 0) - Number(f.paidAmount || 0), 0);

export const totals = (fees) => {
    const total = fees.reduce((s, f) => s + Number(f.totalAmount || 0), 0);
    const paid = fees.reduce((s, f) => s + Number(f.paidAmount || 0), 0);
    const due = fees.reduce((s, f) => s + bal(f), 0);
    const status = total > 0 && due <= 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
    return { total, paid, due, status, pct: total ? Math.min(100, Math.round((paid / total) * 100)) : 0 };
};

export function Badge({ s }) {
    const v = String(s || 'unknown').toLowerCase();
    return <span className={`badge ${v}`}>{v[0].toUpperCase() + v.slice(1)}</span>;
}

// Loads students + their fees + slips. Used by both the parent page and the admin review.
export function usePaymentData() {
    const [students, setStudents] = useState([]);
    const [fees, setFees] = useState({});
    const [slips, setSlips] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const reload = async () => {
        try {
            const raw = await getJson(STUDENTS_API);
            const list = (Array.isArray(raw) ? raw : raw.content || []).map(normalizeStudent);
            const rows = await Promise.all(list.map(async (s) => [
                s.id,
                await getJson(`${API}/fees/${s.id}`),
                await getJson(`${API}/slips/${s.id}`),
            ]));
            setStudents(list);
            setFees(Object.fromEntries(rows.map(([id, f]) => [id, f])));
            setSlips(Object.fromEntries(rows.map(([id, , sl]) => [id, sl])));
            setError(null);
        } catch (err) {
            setError(err.message + ' (is the backend running on port 8081 and CORS allowed?)');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { reload(); }, []);

    return { students, fees, slips, error, loading, reload };
}