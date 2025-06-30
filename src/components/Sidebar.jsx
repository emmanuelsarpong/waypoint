import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";

function Sidebar({ isOpen, toggleSidebar, isAuthenticated }) {
  const [isMobile, setIsMobile] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    ...(isAuthenticated
      ? [
          { name: "Dashboard", path: "/dashboard" },
          { name: "Map", path: "/map" },
          { name: "Settings", path: "/settings" },
          { name: "Billing", path: "/billing" },
        ]
      : []),
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Auto-close on mobile when navigation item is clicked
  const handleNavClick = () => {
    if (isMobile && isOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Dark Overlay - Mobile only */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 transition-all duration-300"
          onClick={toggleSidebar}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        />
      )}

      <aside
        className={`bg-black text-white h-screen flex flex-col justify-between fixed top-0 left-0 z-40 shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: isMobile ? "80vw" : "250px",
          borderRight: "0.5px solid #3F3F3F",
          padding: "24px",
          paddingTop: "24px",
          // Force solid black background
          backgroundColor: "#000000 !important",
          background: "#000000",
        }}
      >
        {/* Close button - Top right corner */}
        <button
          onClick={toggleSidebar}
          className="absolute top-6 right-6 z-50 group"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.2)";
            e.target.style.transform = "rotate(90deg)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.1)";
            e.target.style.transform = "rotate(0deg)";
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transition: "all 0.2s ease-in-out",
            }}
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Navigation content */}
        <div className="flex flex-col h-full" style={{ paddingTop: "60px" }}>
          <nav className="flex flex-col gap-6 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `group text-base font-medium flex items-center justify-between px-5 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-400 hover:bg-gradient-to-br hover:from-[#2C2C2C] hover:to-[#111111] hover:text-white"
                  }`
                }
                style={{
                  textDecoration: "none",
                  margin: "5px 5px 5px 5px",
                  padding: "20px 20px 20px 20px",
                  height: "auto",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: "60px",
                }}
              >
                <span style={{ flex: 1 }}>{item.name}</span>
                <span
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    marginLeft: "auto",
                    paddingLeft: "20px",
                    fontSize: "18px",
                    fontWeight: "300",
                  }}
                >
                  ›
                </span>
              </NavLink>
            ))}
          </nav>

          <footer
            className="text-base text-neutral-400 px-5 py-3"
            style={{
              padding: "24px",
              fontSize: "14px",
              color: "#3A3A3A",
            }}
          >
            © 2025 Waypoint. All rights reserved.
          </footer>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
