import { useState, useEffect } from "react";
import Logo from "./Logo";
import Button from "./Button";
import showIcon from "../assets/show.svg";
import closeIcon from "../assets/close.svg";

function Topbar({ toggleSidebar }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
    toggleSidebar();
  };

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
        borderBottom: "0.5px solid #3F3F3F", // Add border-bottom
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Logo isScrolled={isScrolled} />
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
          }}
        >
          <img
            src={isSidebarOpen ? closeIcon : showIcon}
            alt="Toggle Sidebar"
            className="w-6 h-6 group-hover:filter group-hover:brightness-0 group-hover:invert"
          />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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