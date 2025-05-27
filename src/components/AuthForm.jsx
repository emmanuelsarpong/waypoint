import { useState } from "react";
import styles from "./AuthForm.module.css";

// Icons
import GoogleIcon from "../assets/google.svg";
import MicrosoftIcon from "../assets/microsoft.svg";
import AppleIcon from "../assets/apple.svg";
import PhoneIcon from "../assets/phone.svg";
import GlobeIcon from "../assets/globe-black.svg";

export default function AuthForm({ mode = "login", onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint, body;
      if (mode === "forgot-password") {
        endpoint = "/auth/forgot-password";
        body = JSON.stringify({ email });
      } else {
        endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
        body = JSON.stringify({ email, password });
      }
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await res.json();
      if (res.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          alert(data.message || "Success!");
        }
      } else {
        alert(data.error || "Authentication failed.");
      }
    } catch {
      alert("Network error.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Logo */}
      <header className={styles.fixedHeader}>
        <a href="/" className={styles.logo}>
          <img src={GlobeIcon} alt="Waypoint" className={styles.icon} />
        </a>
      </header>

      <h2 className={styles.heading}>
        {mode === "login"
          ? "Welcome back"
          : mode === "signup"
          ? "Create your account"
          : "Forgot Password"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
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
        <button type="submit" className={styles.button}>
          {mode === "forgot-password" ? "Send Reset Link" : "Continue"}
        </button>
      </form>

      {/* Navigation Links */}
      {mode === "login" ? (
        <div className={styles.linksWrapper}>
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
        </div>
      ) : mode === "signup" ? (
        <div className={styles.linksWrapper}>
          <p className="subtext">
            Already have an account?{" "}
            <a href="/login" className="link">
              Login
            </a>
          </p>
        </div>
      ) : (
        <div className={styles.linksWrapper}>
          <p className="subtext">
            Remembered your password?{" "}
            <a href="/login" className="link">
              Login
            </a>
          </p>
        </div>
      )}

      {/* Divider and OAuth only for login/signup */}
      {(mode === "login" || mode === "signup") && (
        <>
          <div className={styles.dividerWrapper}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>OR</span>
            <div className={styles.dividerLine} />
          </div>
          <div className={styles.oauthWrapper}>
            <OAuthButton icon={GoogleIcon} text="Continue with Google" />
            <OAuthButton
              icon={MicrosoftIcon}
              text="Continue with Microsoft Account"
            />
            <OAuthButton icon={AppleIcon} text="Continue with Apple" />
            <OAuthButton icon={PhoneIcon} text="Continue with phone" />
          </div>
        </>
      )}

      {/* Footer Links */}
      <div className={styles.footerLinks}>
        <a href="#" className="link">
          Terms of Use
        </a>
        <span>|</span>
        <a href="#" className="link">
          Privacy Policy
        </a>
      </div>
    </div>
  );
}

function OAuthButton({ icon, text }) {
  return (
    <button className={styles.oauthButton}>
      <img src={icon} alt="" className={styles.oauthIcon} />
      <span>{text}</span>
    </button>
  );
}
