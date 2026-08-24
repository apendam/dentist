import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { logout, user } = useAuth();

  return (
    <div className="layout">
      <nav className="sidebar">
        <h1>Dentist CRM</h1>
        <NavLink to="/patients">Patients</NavLink>
        <NavLink to="/appointments">Appointments</NavLink>
        {user?.role === 'ADMIN' && <NavLink to="/staff">Staff</NavLink>}
        <button onClick={logout}>Log out{user ? ` (${user.name})` : ''}</button>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
