import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ALLERGIES = ['Penicillin', 'Latex', 'Local Anesthesia', 'Aspirin/NSAIDs', 'None known'];
const CONDITIONS = ['Diabetes', 'Hypertension', 'Heart Disease', 'Pregnancy', 'Asthma', 'None'];
const PAST_TREATMENTS = ['Root Canal', 'Extraction', 'Braces / Ortho', 'Crown / Bridge', 'Implants', 'Whitening'];

export default function MedicalHistoryMock() {
  const { id } = useParams();
  const [allergies, setAllergies] = useState<string[]>(['Penicillin']);
  const [conditions, setConditions] = useState<string[]>([]);
  const [treatments, setTreatments] = useState<string[]>(['Root Canal']);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  return (
    <div>
      <div className="page-header">
        <h2>Medical & Dental History — Kiran Mehta</h2>
        <Link to={`/patients/${id}`} className="button">
          ← Back to patient
        </Link>
      </div>
      <p className="mock-badge">PROTOTYPE — UI mockup, not wired to a backend</p>

      <div className="mock-grid">
        <section className="mock-card">
          <h3>Allergies</h3>
          <div className="chip-group">
            {ALLERGIES.map((a) => (
              <label key={a} className={`chip ${allergies.includes(a) ? 'chip-on' : ''}`}>
                <input type="checkbox" checked={allergies.includes(a)} onChange={() => toggle(allergies, setAllergies, a)} />
                {a}
              </label>
            ))}
          </div>
        </section>

        <section className="mock-card">
          <h3>Chronic Conditions</h3>
          <div className="chip-group">
            {CONDITIONS.map((c) => (
              <label key={c} className={`chip ${conditions.includes(c) ? 'chip-on' : ''}`}>
                <input type="checkbox" checked={conditions.includes(c)} onChange={() => toggle(conditions, setConditions, c)} />
                {c}
              </label>
            ))}
          </div>
        </section>

        <section className="mock-card">
          <h3>Current Medications</h3>
          <textarea rows={3} defaultValue="Metformin 500mg — twice daily" placeholder="List current medications" />
        </section>

        <section className="mock-card">
          <h3>Past Surgeries</h3>
          <textarea rows={3} placeholder="Any past surgeries or hospitalizations" />
        </section>

        <section className="mock-card">
          <h3>Dental History</h3>
          <label>
            Previous dentist / clinic
            <input defaultValue="Smile Care Dental, Pune" />
          </label>
          <label>
            Last cleaning / check-up
            <input type="date" defaultValue="2026-02-14" />
          </label>
          <div className="chip-group" style={{ marginTop: '0.5rem' }}>
            {PAST_TREATMENTS.map((t) => (
              <label key={t} className={`chip ${treatments.includes(t) ? 'chip-on' : ''}`}>
                <input type="checkbox" checked={treatments.includes(t)} onChange={() => toggle(treatments, setTreatments, t)} />
                {t}
              </label>
            ))}
          </div>
        </section>

        <section className="mock-card">
          <h3>Consent</h3>
          <p className="consent-badge">✓ Consent on file — captured 24 Aug 2026</p>
          <label className="checkbox">
            <input type="checkbox" defaultChecked />
            Patient consents to storage of this medical history
          </label>
        </section>
      </div>

      <button type="button" className="mock-save">
        Save History (mockup — not connected)
      </button>
    </div>
  );
}
