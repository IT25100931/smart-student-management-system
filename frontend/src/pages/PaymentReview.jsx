import { useState } from 'react';
import './PaymentPage.css';
import { API, rs, when, fileName, totals, Badge, usePaymentData } from './PaymentShared';

const ADMIN_ID = 'STAFF001'; // TODO: replace with the logged-in admin's staff id (must exist if verified_by has a foreign key)

export default function PaymentReview() {
    const { students, fees, slips, error, loading, reload } = usePaymentData();
    const [filter, setFilter] = useState('ALL');
    const [msg, setMsg] = useState(null);

    if (loading) return <div className="pay-app pay-embedded"><div className="page"><p className="empty">Loading…</p></div></div>;
    if (error) return <div className="pay-app pay-embedded"><div className="page"><div className="toast err">Could not load data: {error}</div></div></div>;

    const name = (id) => students.find((s) => s.id === id)?.name || id;
    const allSlips = Object.values(slips).flat().sort((a, b) => String(b.submissionDate).localeCompare(String(a.submissionDate)));
    const pending = allSlips.filter((p) => p.verificationStatus === 'PENDING');
    const shown = filter === 'ALL' ? allSlips : allSlips.filter((p) => p.verificationStatus === filter);
    const t = totals(Object.values(fees).flat());

    const decide = async (slip, status) => {
        let remarks = 'Verified';
        if (status === 'REJECTED') {
            remarks = window.prompt('Reason for rejecting this slip?');
            if (remarks === null) return;
        }
        const token = localStorage.getItem('token');
        const body = new URLSearchParams({ slipId: slip.slipId, feeId: slip.feeId, amount: slip.amount, status, staffId: ADMIN_ID, remarks });
        try {
            const res = await fetch(`${API}/verify`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/x-www-form-urlencoded' },
                body,
            });
            if (!res.ok) throw new Error(await res.text());
            await reload();
            setMsg({ t: 'ok', m: `Slip ${slip.paymentReference} ${status.toLowerCase()}.` });
        } catch (err) {
            setMsg({ t: 'err', m: 'Could not update the slip: ' + err.message });
        }
    };

    return (
        <div className="pay-app pay-embedded">
            <div className="page">
                <div className="page-head"><div><h1>Payment review</h1><p>Check submitted slips and confirm them into the school records.</p></div></div>
                {msg && <div className={`toast ${msg.t}`} role="status">{msg.m}</div>}

                <div className="stats">
                    <div className="stat red"><small>Waiting for review</small><strong>{pending.length}</strong></div>
                    <div className="stat dark"><small>Collected</small><strong>{rs(t.paid)}</strong></div>
                    <div className="stat"><small>Outstanding</small><strong>{rs(t.due)}</strong></div>
                </div>

                <div className="panel">
                    <h2>Slips to review</h2>
                    {pending.length === 0 ? <p className="empty">All caught up. No slips are waiting.</p> : (
                        <div className="table-wrap"><table>
                            <thead><tr><th>Student</th><th>Reference</th><th>Amount</th><th>Submitted</th><th>Slip</th><th>Decision</th></tr></thead>
                            <tbody>{pending.map((p) => (
                                <tr key={p.slipId}>
                                    <td>{name(p.studentId)}</td><td>{p.paymentReference}</td><td>{rs(p.amount)}</td><td>{when(p.submissionDate)}</td>
                                    <td><a href={`${API}/slip-file?name=${encodeURIComponent(fileName(p.slipFilePath))}`} target="_blank" rel="noreferrer">View slip</a></td>
                                    <td className="row-actions">
                                        <button className="btn btn-green btn-sm" onClick={() => decide(p, 'APPROVED')}>Approve</button>
                                        <button className="btn btn-white btn-sm" onClick={() => decide(p, 'REJECTED')}>Reject</button>
                                    </td>
                                </tr>
                            ))}</tbody>
                        </table></div>
                    )}
                </div>

                <div className="panel">
                    <div className="split">
                        <h2>All payment records</h2>
                        <select className="head-select" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
                            <option value="ALL">All</option><option value="APPROVED">Approved</option>
                            <option value="PENDING">Pending</option><option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                    <div className="table-wrap"><table>
                        <thead><tr><th>Student</th><th>Submitted</th><th>Reference</th><th>Amount</th><th>Status</th><th>Remarks</th></tr></thead>
                        <tbody>{shown.map((p) => (
                            <tr key={p.slipId}><td>{name(p.studentId)}</td><td>{when(p.submissionDate)}</td><td>{p.paymentReference}</td><td>{rs(p.amount)}</td><td><Badge s={p.verificationStatus} /></td><td>{p.remarks || '-'}</td></tr>
                        ))}</tbody>
                    </table></div>
                </div>
            </div>
        </div>
    );
}