import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import RegisterTenant from './pages/RegisterTenant';
import PatientList from './pages/PatientList';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';
import Appointments from './pages/Appointments';
import Staff from './pages/Staff';
import MedicalHistoryMock from './pages/MedicalHistoryMock';
import VisitNotesMock from './pages/VisitNotesMock';
import DayCalendarMock from './pages/DayCalendarMock';
import StaffManageMock from './pages/StaffManageMock';
import Layout from './components/Layout';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterTenant />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/patients" replace />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="patients/new" element={<PatientForm />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="patients/:id/history" element={<MedicalHistoryMock />} />
        <Route path="patients/:id/visits" element={<VisitNotesMock />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="calendar-mock" element={<DayCalendarMock />} />
        <Route path="staff" element={<Staff />} />
        <Route path="staff-manage-mock" element={<StaffManageMock />} />
      </Route>
    </Routes>
  );
}
