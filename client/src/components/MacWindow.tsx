import { ReactNode } from 'react';

export default function MacWindow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mac-app">
      <div className="mac-titlebar">
        <div className="mac-traffic-lights">
          <span className="tl-dot tl-red" />
          <span className="tl-dot tl-yellow" />
          <span className="tl-dot tl-green" />
        </div>
        <div className="mac-titlebar-title">{title}</div>
      </div>
      <div className="mac-body">{children}</div>
    </div>
  );
}
