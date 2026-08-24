import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Patient } from '../types';

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      api.get('/patients', { params: search ? { search } : {} }).then((res) => setPatients(res.data));
    }, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div>
      <div className="page-header">
        <h2>Patients</h2>
        <Link to="/patients/new" className="button">
          + New patient
        </Link>
      </div>
      <input placeholder="Search by name or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>
                <Link to={`/patients/${p.id}`}>
                  {p.firstName} {p.lastName}
                </Link>
              </td>
              <td>{p.phone}</td>
              <td>{p.email ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
