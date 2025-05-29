import { useState } from "react";
import styles from "./AuthForm.module.css";
import ProgressBar from "./ProgressBar";
import Spinner from "./Spinner";

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
    window.location.href = `/auth/${provider}`;
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

export default function AuthForm({ mode = "login", onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Special Mode UIs ---
  if (mode === "check-email") {
    return (
      <div className={styles.container}>
        <Header />
        <div className="bg-white p-8 rounded shadow text-center max-w-md mx-auto mt-16">
          <h2 className={styles.heading}>Check your email</h2>
          <p className="text-black">
            We’ve sent a link to your email. Please check your inbox and follow
            the instructions.
          </p>
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
        body = { email, password, confirmPassword };
      } else if (mode === "forgot-password") {
        endpoint = "/auth/forgot-password";
        body = { email };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        if (onSuccess) onSuccess();
        else alert(data.message || "Success!");
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch {
      setLoading(false);
      setError("Network error.");
    }
  };

  return (
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
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={styles.input}
          required
        />
        {mode !== "forgot-password" && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={styles.input}
            required
          />
        )}
        {mode === "signup" && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className={styles.input}
            required
          />
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
  );
}
