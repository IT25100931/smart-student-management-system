import { useState, useEffect } from 'react';
import '../../../../../Downloads/PaymentPage.css';

const BASE = 'http://localhost:8081';
const API = BASE + '/api/payments';
const STUDENTS_API = BASE + '/students';
const ADMIN_ID = 'STAFF001'; // TODO: replace with the logged-in admin's staff id (must exist if verified_by has a foreign key)

const rs = (n) => 'Rs. ' + Number(n || 0).toLocaleString();
const when = (d) => (d ? String(d).replace('T', ' ').slice(0, 16) : '-');
const fileName = (p) => String(p || '').split(/[\\/]/).pop();
const normalizeStudent = (s) => ({
  id: String(s.id ?? s.studentId ?? s.student_id ?? ''),
  name: s.name ?? s.fullName ?? ([s.firstName, s.lastName].filter(Boolean).join(' ') || 'Student'),
  grade: s.grade ?? s.className ?? s.classGrade ?? '',
});
const getJson = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} from ${url}`);
  return r.json();
};
// Always work out the balance as total - paid, so it works even if the database column is empty
const bal = (f) => Math.max(Number(f.totalAmount || 0) - Number(f.paidAmount || 0), 0);
const totals = (fees) => {
  const total = fees.reduce((s, f) => s + Number(f.totalAmount || 0), 0);
  const paid = fees.reduce((s, f) => s + Number(f.paidAmount || 0), 0);
  const due = fees.reduce((s, f) => s + bal(f), 0);
  const status = total > 0 && due <= 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
  return { total, paid, due, status, pct: total ? Math.min(100, Math.round((paid / total) * 100)) : 0 };
};

function Badge({ s }) {
  const v = String(s || 'unknown').toLowerCase();
  return <span className={`badge ${v}`}>{v[0].toUpperCase() + v.slice(1)}</span>;
}

function Landing({ onPick }) {
  return (
    <div className="landing">
      <div className="landing-inner">
        <h1>School fees,<br /><em>without the paperwork.</em></h1>
        <p>Submit payment slips, track what is paid and what is due, and let the school office confirm everything in one place.</p>
        <div className="roles">
          <div className="role-card parent">
            <h2>Parent</h2>
            <p>Upload payment slips and check your child's payment status.</p>
            <button className="btn btn-black" onClick={() => onPick('parent')}>Open parent page</button>
          </div>
          <div className="role-card admin">
            <h2>Administrator</h2>
            <p>Review submitted slips, approve them and manage records.</p>
            <button className="btn btn-red" onClick={() => onPick('admin')}>Open admin page</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParentPage({ students, fees, slips, reload }) {
  const [picked, setPicked] = useState(null);
  const [form, setForm] = useState({ feeId: '', amount: '', reference: '', file: null });
  const [msg, setMsg] = useState(null);
  const student = students.find((s) => s.id === picked) || students[0];
  if (!student) return <div className="page"><p className="empty">No students found.</p></div>;

  const myFees = fees[student.id] || [];
  const mySlips = slips[student.id] || [];
  const sum = totals(myFees);
  const payable = myFees.filter((f) => bal(f) > 0);
  const feeId = form.feeId || (payable[0] && String(payable[0].feeId)) || '';
  const set = (k) => (e) => setForm({ ...form, [k]: k === 'file' ? e.target.files[0] : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const fee = myFees.find((f) => String(f.feeId) === feeId);
    const amount = Number(form.amount);
    if (!fee) return setMsg({ t: 'err', m: 'There is no unpaid fee to pay.' });
    if (!amount || amount <= 0) return setMsg({ t: 'err', m: 'Enter an amount greater than zero.' });
    if (amount > bal(fee)) return setMsg({ t: 'err', m: `The amount is more than the balance of ${rs(bal(fee))}.` });
    if (!form.file) return setMsg({ t: 'err', m: 'Attach your payment slip (image or PDF).' });
    const fd = new FormData();
    fd.append('feeId', feeId);
    fd.append('studentId', student.id);
    fd.append('amount', amount);
    fd.append('reference', form.reference);
    fd.append('file', form.file);
    try {
      const res = await fetch(`${API}/submit-slip`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      await reload();
      setForm({ feeId: '', amount: '', reference: '', file: null });
      e.target.reset();
      setMsg({ t: 'ok', m: 'Slip submitted. The office will review it soon.' });
    } catch (err) {
      setMsg({ t: 'err', m: 'Could not save the slip: ' + err.message });
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div><h1>Payment status</h1><p>{student.name} · {student.grade}</p></div>
        <select className="head-select" value={student.id} onChange={(e) => setPicked(e.target.value)} aria-label="Select child">
          {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="stats">
        <div className="stat dark"><small>Total fees</small><strong>{rs(sum.total)}</strong></div>
        <div className="stat"><small>Paid so far</small><strong>{rs(sum.paid)}</strong></div>
        <div className="stat red"><small>Due amount</small><strong>{rs(sum.due)}</strong></div>
      </div>

      <div className="panel">
        <div className="split"><h2>Status</h2><Badge s={sum.status} /></div>
        <div className="progress"><div style={{ width: sum.pct + '%' }} /></div>
        <small>{sum.pct}% of the fees confirmed</small>
      </div>

      <div className="panel">
        <h2>Your fees</h2>
        {myFees.length === 0 ? <p className="empty">No fees have been set for this student.</p> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Fee</th><th>Due date</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th></tr></thead>
            <tbody>{myFees.map((f) => (
              <tr key={f.feeId}><td>{f.feeType}</td><td>{f.dueDate}</td><td>{rs(f.totalAmount)}</td><td>{rs(f.paidAmount)}</td><td>{rs(bal(f))}</td><td><Badge s={f.paymentStatus} /></td></tr>
            ))}</tbody>
          </table></div>
        )}
      </div>

      <div className="panel">
        <h2>Submit a payment slip</h2>
        {msg && <div className={`toast ${msg.t}`} role="status">{msg.m}</div>}
        <form className="form" onSubmit={submit}>
          <label className="full">Which fee are you paying?
            <select value={feeId} onChange={set('feeId')} disabled={!payable.length}>
              {payable.length === 0 && <option value="">No unpaid fees for this student</option>}
              {payable.map((f) => <option key={f.feeId} value={f.feeId}>{f.feeType} (balance {rs(bal(f))})</option>)}
            </select>
          </label>
          <label>Amount paid (Rs.)<input type="number" step="0.01" value={form.amount} onChange={set('amount')} required /></label>
          <label>Bank reference number<input value={form.reference} onChange={set('reference')} required /></label>
          <label className="full">Payment slip<input type="file" accept="image/*,.pdf" onChange={set('file')} /></label>
          <div className="full"><button className="btn btn-red" disabled={!payable.length}>Submit slip</button></div>
        </form>
      </div>

      <div className="panel">
        <h2>Submitted slips</h2>
        {mySlips.length === 0 ? <p className="empty">No slips yet. Submit your first one above.</p> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Reference</th><th>Amount</th><th>Submitted</th><th>Status</th><th>Remarks</th></tr></thead>
            <tbody>{mySlips.map((p) => (
              <tr key={p.slipId}><td>{p.paymentReference}</td><td>{rs(p.amount)}</td><td>{when(p.submissionDate)}</td><td><Badge s={p.verificationStatus} /></td><td>{p.remarks || '-'}</td></tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}

function AdminPage({ students, fees, slips, reload }) {
  const [filter, setFilter] = useState('ALL');
  const [msg, setMsg] = useState(null);
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
    const body = new URLSearchParams({ slipId: slip.slipId, feeId: slip.feeId, amount: slip.amount, status, staffId: ADMIN_ID, remarks });
    try {
      const res = await fetch(`${API}/verify`, { method: 'POST', body });
      if (!res.ok) throw new Error(await res.text());
      await reload();
      setMsg({ t: 'ok', m: `Slip ${slip.paymentReference} ${status.toLowerCase()}.` });
    } catch (err) {
      setMsg({ t: 'err', m: 'Could not update the slip: ' + err.message });
    }
  };

  return (
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
  );
}

export default function PaymentPage() {
  const [role, setRole] = useState(null);
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

  const props = { students, fees, slips, reload };
  return (
    <div className="pay-app">
      <header className="topbar">
        <div className="brand" onClick={() => setRole(null)}>School<span>Pay</span></div>
        {role && (
          <div className="who">
            <span>{role === 'admin' ? 'Administrator' : 'Parent'}</span>
            <button className="btn btn-red btn-sm" onClick={() => setRole(null)}>Switch role</button>
          </div>
        )}
      </header>
      {!role && <Landing onPick={setRole} />}
      {role && loading && <div className="page"><p className="empty">Loading…</p></div>}
      {role && !loading && error && <div className="page"><div className="toast err">Could not load data: {error}</div></div>}
      {role === 'parent' && !loading && !error && <ParentPage {...props} />}
      {role === 'admin' && !loading && !error && <AdminPage {...props} />}
    </div>
  );
}
