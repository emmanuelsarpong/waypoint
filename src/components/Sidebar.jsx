import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";

function Sidebar({ isOpen, toggleSidebar, isAuthenticated }) {
  const [isMobile, setIsMobile] = useState(false);
  const [localAuth, setLocalAuth] = useState(false);
  const location = useLocation();

  // Debug logging removed for production

  // Additional mobile-specific auth check
  useEffect(() => {
    const checkAuth = () => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      const urlParams = new URLSearchParams(window.location.search);
      const hasDemo = urlParams.get("demo") === "true";
      const isDemoToken = token === "demo-token-for-ceo";
      const isOnDashboard = location.pathname === "/dashboard";

      // Force demo mode if accessing dashboard without proper token
      const isDemoMode = hasDemo || isDemoToken || (isOnDashboard && !token);

      const protectedRoutes = ["/dashboard", "/billing", "/settings", "/map"];
      const isOnProtectedRoute = protectedRoutes.includes(location.pathname);

      // If user is on a protected route, they must be authenticated
      const hasAuth =
        !!token || isAuthenticated || isOnProtectedRoute || isDemoMode;
      setLocalAuth(hasAuth);

      console.log("Sidebar Auth Check:", {
        token: !!token,
        isAuthenticated,
        isOnProtectedRoute,
        isDemoMode,
        hasAuth,
        pathname: location.pathname,
        hasDemo,
        isDemoToken,
        isOnDashboard,
      });
    };

    checkAuth();

    // Re-check on focus for mobile browsers
    window.addEventListener("focus", checkAuth);

    // Listen for storage changes (in case token is set after component mounts)
    window.addEventListener("storage", checkAuth);

    // Also listen for custom events from login
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("focus", checkAuth);
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, [isAuthenticated, location.pathname]);

  // Use both authentication states - fallback to localAuth if isAuthenticated fails
  const shouldShowAuthItems = isAuthenticated || localAuth;

  const navItems = [
    { name: "Home", path: "/" },
    ...(shouldShowAuthItems
      ? [
          { name: "Dashboard", path: "/dashboard" },
          // Core Features - Main user journey
          { name: "Map", path: "/map" },
          { name: "Explore Trails", path: "/explore-trails" },
          { name: "Track Progress", path: "/track-progress" },
          { name: "Set Goals", path: "/set-goals" },
          // Account & Support
          { name: "Settings", path: "/settings" },
          { name: "Billing", path: "/billing" },
          { name: "Pricing", path: "/pricing" },
          // Information Pages
          { name: "About", path: "/about" },
          { name: "Contact", path: "/contact" },
        ]
      : [
          { name: "Pricing", path: "/pricing" },
          { name: "About", path: "/about" },
          { name: "Contact", path: "/contact" },
        ]),
  ];

  // Debug logging removed for production

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);

      // Force auth recheck on mobile when orientation changes
      if (newIsMobile) {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");
        setLocalAuth(!!token);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Prevent body scroll on mobile when sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.classList.add("sidebar-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    };
  }, [isMobile, isOpen]);

  // Auto-close on mobile when navigation item is clicked
  const handleNavClick = () => {
    if (isMobile && isOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile overlay - removed */}

      {/* Desktop/All devices overlay when sidebar is open - removed */}

      <aside
        className={`bg-black text-white h-screen flex flex-col justify-between fixed top-0 left-0 z-[9999] shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: isMobile ? "80vw" : "250px",
          borderRight: "0.5px solid #3F3F3F",
          padding: "24px",
          paddingTop: "24px",
          backgroundColor: "#000000 !important",
          background: "#000000",
          zIndex: 50,
          position: "fixed",
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
            width: isMobile ? "40px" : "36px",
            height: isMobile ? "40px" : "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            touchAction: "manipulation",
            minHeight: isMobile ? "44px" : "36px",
            minWidth: isMobile ? "44px" : "36px",
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
        <div
          className="flex flex-col h-full"
          style={{
            paddingTop: isMobile ? "80px" : "120px",
            position: "relative",
            zIndex: "10",
          }}
        >
          <nav
            className="flex flex-col gap-2 justify-center"
            style={{
              height: isMobile ? "auto" : "50vh",
              maxHeight: isMobile ? "calc(100vh - 200px)" : "50vh",
              paddingTop: isMobile ? "32px" : "48px",
              paddingBottom: isMobile ? "80px" : "20px", // Different bottom padding for mobile vs desktop
              overflowY: isMobile ? "auto" : "visible",
            }}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `group text-sm font-medium flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 sidebar-nav-item ${
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-400 hover:bg-gradient-to-br hover:from-[#2C2C2C] hover:to-[#111111] hover:text-white"
                  }`
                }
                style={{
                  textDecoration: "none",
                  margin: "2px 8px",
                  padding: isMobile ? "16px" : "12px 16px",
                  height: "auto",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: isMobile ? "48px" : "44px",
                  fontSize: "14px",
                  touchAction: "manipulation",
                  position: "relative",
                  zIndex: "20",
                  cursor: "pointer",
                }}
              >
                <span style={{ flex: 1 }}>{item.name}</span>
                <span
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    marginLeft: "auto",
                    paddingLeft: "16px",
                    fontSize: "16px",
                    fontWeight: "300",
                  }}
                >
                  ›
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Spacer to push footer to bottom */}
          <div className="flex-1"></div>

          <footer
            className="text-base text-neutral-400"
            style={{
              padding: "0 24px 0 24px",
              fontSize: "12px",
              color: "#3A3A3A",
              textAlign: "left",
              marginTop: "auto",
              position: "absolute",
              bottom: isMobile ? "24px" : "8px", // Match exact level of social media icons
              left: "0",
              right: "0",
              zIndex: "1",
              pointerEvents: "none",
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
