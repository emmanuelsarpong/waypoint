import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./AuthForm.module.css";
import ProgressBar from "./ProgressBar";
import Spinner from "./Spinner";
import StatusNotice from "./StatusNotice";

// Icons
import GoogleIcon from "../assets/google.svg";
import MicrosoftIcon from "../assets/microsoft.svg";
import AppleIcon from "../assets/apple.svg";
import PhoneIcon from "../assets/phone.svg";
import GlobeIcon from "../assets/globe-black.svg";

function OAuthButton({ icon, text, onClick }) {
  return (
    <button className={styles.oauthButton} onClick={onClick}>
      <img src={icon} alt="" className={styles.oauthIcon} />
      <span>{text}</span>
    </button>
  );
}

function Header() {
  return (
    <header className={styles.fixedHeader}>
      <a href="/" className={styles.logo}>
        <img src={GlobeIcon} alt="Waypoint" className={styles.icon} />
      </a>
    </header>
  );
}

function FooterLinks() {
  return (
    <div className={styles.footerLinks}>
      <a href="#" className="link">
        Terms of Use
      </a>
      <span>|</span>
      <a href="#" className="link">
        Privacy Policy
      </a>
    </div>
  );
}

function DividerOAuth() {
  const handleOAuth = (provider) => {
    // Use backend URL for OAuth
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    window.location.href = `${backendUrl}/auth/${provider}`;
  };

  return (
    <>
      <div className={styles.dividerWrapper}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>OR</span>
        <div className={styles.dividerLine} />
      </div>
      <div className={styles.oauthWrapper}>
        <OAuthButton
          icon={GoogleIcon}
          text="Continue with Google"
          onClick={() => handleOAuth("google")}
        />
        <OAuthButton
          icon={MicrosoftIcon}
          text="Continue with Microsoft"
          onClick={() => handleOAuth("microsoft")}
        />
        <OAuthButton
          icon={AppleIcon}
          text="Continue with Apple"
          onClick={() => handleOAuth("apple")}
        />
        <OAuthButton
          icon={PhoneIcon}
          text="Continue with Phone"
          onClick={() => handleOAuth("phone")}
        />
      </div>
    </>
  );
}

function NavigationLinks({ mode }) {
  const links = {
    login: (
      <>
        <p className="subtext">
          Don’t have an account?{" "}
          <a href="/signup" className="link">
            Sign up
          </a>
        </p>
        <p className="subtext">
          Forgot password?{" "}
          <a href="/forgot-password" className="link">
            Reset
          </a>
        </p>
      </>
    ),
    signup: (
      <p className="subtext">
        Already have an account?{" "}
        <a href="/login" className="link">
          Login
        </a>
      </p>
    ),
    "forgot-password": (
      <p className="subtext">
        Remembered your password?{" "}
        <a href="/login" className="link">
          Login
        </a>
      </p>
    ),
  };
  return <div className={styles.linksWrapper}>{links[mode]}</div>;
}

