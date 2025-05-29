export default function Spinner({ size = 24 }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: size,
        width: size,
      }}
    >
      <div
        className="spinner"
        style={{
          width: size,
          height: size,
          borderWidth: Math.max(2, Math.round(size / 8)),
        }}
      />
      <style>
        {`
          .spinner {
            border-style: solid;
            border-color: #ff7eb3;
            border-top-color: #a29bfe;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
}
