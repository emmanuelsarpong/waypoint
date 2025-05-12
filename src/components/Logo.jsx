import globe from "../assets/globe-white.svg";

function Logo({ isScrolled, size = "h-6 w-6" }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return isScrolled ? (
    <img
      src={globe}
      alt="Globe"
      onClick={scrollToTop}
      className={`${size} transition-transform transform hover:scale-110 cursor-pointer`}
      style={{
        transition: "transform 0.2s ease-in-out",
      }}
    />
  ) : (
    <span
      className="text-lg font-bold"
      style={{
        fontSize: "1.25rem",
        cursor: "default",
      }}
    >
      Waypoint
    </span>
  );
}

export default Logo;
