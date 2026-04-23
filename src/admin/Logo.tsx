import React from "react";

export const Logo: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 0",
    }}
  >
    <svg
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="8" fill="#10B981" />
      <circle cx="20" cy="20" r="8" stroke="#fff" strokeWidth="2.5" />
      <circle cx="20" cy="20" r="3" fill="#fff" />
    </svg>
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
      <span
        style={{
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "var(--theme-elevation-1000)",
        }}
      >
        OpticWise
      </span>
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--theme-elevation-500)",
          fontWeight: 600,
        }}
      >
        Content Studio
      </span>
    </div>
  </div>
);

export default Logo;
