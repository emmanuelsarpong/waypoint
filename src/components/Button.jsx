// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function Button({ children, onClick, className = "", type = "button" }) {
  const buttonStyle = {
    backgroundColor: "#1F1F1F",
    color: "white",
    fontSize: "12px",
    padding: "10px 20px",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={className}
      style={buttonStyle}
      whileHover={{
        scale: 1.05,
        backgroundColor: "#3F3F3F",
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 },
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
}

export default Button;
