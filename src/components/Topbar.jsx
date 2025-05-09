import { useState, useEffect } from "react";
import Logo from "./Logo";
import Button from "./Button"; 
function Topbar({ toggleSidebar }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20); 
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 40,
        width: "100%",
        height: "70px",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "black",
        color: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Use the Logo component */}
        <Logo isScrolled={isScrolled} />
        {/* Toggle Sidebar Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-neutral-400 hover:text-white transition-colors duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Login Button */}
        <Button
          onClick={() => console.log("Login clicked")}
          className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
        >
          Login
        </Button>
      </div>
    </header>
  );
}

export default Topbar;
