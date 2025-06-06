import React, { useState } from "react";

export default function Settings() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Styles (matching Contact page)
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "48px",
    maxWidth: "700px",
    width: "100%",
    margin: "0",
    padding: "40px 20px",
    background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: "10px",
  };

  const subtextStyle = {
    color: "#9ca3af",
    fontSize: "1.125rem",
    textAlign: "center",
    marginBottom: "20px",
  };

  const inputStyle = {
    padding: "12px",
    border: "1px solid #3f3f3f",
    borderRadius: "8px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    fontSize: "1rem",
    fontFamily: "inherit",
    outline: "none",
    transition: "all 0.3s ease",
    width: "100%",
    boxSizing: "border-box",
  };

  const focusGlowStyle = {
    borderColor: "#ff7eb3",
    boxShadow: "0 0 0 .5px rgba(255, 126, 179, 0.5)",
  };

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "12px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "1px solid #3f3f3f",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "10px",
    boxSizing: "border-box",
  };

  const buttonHoverStyle = {
    backgroundColor: "#333",
    // Removed transform: "scale(1.02)",
  };

  // Handlers
  const handleMouseEnter = (e, style) => Object.assign(e.target.style, style);
  const handleMouseLeave = (e, style) => Object.assign(e.target.style, style);

  const handleNameUpdate = (e) => {
    e.preventDefault();
    setMessage("Name updated!");
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setMessage("Password updated!");
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        margin: "100px 0",
      }}
    >
      <form
        style={containerStyle}
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 style={headingStyle}>Settings</h1>
        <p style={subtextStyle}>Manage your account information below.</p>
        {message && (
          <p
            style={{
              color: "#4ade80",
              background: "#134e4a",
              borderRadius: 8,
              padding: "8px 0",
              textAlign: "center",
              marginBottom: 0,
            }}
          >
            {message}
          </p>
        )}

        {/* Update Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ fontWeight: "bold", marginBottom: 4 }}>
            Update Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => handleMouseEnter(e, focusGlowStyle)}
            onBlur={(e) => handleMouseLeave(e, inputStyle)}
          />
          <button
            type="button"
            style={buttonStyle}
            onClick={handleNameUpdate}
            onMouseEnter={(e) => handleMouseEnter(e, buttonHoverStyle)}
            onMouseLeave={(e) => handleMouseLeave(e, buttonStyle)}
          >
            Update Name
          </button>
        </div>

        {/* Update Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ fontWeight: "bold", marginBottom: 4 }}>
            Update Password
          </label>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => handleMouseEnter(e, focusGlowStyle)}
            onBlur={(e) => handleMouseLeave(e, inputStyle)}
          />
          <button
            type="button"
            style={buttonStyle}
            onClick={handlePasswordUpdate}
            onMouseEnter={(e) => handleMouseEnter(e, buttonHoverStyle)}
            onMouseLeave={(e) => handleMouseLeave(e, buttonStyle)}
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
