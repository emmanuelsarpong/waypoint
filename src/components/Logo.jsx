import globe from "../assets/globe-white.svg";
import { useNavigate } from "react-router-dom";

function Logo({ isScrolled, size = "h-6 w-6" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return isScrolled ? (
    <img
      src={globe}
      alt="Globe"
      onClick={handleClick}
      className={`${size} transition-transform transform hover:scale-110 cursor-pointer`}
      style={{
        transition: "transform 0.2s ease-in-out",
      }}
    />
  ) : (
    <span
      className="text-lg font-bold cursor-pointer"
      onClick={handleClick}
      style={{
        fontSize: "1.25rem",
      }}
    >
      Waypoint
    </span>
  );
}

export default Logo;
