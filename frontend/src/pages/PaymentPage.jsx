import { useState } from 'react';
import './PaymentPage.css';
import { API, rs, when, bal, totals, Badge, usePaymentData } from './PaymentShared';

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
    const formEl = e.target;
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
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/submit-slip`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text());
      await reload();
      setForm({ feeId: '', amount: '', reference: '', file: null });
      formEl.reset();
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

export default function PaymentPage() {
  const data = usePaymentData();
  return (
      <div className="pay-app">
        <header className="topbar">
          <div className="brand">School<span>Pay</span></div>
          <div className="who"><span>Parent</span></div>
        </header>
        {data.loading && <div className="page"><p className="empty">Loading…</p></div>}
        {!data.loading && data.error && <div className="page"><div className="toast err">Could not load data: {data.error}</div></div>}
        {!data.loading && !data.error && <ParentPage {...data} />}
      </div>
  );
}