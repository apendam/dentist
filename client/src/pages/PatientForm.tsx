import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function PatientForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    medicalHistory: '',
    consentGiven: false,
  });
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await api.post('/patients', form);
      navigate(`/patients/${data.id}`);
    } catch {
      setError('Could not save patient. Check the fields and try again.');
    }
  }

  return (
    <div>
      <h2>New patient</h2>
      <form onSubmit={handleSubmit} className="patient-form">
        {error && <p className="error">{error}</p>}
        <label>
          First name
          <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required />
        </label>
        <label>
          Last name
          <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </label>
        <label>
          Address
          <input value={form.address} onChange={(e) => update('address', e.target.value)} />
        </label>
        <label>
          Emergency contact name
          <input
            value={form.emergencyContactName}
            onChange={(e) => update('emergencyContactName', e.target.value)}
          />
        </label>
        <label>
          Emergency contact phone
          <input
            value={form.emergencyContactPhone}
            onChange={(e) => update('emergencyContactPhone', e.target.value)}
          />
        </label>
        <label>
          Medical history (allergies, conditions, medications)
          <textarea
            value={form.medicalHistory}
            onChange={(e) => update('medicalHistory', e.target.value)}
            rows={4}
          />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.consentGiven}
            onChange={(e) => update('consentGiven', e.target.checked)}
          />
          Patient has consented to data storage and treatment
        </label>
        <button type="submit">Save patient</button>
      </form>
    </div>
  );
}
