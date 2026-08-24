import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { Appointment, Dentist, Patient } from '../types';

function today() {
  return new Date().toISOString().slice(0, 10);
}

const STATUSES = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

export default function Appointments() {
  const [date, setDate] = useState(today());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [form, setForm] = useState({ patientId: '', dentistId: '', time: '09:00', reason: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/appointments', { params: { date } }).then((res) => setAppointments(res.data));
  }, [date]);

  useEffect(() => {
    api.get('/staff/dentists').then((res) => setDentists(res.data));
    api.get('/patients').then((res) => setPatients(res.data));
  }, []);

  async function refresh() {
    const res = await api.get('/appointments', { params: { date } });
    setAppointments(res.data);
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const scheduledAt = new Date(`${date}T${form.time}:00`).toISOString();
      await api.post('/appointments', {
        patientId: form.patientId,
        dentistId: form.dentistId,
        scheduledAt,
        reason: form.reason,
      });
      await refresh();
    } catch {
      setError('Could not create appointment. Check the fields and try again.');
    }
  }

  async function updateStatus(id: string, status: string) {
    await api.patch(`/appointments/${id}/status`, { status });
    await refresh();
  }

  return (
    <div>
      <h2>Appointments</h2>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Patient</th>
            <th>Dentist</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td>{new Date(a.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
              <td>
                {a.patient.firstName} {a.patient.lastName}
              </td>
              <td>{a.dentist.name}</td>
              <td>{a.status}</td>
              <td>
                <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Book appointment</h3>
      {dentists.length === 0 && <p>Add a dentist under Staff before booking appointments.</p>}
      <form onSubmit={handleCreate} className="appointment-form">
        {error && <p className="error">{error}</p>}
        <label>
          Patient
          <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required>
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Dentist
          <select value={form.dentistId} onChange={(e) => setForm({ ...form, dentistId: e.target.value })} required>
            <option value="">Select dentist</option>
            {dentists.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Time
          <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </label>
        <label>
          Reason
          <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
        </label>
        <button type="submit">Book</button>
      </form>
    </div>
  );
}
