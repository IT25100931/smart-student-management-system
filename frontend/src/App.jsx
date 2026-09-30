import { useEffect, useState } from "react";
import "./StudentPayments.css";

// Change these to match your Spring Boot controllers
const API = "http://localhost:8080/api";
const STUDENT_ID = "S001"; // replace with the logged-in student's id

const money = (n) =>
    Number(n ?? 0).toLocaleString("en-LK", { style: "currency", currency: "LKR" });

export default function StudentPayments() {
  const [fees, setFees] = useState([]);
  const [slips, setSlips] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [form, setForm] = useState({ paymentReference: "", amount: "", file: null });
  const [message, setMessage] = useState(null); // { type: "ok" | "error", text }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [feesRes, slipsRes] = await Promise.all([
        fetch(`${API}/fees/student/${STUDENT_ID}`),
        fetch(`${API}/payment-slips/student/${STUDENT_ID}`),
      ]);
      if (!feesRes.ok || !slipsRes.ok) throw new Error();
      setFees(await feesRes.json());
      setSlips(await slipsRes.json());
    } catch {
      setMessage({ type: "error", text: "Could not load your fees. Check that the server is running." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openForm = (fee) => {
    setSelectedFee(fee);
    setForm({ paymentReference: "", amount: fee.balance ?? "", file: null });
    setMessage(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) {
      setMessage({ type: "error", text: "Attach your payment slip before submitting." });
      return;
    }
    if (Number(form.amount) <= 0 || Number(form.amount) > Number(selectedFee.balance)) {
      setMessage({ type: "error", text: `Enter an amount between 1 and ${money(selectedFee.balance)}.` });
      return;
    }

    const data = new FormData();
    data.append("feeId", selectedFee.feeId);
    data.append("studentId", STUDENT_ID);
    data.append("paymentReference", form.paymentReference);
    data.append("amount", form.amount);
    data.append("slipFile", form.file);

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/payment-slips`, { method: "POST", body: data });
      if (!res.ok) throw new Error();
      setMessage({ type: "ok", text: "Slip submitted. It will show as pending until it is verified." });
      setSelectedFee(null);
      loadData();
    } catch {
      setMessage({ type: "error", text: "Submission failed. Try again in a moment." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="pay-empty">Loading your fees…</p>;

  return (
      <div className="pay-page">
        <h1>Fee payments</h1>

        {message && <div className={`pay-message ${message.type}`}>{message.text}</div>}

        <section>
          <h2>Your fees</h2>
          {fees.length === 0 ? (
              <p className="pay-empty">No fees have been assigned to you.</p>
          ) : (
              <div className="pay-table-wrap">
                <table className="pay-table">
                  <thead>
                  <tr>
                    <th>Fee</th>
                    <th>Due</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {fees.map((fee) => (
                      <tr key={fee.feeId}>
                        <td>{fee.feeType}</td>
                        <td>{fee.dueDate}</td>
                        <td>{money(fee.totalAmount)}</td>
                        <td>{money(fee.paidAmount)}</td>
                        <td>{money(fee.balance)}</td>
                        <td>
                          <span className={`badge ${fee.paymentStatus?.toLowerCase()}`}>{fee.paymentStatus}</span>
                        </td>
                        <td>
                          {fee.paymentStatus !== "PAID" && (
                              <button className="btn-secondary" onClick={() => openForm(fee)}>
                                Upload slip
                              </button>
                          )}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </section>

        {selectedFee && (
            <section className="pay-form-card">
              <h2>Upload slip for {selectedFee.feeType}</h2>
              <p className="pay-hint">Balance due: {money(selectedFee.balance)}</p>
              <form onSubmit={handleSubmit}>
                <label>
                  Payment reference
                  <input
                      name="paymentReference"
                      value={form.paymentReference}
                      onChange={handleChange}
                      required
                      placeholder="Bank reference number"
                  />
                </label>
                <label>
                  Amount paid (LKR)
                  <input
                      name="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={form.amount}
                      onChange={handleChange}
                      required
                  />
                </label>
                <label>
                  Payment slip (image or PDF)
                  <input name="file" type="file" accept="image/*,.pdf" onChange={handleChange} required />
                </label>
                <div className="pay-actions">
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? "Submitting…" : "Submit slip"}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setSelectedFee(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </section>
        )}

        <section>
          <h2>Submitted slips</h2>
          {slips.length === 0 ? (
              <p className="pay-empty">You haven't submitted any slips yet.</p>
          ) : (
              <div className="pay-table-wrap">
                <table className="pay-table">
                  <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Amount</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                  </thead>
                  <tbody>
                  {slips.map((s) => (
                      <tr key={s.slipId}>
                        <td>{s.paymentReference}</td>
                        <td>{money(s.amount)}</td>
                        <td>{s.submissionDate?.replace("T", " ").slice(0, 16)}</td>
                        <td>
                          <span className={`badge ${s.verificationStatus?.toLowerCase()}`}>{s.verificationStatus}</span>
                        </td>
                        <td>{s.remarks || "—"}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </section>
      </div>
  );
}
