import { useNavigate } from "react-router-dom";
import logoWhite from "../assets/logo-white.png";

function Logo({ isScrolled, size = "h-8 w-8" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div 
      className="flex items-center cursor-pointer transition-all duration-300 ease-in-out"
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Show logo image only when scrolled */}
      {isScrolled && (
        <img
          src={logoWhite}
          alt="Waypoint"
          className="transition-all duration-300"
          style={{
            height: "40px", // Increased from 32px to 40px
            width: "auto",
            transition: "all 0.3s ease-in-out",
          }}
        />
      )}
      
      {/* Show text only when NOT scrolled (at top) */}
      {!isScrolled && (
        <span
          className="text-white transition-all duration-300"
          style={{
            color: "white",
            fontWeight: "400", // Normal weight, not bold
            fontSize: "16px", // Reduced from 20px to 16px
            transition: "all 0.3s ease-in-out",
          }}
        >
          Waypoint
        </span>
      )}
    </div>
  );
}

export default Logo;
