import { FormEvent, useState } from 'react';
import { api } from '../api/client';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Staff() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'DENTIST' });
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<StaffMember[]>([]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await api.post('/staff', form);
      setCreated((prev) => [...prev, data]);
      setForm({ name: '', email: '', password: '', role: 'DENTIST' });
    } catch {
      setError('Could not create staff member. Only admins can add staff.');
    }
  }

  return (
    <div>
      <h2>Staff</h2>
      <form onSubmit={handleSubmit} className="patient-form">
        {error && <p className="error">{error}</p>}
        <label>
          Name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          Temporary password
          <input
            type="password"
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <label>
          Role
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="DENTIST">Dentist</option>
            <option value="FRONT_DESK">Front desk</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
        <button type="submit">Add staff member</button>
      </form>
      <ul>
        {created.map((s) => (
          <li key={s.id}>
            {s.name} ({s.role})
          </li>
        ))}
      </ul>
    </div>
  );
}
