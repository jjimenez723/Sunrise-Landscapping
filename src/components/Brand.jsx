export function Mark() {
  return (
    <svg
      className="brand-mark"
      viewBox="0 0 72 64"
      fill="none"
      aria-hidden="true"
    >
      <path d="M17 36a19 19 0 1 1 38 0" fill="#f4ac5f" />
      <path
        d="M11 15q4-4 8 0m34-7q4-4 8 0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M5 43c17-14 38-14 62 0-23 0-42 4-55 13" fill="#52724a" />
      <path
        d="M23 57c12-8 26-11 42-10M35 61c9-5 18-7 26-7"
        stroke="#52724a"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Brand({ footer = false, onClick }) {
  return (
    <a
      href="#top"
      className={`brand ${footer ? "brand--footer" : ""}`}
      onClick={onClick}
      aria-label="New Sunrise Landscape home"
    >
      <Mark />
      <span>
        New Sunrise<em>Landscape</em>
      </span>
    </a>
  );
}

export function Arrow({ up = false }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={up ? "M12 19V5m-7 7 7-7 7 7" : "M5 12h13m-5-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Check() {
  return (
    <svg
      className="check-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m4 12.5 5 5L20 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
