import { NavLink } from "react-router-dom";
import Logo from "./Logo";

function Sidebar({ isScrolled, isOpen, toggleSidebar }) {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Pricing", path: "/pricing" },
    { name: "Product", path: "/product" },
  ];

  return (
    <aside
      className={`bg-black text-white w-[250px] h-screen flex flex-col justify-between p-5 fixed top-0 left-0 z-20 shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        paddingTop: "200px", 
      }}
    >
      {/* Logo or Title */}
      <div
        className="flex flex-col gap-8"
        style={{ display: "none" }} 
      >
        <div className="mb-5 flex items-center justify-between">
          {isScrolled ? (
            <Logo size="h-8" />
          ) : (
            <h1 className="text-2xl font-extrabold tracking-tight">Waypoint</h1>
          )}
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="text-white bg-neutral-700 p-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group text-base font-medium flex items-center justify-between px-5 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-400 hover:bg-gradient-to-br hover:from-[#2C2C2C] hover:to-[#111111] hover:text-white"
              }`
            }
            style={{
              textDecoration: "none",
              margin: "5px 80px 5px 5px",
              padding: "20px 25px 24px 20px",
              height: "25px",
              borderRadius: "8px",
            }}
          >
            <span>{item.name}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              ›
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <footer
        className="text-base text-neutral-400 px-5 py-3 mt-5"
        style={{
          padding: "24px",
          fontSize: "14px",
          color: "#3A3A3A",
        }}
      >
        © 2025 Waypoint. All rights reserved.
      </footer>
    </aside>
  );
}

export default Sidebar;
