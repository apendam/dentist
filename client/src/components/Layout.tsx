import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MacWindow from './MacWindow';
import {
  PatientsIcon,
  AppointmentsIcon,
  StaffIcon,
  DayCalendarProtoIcon,
  StaffManageProtoIcon,
} from './NavIcons';

function titleForPath(pathname: string): string {
  if (pathname.startsWith('/staff-manage-mock')) return 'Manage Staff';
  if (pathname.startsWith('/calendar-mock')) return 'Day Calendar';
  if (pathname.startsWith('/staff')) return 'Staff';
  if (pathname.startsWith('/appointments')) return 'Appointments';
  if (pathname.startsWith('/patients')) return 'Patients';
  return 'Dentist CRM';
}

export default function Layout() {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <MacWindow title={titleForPath(location.pathname)}>
      <div className="layout">
        <nav className="sidebar">
          <NavLink to="/patients">
            <PatientsIcon />
            Patients
          </NavLink>
          <NavLink to="/appointments">
            <AppointmentsIcon />
            Appointments
          </NavLink>
          {user?.role === 'ADMIN' && (
            <NavLink to="/staff">
              <StaffIcon />
              Staff
            </NavLink>
          )}

          <div className="sidebar-section">Prototypes</div>
          <NavLink to="/calendar-mock">
            <DayCalendarProtoIcon />
            Day Calendar
          </NavLink>
          <NavLink to="/staff-manage-mock">
            <StaffManageProtoIcon />
            Manage Staff
          </NavLink>

          <button onClick={logout}>Log out{user ? ` (${user.name})` : ''}</button>
        </nav>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </MacWindow>
  );
}
