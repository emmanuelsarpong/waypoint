function Contact() {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
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
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    width: "100%",
  };

  const inputHoverFocusStyle = {
    borderColor: "#10b981",
    boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.5)",
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

  const handleMouseEnter = (e, style) => {
    Object.assign(e.target.style, style);
  };

  const handleMouseLeave = (e, style) => {
    Object.assign(e.target.style, style);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        height: "calc(100vh - 300px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <form style={containerStyle} onSubmit={handleSubmit}>
        <h1 style={headingStyle}>Contact Us</h1>
        <p style={subtextStyle}>
          We'd love to hear from you. Fill out the form below to get in touch.
        </p>
        <input
          type="text"
          placeholder="Your Name"
          style={inputStyle}
          onMouseEnter={(e) => handleMouseEnter(e, inputHoverFocusStyle)}
          onMouseLeave={(e) => handleMouseLeave(e, { borderColor: "#3f3f3f" })}
        />
        <input
          type="email"
          placeholder="Your Email"
          style={inputStyle}
          onMouseEnter={(e) => handleMouseEnter(e, inputHoverFocusStyle)}
          onMouseLeave={(e) => handleMouseLeave(e, { borderColor: "#3f3f3f" })}
        />
        <textarea
          placeholder="Your Message"
          rows="5"
          style={{
            ...inputStyle,
            resize: "none",
          }}
          onMouseEnter={(e) => handleMouseEnter(e, inputHoverFocusStyle)}
          onMouseLeave={(e) => handleMouseLeave(e, { borderColor: "#3f3f3f" })}
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
      </form>
    </div>
  );
}

export default Contact;
