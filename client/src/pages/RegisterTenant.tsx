import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterTenant() {
  const { registerTenant } = useAuth();
  const navigate = useNavigate();
  const [clinicName, setClinicName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await registerTenant(clinicName, adminName, email, password);
      navigate('/patients');
    } catch {
      setError('Could not create clinic account. Email may already be in use.');
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit}>
        <h2>Register your clinic</h2>
        {error && <p className="error">{error}</p>}
        <label>
          Clinic name
          <input value={clinicName} onChange={(e) => setClinicName(e.target.value)} required />
        </label>
        <label>
          Your name
          <input value={adminName} onChange={(e) => setAdminName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>
        <button type="submit">Create clinic account</button>
      </form>
    </div>
  );
}
