import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import showIcon from "../assets/hide.svg";
import closeIcon from "../assets/show.svg";

function Topbar({ toggleSidebar, isAuthenticated, onLogout, sidebarOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Additional check for demo mode or token presence
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token");
  const isDemoMode =
    token === "demo-token-for-ceo" ||
    window.location.search.includes("demo=true");
  const shouldShowLogout = isAuthenticated || isDemoMode || !!token;

  // Debug authentication state (dev only)
  if (import.meta.env.DEV) {
    console.log("Topbar - isAuthenticated:", isAuthenticated);
    console.log(
      "Topbar - token:",
      !!token,
      "isDemoMode:",
      isDemoMode,
      "shouldShowLogout:",
      shouldShowLogout
    );
  }

  useEffect(() => {
    const handleScroll = () => {
      // Disable scroll effect on mobile devices
      if (window.innerWidth <= 768) {
        setIsScrolled(false);
        return;
      }
      setIsScrolled(window.scrollY > 0);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Reset scroll state when switching to mobile
      if (window.innerWidth <= 768) {
        setIsScrolled(false);
      }
    };

    // Initial check
    handleScroll();
    handleResize();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleToggle = () => {
    toggleSidebar();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10000,
          width: "100%",
          height: "70px",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "black",
          color: "white",
          borderBottom: "0.5px solid #3F3F3F",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {isScrolled ? (
            <img
              src="/favicon.svg"
              alt="Waypoint Logo"
              style={{ height: "32px", width: "auto" }}
            />
          ) : (
            <span
              style={{
                fontWeight: 400,
                fontSize: "1rem",
                color: "white",
              }}
            >
              Waypoint
            </span>
          )}

          <button
            onClick={handleToggle}
            className="focus:outline-none group"
            aria-label="Toggle Sidebar"
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <img
              src={sidebarOpen ? closeIcon : showIcon}
              alt="Toggle Sidebar"
              className="w-6 h-6 group-hover:filter group-hover:brightness-0 group-hover:invert"
            />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {shouldShowLogout ? (
            <Button
              onClick={handleLogout}
              className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
            >
              Login
            </Button>
          )}
        </div>
      </header>
    </>
  );
}

export default Topbar;
