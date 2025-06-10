import React, { useState } from "react";

function Contact() {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "700px",
    width: "100%",
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
  };

  const focusGlowStyle = {
    borderColor: "#ff7eb3",
    boxShadow: "0 0 0 .5px rgba(255, 126, 179, 0.5)",
  };

  const buttonStyle = {
    display: "block",
    width: "100%",
    padding: "12px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "1px solid #3f3f3f",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#333",
    transform: "scale(1.02)",
  };

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleMouseEnter = (e, style) => {
    Object.assign(e.target.style, style);
  };

  const handleMouseLeave = (e, style) => {
    Object.assign(e.target.style, style);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch("http://localhost:3000/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "contact_us",
          firstName: form.name, 
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Message sent!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus(data.error || "Failed to send.");
      }
    } catch {
      setStatus("Failed to send.");
    }
  };

  return (
    <div
      style={{
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        backgroundColor: "#000",
        color: "#fff",
        marginBottom: "455px", 
      }}
    >
      <form style={containerStyle} onSubmit={handleSubmit}>
        <h1 style={headingStyle}>Contact Us</h1>
        <p style={subtextStyle}>
          We'd love to hear from you. Fill out the form below to get in touch.
        </p>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
          onFocus={(e) => handleMouseEnter(e, focusGlowStyle)}
          onBlur={(e) => handleMouseLeave(e, inputStyle)}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
          onFocus={(e) => handleMouseEnter(e, focusGlowStyle)}
          onBlur={(e) => handleMouseLeave(e, inputStyle)}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          rows="5"
          style={{
            ...inputStyle,
            resize: "none",
          }}
          onFocus={(e) => handleMouseEnter(e, focusGlowStyle)}
          onBlur={(e) => handleMouseLeave(e, inputStyle)}
        />
        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={(e) => handleMouseEnter(e, buttonHoverStyle)}
          onMouseLeave={(e) =>
            handleMouseLeave(e, {
              backgroundColor: "#1a1a1a",
              transform: "scale(1)",
            })
          }
        >
          Send Message
        </button>
        {status && (
          <p
            style={{
              color: status === "Message sent!" ? "#4ade80" : "#ff758c",
              marginTop: 8,
            }}
          >
            {status}
          </p>
        )}
      </form>
    </div>
  );
}

export default Contact;
