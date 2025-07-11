import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Spinner from "../components/ButtonSpinner";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");
  const [success, setSuccess] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("Invalid or missing verification token.");
      return;
    }
    // Use the correct API URL for verification
    const apiUrl = import.meta.env.VITE_API_URL || "https://waypoint-production-5b75.up.railway.app";
    console.log("Verification API URL:", apiUrl);
    console.log(
      "Full verification URL:",
      `${apiUrl}/auth/verify-email?token=${token}`
    );

    fetch(`${apiUrl}/auth/verify-email?token=${token}`)
      .then((res) => {
        console.log("Verification response status:", res.status);
        console.log("Verification response ok:", res.ok);
        return res.json();
      })
      .then((data) => {
        if (data.message) {
          setStatus(data.message);
          setSuccess(true);
        } else if (data.alreadyVerified) {
          setStatus("Email already verified. Please log in.");
          setAlreadyVerified(true);
        } else if (data.error === "Token has expired. Please sign up again.") {
          setStatus("Token has expired. Please sign up again.");
        } else if (data.error === "Token is invalid or has expired.") {
          setStatus("Token is invalid.");
        } else {
          setStatus(data.error || "Verification failed.");
        }
      })
      .catch(() => setStatus("Verification failed. Please try again."));
  }, [token]);

  useEffect(() => {
    if (success || alreadyVerified) {
      const timer = setTimeout(() => navigate("/login"), 3500);
      return () => clearTimeout(timer);
    }
  }, [success, alreadyVerified, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {(success || alreadyVerified) && (
          <>
            <Spinner />
            <h2
              style={{
                fontWeight: 700,
                fontSize: 24,
                color: "#000",
                margin: "24px 0 0 0",
              }}
            >
              Email verified!
            </h2>
            <p style={{ color: "#64748b", margin: "32px 0 0 0", fontSize: 16 }}>
              {alreadyVerified
                ? "Your email is already verified. Redirecting to login..."
                : "Your email has been verified. Redirecting to login..."}
            </p>
          </>
        )}
        {!success && !alreadyVerified && (
          <>
            <Spinner />
            <p style={{ color: "#64748b", margin: "16px 0 0 0", fontSize: 16 }}>
              {status}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
