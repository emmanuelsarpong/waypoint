function About() {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "calc(100vh - 300px)", // Reduced height
    textAlign: "center",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const paragraphStyle = {
    fontSize: "1.125rem",
    lineHeight: "1.8",
    maxWidth: "800px",
    marginBottom: "20px",
    color: "#9ca3af",
  };

  const highlightStyle = {
    background: "linear-gradient(90deg, #ff7eb3, #ff758c, #a29bfe)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>About Us</h1>
      <p style={paragraphStyle}>
        Welcome to <span style={highlightStyle}>Waypoint</span>, your trusted
        partner in navigating the digital landscape. Our mission is to empower
        individuals and businesses with innovative solutions that drive growth
        and success.
      </p>
      <p style={paragraphStyle}>
        At <span style={highlightStyle}>Waypoint</span>, we believe in the power
        of technology to transform lives. With a dedicated team of experts, we
        strive to deliver exceptional services tailored to meet your unique
        needs.
      </p>
      <p style={paragraphStyle}>
        Join us on this journey as we explore new horizons and create
        meaningful impact together.
      </p>
    </div>
  );
}

export default About;