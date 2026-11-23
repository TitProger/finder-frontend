type IconProps = { className?: string };

export function UploadMark() {
  return (
    <svg className="upload-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m9-5.25v9l-9 5.25m0-14.25v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseMark() {
  return (
    <svg className="close-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function ResultsMark() {
  return (
    <svg className="results-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect height="13" rx="2.5" width="13" x="7" y="4" />
      <path d="M4 8v10a2 2 0 002 2h10" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11.5" cy="8.5" fill="currentColor" r="1.2" stroke="none" />
      <path d="M17.5 14l-3-3.5-4 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CategoryMark({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      {name === "drop" ? <path {...common} d="M12 3s6 6.2 6 10a6 6 0 1 1-12 0c0-3.8 6-10 6-10z" /> : null}
      {name === "fork" ? <path {...common} d="M8 3v7M12 3v7M8 7h4M10 10v11M16 3c1.5 2 2 4 2 6 0 2-1 3-2 3v9" /> : null}
      {name === "basket" ? <path {...common} d="M6 8h12l-1 11H7L6 8zM9 8l1-3h4l1 3" /> : null}
      {name === "phone" ? (
        <>
          <rect {...common} x="7" y="2.5" width="10" height="19" rx="2" />
          <path {...common} d="M11 18.5h2" />
        </>
      ) : null}
      {name === "sofa" ? <path {...common} d="M4 13V9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4M3 13h18v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> : null}
    </svg>
  );
}

export function ListMark({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 6h13M8 12h13M8 18h13" strokeLinecap="round" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" strokeLinecap="round" />
    </svg>
  );
}

export function GridMark({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function FolderMark({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 10v6m3-3H9m12-3a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
