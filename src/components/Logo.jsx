import { useNavigate } from "react-router-dom";

function Logo({ isScrolled, size = "h-6 w-6" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  const LocationPinLogo = ({ className }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        transition: "transform 0.2s ease-in-out",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <circle cx="50" cy="50" r="43" stroke="white" strokeWidth="8" />
      <path
        d="M50 20C36 20 28 31 28 43C28 58 50 82 50 82C50 82 72 58 72 43C72 31 64 20 50 20ZM50 48C44.4772 48 40 43.5228 40 38C40 32.4772 44.4772 28 50 28C55.5228 28 60 32.4772 60 38C60 43.5228 55.5228 48 50 48Z"
        fill="white"
      />
    </svg>
  );

  return isScrolled ? (
    <LocationPinLogo
      className={`${size} transition-transform transform hover:scale-110`}
    />
  ) : (
    <span
      className="text-lg font-bold cursor-pointer"
      onClick={handleClick}
      style={{
        fontSize: "1rem",
      }}
    >
      Waypoint
    </span>
  );
}

export default Logo;
