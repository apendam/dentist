function IconSquare({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span className="nav-icon" style={{ background: bg }}>
      {children}
    </span>
  );
}

function PersonGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13">
      <circle cx="12" cy="8" r="4" fill="white" />
      <path d="M4 20a8 8 0 0 1 16 0z" fill="white" />
    </svg>
  );
}

function CalendarGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13">
      <rect x="3" y="5" width="18" height="15" rx="3" fill="white" />
      <rect x="7" y="2" width="2" height="5" rx="1" fill="white" />
      <rect x="15" y="2" width="2" height="5" rx="1" fill="white" />
      <rect x="6" y="10.5" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="10.5" y="10.5" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="15" y="10.5" width="3" height="3" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function BriefcaseGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13">
      <rect x="3" y="8" width="18" height="12" rx="2" fill="white" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="white" strokeWidth="2" />
      <rect x="10" y="12.5" width="4" height="2" rx="0.5" fill="currentColor" />
    </svg>
  );
}

export function PatientsIcon() {
  return (
    <IconSquare bg="#0A84FF">
      <PersonGlyph />
    </IconSquare>
  );
}

export function AppointmentsIcon() {
  return (
    <IconSquare bg="#FF3B30">
      <CalendarGlyph />
    </IconSquare>
  );
}

export function StaffIcon() {
  return (
    <IconSquare bg="#5E5CE6">
      <BriefcaseGlyph />
    </IconSquare>
  );
}

export function DayCalendarProtoIcon() {
  return (
    <IconSquare bg="#40C8E0">
      <CalendarGlyph />
    </IconSquare>
  );
}

export function StaffManageProtoIcon() {
  return (
    <IconSquare bg="#FF9F0A">
      <BriefcaseGlyph />
    </IconSquare>
  );
}
