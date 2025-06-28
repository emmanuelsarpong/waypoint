import React, { useEffect, useState } from "react";

export default function PageSpinner({ size = 48, color = "#fff", minDelay = 200 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), minDelay);
    return () => clearTimeout(timer);
  }, [minDelay]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0,0,0,0.0)",
        zIndex: 9999,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        stroke={color}
        style={{ display: "block" }}
      >
        <g fill="none" fillRule="evenodd" strokeWidth="4">
          <circle cx="22" cy="22" r="20" strokeOpacity=".2" />
          <path d="M42 22c0-11.046-8.954-20-20-20">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 22 22"
              to="360 22 22"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
    </div>
  );
}