function Button({ children, onClick, className = "", type = "button" }) {
  const buttonStyle = {
    backgroundColor: "#1F1F1F",
    color: "white",
    fontSize: "12px", 
    padding: "10px 20px", 
    borderRadius: "9999px", 
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const hoverStyle = {
    backgroundColor: "#3F3F3F", 
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      style={buttonStyle}
      onMouseOver={(e) =>
        (e.target.style.backgroundColor = hoverStyle.backgroundColor)
      }
      onMouseOut={(e) =>
        (e.target.style.backgroundColor = buttonStyle.backgroundColor)
      }
    >
      {children}
    </button>
  );
}

export default Button;
