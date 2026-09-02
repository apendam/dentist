import { useState } from 'react';

interface Appt {
  dentist: 'iyer' | 'verma';
  startIdx: number;
  span: number;
  patient: string;
  type: string;
}

const TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];
const LUNCH_START = 8;
const LUNCH_SPAN = 2;

const DENTISTS: { key: 'iyer' | 'verma'; name: string }[] = [
  { key: 'iyer', name: 'Dr. Rohan Iyer' },
  { key: 'verma', name: 'Dr. Anjali Verma' },
];

const TYPE_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  Consultation: { bg: '#e8f0fe', border: '#3b82f6', text: '#1d4ed8' },
  Cleaning: { bg: '#e6f9f1', border: '#10b981', text: '#047857' },
  Filling: { bg: '#f3e8fd', border: '#8b5cf6', text: '#6d28d9' },
  'Root Canal': { bg: '#fdecec', border: '#ef4444', text: '#b91c1c' },
  'Crown / Bridge': { bg: '#e8e9fd', border: '#6366f1', text: '#4338ca' },
  Extraction: { bg: '#fdf3e0', border: '#d97706', text: '#92400e' },
};

const APPOINTMENTS: Appt[] = [
  { dentist: 'iyer', startIdx: 0, span: 1, patient: 'Ananya Kapoor', type: 'Consultation' },
  { dentist: 'iyer', startIdx: 2, span: 2, patient: 'Kiran Mehta', type: 'Root Canal' },
  { dentist: 'iyer', startIdx: 5, span: 1, patient: 'Meera Nair', type: 'Filling' },
  { dentist: 'iyer', startIdx: 7, span: 1, patient: 'Vikram Shah', type: 'Cleaning' },
  { dentist: 'iyer', startIdx: 11, span: 1, patient: 'Kiran Mehta', type: 'Crown / Bridge' },
  { dentist: 'iyer', startIdx: 13, span: 1, patient: 'New Walk-in', type: 'Consultation' },
  { dentist: 'iyer', startIdx: 14, span: 1, patient: 'Rahul Deshmukh', type: 'Extraction' },

  { dentist: 'verma', startIdx: 1, span: 1, patient: 'Priya Kulkarni', type: 'Cleaning' },
  { dentist: 'verma', startIdx: 3, span: 1, patient: 'Sanjay Rao', type: 'Consultation' },
  { dentist: 'verma', startIdx: 4, span: 1, patient: 'Neha Joshi', type: 'Filling' },
  { dentist: 'verma', startIdx: 6, span: 1, patient: 'Arjun Nair', type: 'Crown / Bridge' },
  { dentist: 'verma', startIdx: 10, span: 2, patient: 'Divya Menon', type: 'Root Canal' },
  { dentist: 'verma', startIdx: 13, span: 1, patient: 'Karan Malhotra', type: 'Cleaning' },
  { dentist: 'verma', startIdx: 15, span: 1, patient: 'Fatima Sheikh', type: 'Consultation' },
];

function findAppt(dentist: string, idx: number) {
  return APPOINTMENTS.find((a) => a.dentist === dentist && a.startIdx === idx);
}
function isCovered(dentist: string, idx: number) {
  return APPOINTMENTS.some((a) => a.dentist === dentist && idx > a.startIdx && idx < a.startIdx + a.span);
}

export default function DayCalendarMock() {
  const [date] = useState('Monday, August 24, 2026');

  return (
    <div>
      <div className="page-header">
        <h2>Day Schedule</h2>
      </div>
      <p className="mock-badge">PROTOTYPE — UI mockup, not wired to a backend</p>

      <div className="cal-toolbar">
        <div className="cal-datenav">
          <button type="button" className="cal-nav-btn">←</button>
          <strong>{date}</strong>
          <button type="button" className="cal-nav-btn">→</button>
        </div>
        <div className="cal-legend">
          {Object.entries(TYPE_STYLES).map(([type, s]) => (
            <span key={type} className="cal-legend-item">
              <span className="cal-legend-swatch" style={{ background: s.border }} />
              {type}
            </span>
          ))}
        </div>
      </div>

      <div
        className="cal-grid"
        style={{ gridTemplateRows: `44px repeat(${TIMES.length}, 56px)` }}
      >
        <div className="cal-corner" style={{ gridColumn: 1, gridRow: 1 }} />
        {DENTISTS.map((d, ci) => (
          <div className="cal-col-header" key={d.key} style={{ gridColumn: ci + 2, gridRow: 1 }}>
            {d.name}
          </div>
        ))}

        {TIMES.map((t, idx) => (
          <div className="cal-time" key={t} style={{ gridColumn: 1, gridRow: idx + 2 }}>
            {t}
          </div>
        ))}

        {DENTISTS.map((d, ci) => {
          const col = ci + 2;
          return TIMES.map((_, idx) => {
            if (idx >= LUNCH_START && idx < LUNCH_START + LUNCH_SPAN) {
              if (idx === LUNCH_START) {
                return (
                  <div
                    key={`${d.key}-lunch`}
                    className="cal-cell cal-lunch"
                    style={{ gridColumn: col, gridRow: `${idx + 2} / span ${LUNCH_SPAN}` }}
                  >
                    Lunch Break
                  </div>
                );
              }
              return null;
            }
            if (isCovered(d.key, idx)) return null;

            const appt = findAppt(d.key, idx);
            if (appt) {
              const style = TYPE_STYLES[appt.type];
              return (
                <div
                  key={`${d.key}-${idx}`}
                  className="cal-cell cal-appt"
                  style={{
                    gridColumn: col,
                    gridRow: `${idx + 2} / span ${appt.span}`,
                    background: style.bg,
                    borderLeftColor: style.border,
                  }}
                >
                  <span className="cal-appt-patient">{appt.patient}</span>
                  <span className="cal-appt-type" style={{ color: style.text }}>
                    {appt.type}
                  </span>
                </div>
              );
            }
            return (
              <div key={`${d.key}-${idx}`} className="cal-cell cal-open" style={{ gridColumn: col, gridRow: idx + 2 }}>
                + Open slot
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