export default function AuthForm({ mode = "login", onSuccess, token }) {
  const [firstName, setFirstName] = useState(""); // <-- Add first name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const forgotResult = location.state?.forgotResult;

  // --- Special Mode UIs ---
  if (mode === "check-email") {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Header />
          <StatusNotice
            title="Check your email"
            message="We’ve sent a link to your email. Please check your inbox and follow the instructions."
          />
        </div>
      </div>
    );
  }

  if (mode === "password-email-sent") {
    // Use forgotResult if available, otherwise fallback to generic message
    const title = forgotResult
      ? forgotResult.userFound
        ? "Password reset email sent"
        : "No account found"
      : "Password reset email sent";
    const message = forgotResult
      ? forgotResult.message
      : "If an account exists for this email, a password reset link has been sent. Please check your inbox.";

    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Header />
          <StatusNotice title={title} message={message} />
        </div>
      </div>
    );
  }

  if (mode === "reset-password") {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Header />
          <h2 className={styles.heading}>Create a new password</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError("");
              if (password !== confirmPassword) {
                setError("Passwords do not match");
                setLoading(false);
                return;
              }
              console.log("RESET PASSWORD TOKEN:", token);
              try {
                const res = await fetch("/auth/reset-password", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ password, token }),
                });
                const data = await res.json();
                setLoading(false);
                if (res.ok) {
                  setSuccess(true);
                  setTimeout(() => {
                    navigate("/login");
                  }, 2000);
                  return;
                }
                setError(data.error || "Failed to reset password.");
              } catch {
                setLoading(false);
                setError("Network error.");
              }
            }}
            className={styles.form}
          >
            {success && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  color: "#065f46",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                <Spinner size={28} />
                <span style={{ marginTop: 12 }}>
                  Password successfully created! Redirecting to login...
                </span>
              </div>
            )}
            {error && (
              <div
                style={{
                  color: "#b91c1c",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className={styles.input}
              required
              disabled={success}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className={styles.input}
              required
              disabled={success}
            />
            <button
              type="submit"
              className={styles.button}
              disabled={loading || success}
              style={{ position: "relative", overflow: "hidden" }}
            >
              <span style={{ visibility: loading ? "hidden" : "visible" }}>
                Create Password
              </span>
              {loading && (
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                  }}
                >
                  <Spinner size={24} />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Handle Form Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      let endpoint = "/auth/login";
      let body = { email, password };

      if (mode === "signup") {
        endpoint = "/auth/signup";
        body = { firstName, email, password, confirmPassword }; // <-- Include firstName
      } else if (mode === "forgot-password") {
        endpoint = "/auth/forgot-password";
        body = { email };
      }

      console.log("Submitting login", { ...body });
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log("Login response:", res);
      const data = await res.json();
      console.log("Login data:", data);

      setLoading(false);

      if (res.ok) {
        if (mode === "login" && data.token) {
          localStorage.setItem("token", data.token);
          navigate("/dashboard"); // <-- Make sure this is /dashboard, not /profile
          return;
        }
        if (onSuccess) onSuccess();
        if (mode === "forgot-password") {
          navigate("/password-email-sent", { state: { forgotResult: data } });
        }
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch {
      setLoading(false);
      setError("Network error.");
    }
  };

  // --- Main Form ---
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <ProgressBar loading={loading} />
        <Header />
        <h2 className={styles.heading}>
          {
            {
              login: "Welcome back",
              signup: "Create your account",
              "forgot-password": "Forgot Password",
            }[mode]
          }
        </h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div
              style={{
                background: "#ffeded",
                color: "#b91c1c",
                border: "1px solid #b91c1c",
                borderRadius: "6px",
                padding: "12px",
                marginBottom: "1rem",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* First Name field only for signup */}
          {mode === "signup" && (
            <div className={styles.inputGroup}>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className={`${styles.input} ${firstName ? styles.filled : ""}`}
                autoComplete="given-name"
              />
              <label
                htmlFor="firstName"
                className={`${styles.floatingLabel} ${
                  firstName ? styles.filled : ""
                }`}
              >
                First Name
              </label>
            </div>
          )}

          <div className={styles.inputGroup}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`${styles.input} ${email ? styles.filled : ""}`}
              autoComplete="email"
            />
            <label
              htmlFor="email"
              className={`${styles.floatingLabel} ${
                email ? styles.filled : ""
              }`}
            >
              Email
            </label>
          </div>

          {mode !== "forgot-password" && (
            <div className={styles.inputGroup}>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${styles.input} ${password ? styles.filled : ""}`}
                autoComplete="new-password"
              />
              <label
                htmlFor="password"
                className={`${styles.floatingLabel} ${
                  password ? styles.filled : ""
                }`}
              >
                Password
              </label>
            </div>
          )}

          {mode === "signup" && (
            <div className={styles.inputGroup}>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`${styles.input} ${
                  confirmPassword ? styles.filled : ""
                }`}
                autoComplete="new-password"
              />
              <label
                htmlFor="confirmPassword"
                className={`${styles.floatingLabel} ${
                  confirmPassword ? styles.filled : ""
                }`}
              >
                Confirm Password
              </label>
            </div>
          )}
          <button
            type="submit"
            className={styles.button}
            disabled={loading}
            style={{ position: "relative", overflow: "hidden" }}
          >
            <span style={{ visibility: loading ? "hidden" : "visible" }}>
              {mode === "forgot-password" ? "Send Reset Link" : "Continue"}
            </span>
            {loading && (
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                }}
              >
                <Spinner size={24} />
              </span>
            )}
          </button>
        </form>
        <NavigationLinks mode={mode} />
        {(mode === "login" || mode === "signup") && <DividerOAuth />}
        <FooterLinks />
      </div>
    </div>
  );
}
