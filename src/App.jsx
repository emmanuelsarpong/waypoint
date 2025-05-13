import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import TrailsPage from "./pages/TrailsPage";
import GPSGoalsPage from "./pages/GPSGoalsPage";
import MovementAnalysisPage from "./pages/MovementAnalysisPage";
import Topbar from "./components/Topbar";
import SocialMediaBar from "./components/SocialMediaBar";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const path = location.pathname;

    // Set background and text color dynamically
    if (path === "/login" || path === "/signup") {
      document.body.style.backgroundColor = "#f9f9f9";
      document.body.style.color = "#000000"; // Black text for login/signup pages
    } else {
      document.body.style.backgroundColor = "#000000";
      document.body.style.color = "#ffffff"; // White text for other pages
    }
  }, [location]);

  // Check if the current route is login or signup
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div
      className={`min-h-screen ${
        isAuthPage ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      {!isAuthPage && (
        <div className="flex">
          <Sidebar
            isScrolled={isScrolled}
            isOpen={sidebarOpen}
            toggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />

          <div
            className={`flex flex-col flex-1 ${
              sidebarOpen ? "ml-[250px]" : "ml-0"
            } transition-all duration-300`}
          >
            <Topbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

            <main
              className="mt-[70px] w-full max-w-[1200px] mx-auto px-6"
              style={{
                paddingLeft: "25px",
                paddingRight: "25px",
              }}
            >
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/trails" element={<TrailsPage />} />
                <Route path="/gps-goals" element={<GPSGoalsPage />} />
                <Route
                  path="/movement-analysis"
                  element={<MovementAnalysisPage />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Social Media Bar */}
              <div style={{ marginTop: "150px" }}>
                <SocialMediaBar />
              </div>
            </main>
          </div>
        </div>
      )}

      {isAuthPage && (
        <main className="w-full h-screen flex items-center justify-center">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      )}
    </div>
  );
}

export default App;
