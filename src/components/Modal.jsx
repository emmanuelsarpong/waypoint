import { useEffect, useState } from "react";

function Modal({ isOpen, onClose, title, children }) {
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "16px" : "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Backdrop with enhanced blur effect */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        style={{
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: "fixed",
          zIndex: 1,
        }}
      />

      {/* Modal Content */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          border: "1px solid #e5e7eb",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)",
          borderRadius: "12px",
          zIndex: 2,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: isMobile ? "95vw" : "750px",
          maxHeight: isMobile ? "90vh" : "85vh",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-center border-b relative"
          style={{
            backgroundColor: "#f9f9f9",
            borderColor: "#e5e7eb",
            color: "#000000",
            padding: isMobile ? "16px 20px" : "24px 32px",
          }}
        >
          <h2
            className="font-semibold text-center"
            style={{
              color: "#000000",
              fontWeight: "600",
              margin: 0,
              padding: 0,
              flex: 1,
              textAlign: "center",
              fontSize: isMobile ? "18px" : "20px",
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="transition-all duration-200 absolute"
            style={{
              background: "rgba(0, 0, 0, 0.08)",
              border: "none",
              borderRadius: "8px",
              minWidth: isMobile ? "36px" : "32px",
              minHeight: isMobile ? "36px" : "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#374151",
              padding: isMobile ? "10px" : "8px",
              position: "absolute",
              right: isMobile ? "16px" : "24px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(0, 0, 0, 0.15)";
              e.target.style.transform = "translateY(-50%) scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(0, 0, 0, 0.08)";
              e.target.style.transform = "translateY(-50%) scale(1)";
            }}
          >
            <svg
              width={isMobile ? "18" : "16"}
              height={isMobile ? "18" : "16"}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ strokeWidth: "2.5" }}
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          className="overflow-y-auto"
          style={{
            maxHeight: isMobile ? "calc(90vh-140px)" : "calc(85vh-120px)",
            padding: isMobile ? "20px 24px" : "24px 32px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
