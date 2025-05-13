import { useState } from "react";
import styles from "./AuthForm.module.css";

// Import the colored icons
import GoogleIcon from "../assets/google.svg";
import MicrosoftIcon from "../assets/microsoft.svg";
import AppleIcon from "../assets/apple.svg";
import PhoneIcon from "../assets/phone.svg";

export default function AuthForm({ mode = "login" }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${mode} with email: ${email}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className={styles.input}
          required
        />

        <button type="submit" className={styles.button}>
          Continue
        </button>
      </form>

      {mode === "login" ? (
        <p className="subtext">
          Don’t have an account?{" "}
          <span>
            <a href="/signup" className="link">
              Sign up
            </a>
          </span>
        </p>
      ) : (
        <p className="subtext">
          Already have an account?{" "}
          <span>
            <a href="/login" className="link">
              Sign in
            </a>
          </span>
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
        <a href="#">Terms of Use</a>
        <span>|</span>
        <a href="#">Privacy Policy</a>
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
