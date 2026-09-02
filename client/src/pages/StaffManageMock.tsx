import { FormEvent, useState } from 'react';

interface StaffRow {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'DENTIST' | 'FRONT_DESK';
  status: 'Active' | 'Inactive';
}

const SEED_STAFF: StaffRow[] = [
  { id: 1, name: 'Dr. Anjali Verma', email: 'anjali@smiledental.test', role: 'ADMIN', status: 'Active' },
  { id: 2, name: 'Dr. Rohan Iyer', email: 'rohan@smiledental.test', role: 'DENTIST', status: 'Active' },
  { id: 3, name: 'Dr. Priya Nair', email: 'priya@smiledental.test', role: 'DENTIST', status: 'Active' },
  { id: 6, name: 'Dr. Pallavi Desai', email: 'pallavi@smiledental.test', role: 'DENTIST', status: 'Active' },
  { id: 4, name: 'Sunita Pillai', email: 'sunita@smiledental.test', role: 'FRONT_DESK', status: 'Active' },
  { id: 5, name: 'Arjun Mehta', email: 'arjun@smiledental.test', role: 'FRONT_DESK', status: 'Inactive' },
];

const ROLE_STYLES: Record<StaffRow['role'], { bg: string; text: string; label: string }> = {
  ADMIN: { bg: '#e8e9fd', text: '#4338ca', label: 'Admin' },
  DENTIST: { bg: '#e6f9f1', text: '#047857', label: 'Dentist' },
  FRONT_DESK: { bg: '#fdf3e0', text: '#92400e', label: 'Front Desk' },
};

export default function StaffManageMock() {
  const [staff, setStaff] = useState<StaffRow[]>(SEED_STAFF);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<{ name: string; role: StaffRow['role'] }>({ name: '', role: 'FRONT_DESK' });
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'FRONT_DESK' as StaffRow['role'] });

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStaff((prev) => [
      ...prev,
      { id: Date.now(), name: form.name, email: form.email, role: form.role, status: 'Active' },
    ]);
    setForm({ name: '', email: '', password: '', role: 'FRONT_DESK' });
    setShowAdd(false);
  }

  function startEdit(row: StaffRow) {
    setEditId(row.id);
    setEditDraft({ name: row.name, role: row.role });
    setConfirmRemoveId(null);
  }

  function saveEdit(id: number) {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, name: editDraft.name, role: editDraft.role } : s)));
    setEditId(null);
  }

  function toggleStatus(id: number) {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s))
    );
  }

  function removeStaff(id: number) {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    setConfirmRemoveId(null);
  }

  return (
    <div>
      <div className="page-header">
        <h2>Staff</h2>
        <button type="button" className="button" onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? 'Cancel' : '+ Add staff member'}
        </button>
      </div>
      <p className="mock-badge">PROTOTYPE — UI mockup, not wired to a backend</p>

      {showAdd && (
        <form onSubmit={handleAdd} className="mock-card mock-add-staff">
          <h3>Add Staff Member</h3>
          <div className="visit-form-row">
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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>
            <label>
              Role
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as StaffRow['role'] })}>
                <option value="DENTIST">Dentist</option>
                <option value="FRONT_DESK">Front Desk</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
          </div>
          <button type="submit" className="mock-save">
            Add staff member
          </button>
        </form>
      )}

      <table className="staff-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => {
            const roleStyle = ROLE_STYLES[s.role];
            const isEditing = editId === s.id;
            return (
              <tr key={s.id}>
                <td>
                  {isEditing ? (
                    <input value={editDraft.name} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} />
                  ) : (
                    s.name
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <select
                      value={editDraft.role}
                      onChange={(e) => setEditDraft({ ...editDraft, role: e.target.value as StaffRow['role'] })}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="DENTIST">Dentist</option>
                      <option value="FRONT_DESK">Front Desk</option>
                    </select>
                  ) : (
                    <span className="role-badge" style={{ background: roleStyle.bg, color: roleStyle.text }}>
                      {roleStyle.label}
                    </span>
                  )}
                </td>
                <td>{s.email}</td>
                <td>
                  <div className="mac-switch-row">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={s.status === 'Active'}
                      className={`mac-switch ${s.status === 'Active' ? 'mac-switch-on' : ''}`}
                      onClick={() => toggleStatus(s.id)}
                    >
                      <span className="mac-switch-knob" />
                    </button>
                    <span className={s.status === 'Active' ? 'status-active' : 'status-inactive'}>{s.status}</span>
                  </div>
                </td>
                <td className="staff-actions">
                  {isEditing ? (
                    <>
                      <button type="button" className="link-btn" onClick={() => saveEdit(s.id)}>
                        Save
                      </button>
                      <button type="button" className="link-btn" onClick={() => setEditId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : confirmRemoveId === s.id ? (
                    <>
                      <span className="confirm-text">Remove this staff member?</span>
                      <button type="button" className="link-btn link-danger" onClick={() => removeStaff(s.id)}>
                        Confirm
                      </button>
                      <button type="button" className="link-btn" onClick={() => setConfirmRemoveId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="link-btn" onClick={() => startEdit(s)}>
                        Edit
                      </button>
                      <button type="button" className="link-btn link-danger" onClick={() => setConfirmRemoveId(s.id)}>
                        Remove
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
