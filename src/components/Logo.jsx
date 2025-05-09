import globe from "../assets/globe-white.svg";

function Logo({ isScrolled, size = "h-6 w-6" }) {
  return isScrolled ? (
    <img
      src={globe}
      alt="Globe"
      className={`${size} transition duration-300`}
    />
  ) : (
    <span
      className="text-lg font-bold transition duration-300"
      style={{ fontSize: "1.25rem" }}
    >
      Waypoint
    </span>
  );
}

export default Logo;
