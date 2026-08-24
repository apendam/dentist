import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { Patient } from '../types';

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (id) api.get(`/patients/${id}`).then((res) => setPatient(res.data));
  }, [id]);

  if (!patient) return <p>Loading...</p>;

  return (
    <div>
      <h2>
        {patient.firstName} {patient.lastName}
      </h2>
      <dl>
        <dt>Phone</dt>
        <dd>{patient.phone}</dd>
        <dt>Email</dt>
        <dd>{patient.email ?? '-'}</dd>
        <dt>Address</dt>
        <dd>{patient.address ?? '-'}</dd>
        <dt>Emergency contact</dt>
        <dd>
          {patient.emergencyContactName ?? '-'} {patient.emergencyContactPhone ?? ''}
        </dd>
        <dt>Medical history</dt>
        <dd>{patient.medicalHistory ?? '-'}</dd>
        <dt>Consent on file</dt>
        <dd>{patient.consentGiven ? 'Yes' : 'No'}</dd>
      </dl>
    </div>
  );
}
