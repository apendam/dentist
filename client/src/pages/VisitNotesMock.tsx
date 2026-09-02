import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Visit {
  date: string;
  dentist: string;
  procedure: string;
  tooth: string;
  notes: string;
}

const SEED_VISITS: Visit[] = [
  { date: '2026-08-24', dentist: 'Dr. Rohan Iyer', procedure: 'Routine Checkup + Cleaning', tooth: '—', notes: 'No caries found. Mild plaque buildup, scaling done. Recall in 6 months.' },
  { date: '2026-03-10', dentist: 'Dr. Rohan Iyer', procedure: 'Root Canal Treatment', tooth: '36', notes: 'RCT completed in 2 sittings. Temporary filling placed, crown pending.' },
  { date: '2026-03-02', dentist: 'Dr. Anjali Verma', procedure: 'Consultation', tooth: '36', notes: 'Patient reported sensitivity to cold. X-ray taken, deep caries diagnosed. RCT recommended.' },
];

export default function VisitNotesMock() {
  const { id } = useParams();
  const [visits, setVisits] = useState<Visit[]>(SEED_VISITS);
  const [form, setForm] = useState({ dentist: 'Dr. Rohan Iyer', procedure: '', tooth: '', notes: '' });

  function addVisit() {
    if (!form.procedure) return;
    setVisits([{ date: new Date().toISOString().slice(0, 10), ...form }, ...visits]);
    setForm({ dentist: 'Dr. Rohan Iyer', procedure: '', tooth: '', notes: '' });
  }

  return (
    <div>
      <div className="page-header">
        <h2>Visit Notes — Kiran Mehta</h2>
        <Link to={`/patients/${id}`} className="button">
          ← Back to patient
        </Link>
      </div>
      <p className="mock-badge">PROTOTYPE — UI mockup, not wired to a backend</p>

      <div className="mock-grid">
        <section className="mock-card" style={{ gridColumn: '1 / -1' }}>
          <h3>Add Visit Note</h3>
          <div className="visit-form-row">
            <label>
              Dentist
              <select value={form.dentist} onChange={(e) => setForm({ ...form, dentist: e.target.value })}>
                <option>Dr. Rohan Iyer</option>
                <option>Dr. Anjali Verma</option>
              </select>
            </label>
            <label>
              Tooth # (optional)
              <input value={form.tooth} onChange={(e) => setForm({ ...form, tooth: e.target.value })} placeholder="e.g. 36" />
            </label>
            <label style={{ flex: 1 }}>
              Procedure / Reason
              <input value={form.procedure} onChange={(e) => setForm({ ...form, procedure: e.target.value })} placeholder="e.g. Filling, Cleaning" />
            </label>
          </div>
          <label>
            Notes
            <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>
          <button type="button" className="mock-save" onClick={addVisit}>
            Add Note (mockup — not saved)
          </button>
        </section>
      </div>

      <h3 style={{ marginTop: '1.5rem' }}>History</h3>
      <div className="timeline">
        {visits.map((v, i) => (
          <div className="timeline-item" key={i}>
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-head">
                <strong>{v.procedure}</strong>
                <span className="timeline-date">{v.date}</span>
              </div>
              <div className="timeline-meta">
                {v.dentist} {v.tooth !== '—' && `· Tooth #${v.tooth}`}
              </div>
              <p>{v.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
