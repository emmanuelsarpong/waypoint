import { useState } from "react";
import styles from "./AuthForm.module.css";

// Import the colored icons
import GoogleIcon from "../assets/google.svg";
import MicrosoftIcon from "../assets/microsoft.svg";
import AppleIcon from "../assets/apple.svg";
import PhoneIcon from "../assets/phone.svg";
import GlobeIcon from "../assets/globe-black.svg";

export default function AuthForm({ mode = "login" }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let body;
      if (mode === "signup") {
        body = JSON.stringify({ username, password });
      } else {
        body = JSON.stringify({ username, password });
      }
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Success!");
      } else {
        alert(data.error || "Authentication failed.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Fixed Header Section */}
      <header className={styles.fixedHeader}>
        <a href="/" className={styles.logo}>
          <img src={GlobeIcon} alt="Waypoint" className={styles.icon} />
        </a>
      </header>

      <h2 className={styles.heading}>
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {mode === "signup" && (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={styles.input}
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.input}
              required
            />
          </>
        )}
        {mode === "login" && (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={styles.input}
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.input}
              required
            />
          </>
        )}
        <button type="submit" className={styles.button}>
          Continue
        </button>
      </form>

      {mode === "login" ? (
        <p className="subtext">
          Don’t have an account?{" "}
          <a href="/signup" className="link">
            Sign up
          </a>
        </p>
      ) : (
        <p className="subtext">
          Already have an account?{" "}
          <a href="/login" className="link">
            Login
          </a>
        </p>
      )}

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
