import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import TrailsPage from "./pages/TrailsPage";
import GPSGoalsPage from "./pages/GPSGoalsPage";
import MovementAnalysisPage from "./pages/MovementAnalysisPage";
import Topbar from "./components/Topbar";
import SocialMediaBar from "./components/SocialMediaBar";
import CheckEmail from "./pages/CheckEmail";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import PasswordEmailSent from "./pages/PasswordEmailSent";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import OAuthCallback from "./pages/OAuthCallback";
import { authFetch } from "./utils/authFetch";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    const isAuth =
      path === "/login" ||
      path === "/signup" ||
      path === "/forgot-password" ||
      path === "/check-email" ||
      path === "/verify-email" ||
      path === "/password-email-sent" ||
      path === "/reset-password";
    if (isAuth) {
      document.body.style.backgroundColor = "#f9f9f9";
      document.body.style.color = "#000000";
      document.body.classList.add("auth-page");
    } else {
      document.body.style.backgroundColor = "#000000";
      document.body.style.color = "#ffffff";
      document.body.classList.remove("auth-page");
    }
  }, [location]);

  useEffect(() => {
    setLoadingUser(true);
    authFetch(`${backendUrl}/user/profile`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data);
        setLoadingUser(false);
      })
      .catch(() => setLoadingUser(false));
  }, [location]);

  if (loadingUser) {
    return <div style={{ color: "#fff", padding: 40 }}>Loading user...</div>;
  }

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/check-email" ||
    location.pathname === "/verify-email" ||
    location.pathname === "/password-email-sent" ||
    location.pathname === "/reset-password";

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
            isAuthenticated={!!user}
          />

          <div
            className={`flex flex-col flex-1 ${
              sidebarOpen ? "ml-[250px]" : "ml-0"
            } transition-all duration-300`}
          >
            <Topbar
              toggleSidebar={() => setSidebarOpen((prev) => !prev)}
              isAuthenticated={!!user}
              onLogout={() => setUser(null)}
            />

            <main
              className="mt-[70px] w-full max-w-[1200px] mx-auto px-6"
              style={{
                paddingLeft: "25px",
                paddingRight: "25px",
              }}
            >
              <Routes>
                <Route path="/" element={user ? <Dashboard user={user} /> : <Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/billing" element={<Billing user={user} />} />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route path="/trails" element={<TrailsPage />} />
                <Route path="/gps-goals" element={<GPSGoalsPage />} />
                <Route
                  path="/movement-analysis"
                  element={<MovementAnalysisPage />}
                />
                <Route path="*" element={<NotFound />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />
              </Routes>

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
            <Route path="/check-email" element={<CheckEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/password-email-sent"
              element={<PasswordEmailSent />}
            />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </main>
      )}
    </div>
  );
}

export default App;
