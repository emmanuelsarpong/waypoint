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
import PageSpinner from "./components/PageSpinner";
import MapPage from "./pages/MapPage";

function App() {
  // Initialize sidebar state - always closed on mobile, open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const location = useLocation();

  // Handle window resize and set initial sidebar state
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setSidebarOpen(false); // Always close on mobile
      }
      // On desktop, we don't auto-open anymore - let user control it
    };

    window.addEventListener('resize', handleResize);
    // Initial check on mount
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
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
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    setLoadingUser(true);
    authFetch("/user/profile")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 401) {
          // Token is invalid, remove it
          localStorage.removeItem("token");
          return null;
        }
        return null;
      })
      .then((data) => {
        setUser(data);
        setLoadingUser(false);
      })
      .catch(() => {
        setUser(null);
        setLoadingUser(false);
      });
  }, [location]);

  if (loadingUser) {
    return <PageSpinner />;
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
      className={`h-screen flex flex-col ${
        isAuthPage ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      {!isAuthPage && (
        <div className="flex h-full">
          <Sidebar
            isOpen={sidebarOpen}
            toggleSidebar={() => setSidebarOpen((prev) => !prev)}
            isAuthenticated={!!user}
          />

          <Topbar
            toggleSidebar={() => setSidebarOpen((prev) => !prev)}
            isAuthenticated={!!user}
            onLogout={() => setUser(null)}
            sidebarOpen={sidebarOpen}
          />

          {/* Main content wrapper */}
          <div
            className="w-full transition-all duration-300 relative flex flex-col h-full"
            style={{
              marginLeft:
                typeof window !== 'undefined' && window.innerWidth <= 768
                  ? "0px"
                  : sidebarOpen
                  ? "250px"
                  : "0px",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <main className="mt-[70px] flex-1 flex flex-col">
              {/* Special handling for map route - no container constraints */}
              {location.pathname === "/map" ? (
                <div className="flex-1 w-full h-full flex flex-col">
                  <div className="flex-1">
                    <Routes>
                      <Route path="/map" element={<MapPage />} />
                    </Routes>
                  </div>
                  {/* Footer for map page */}
                  <div className="w-full flex justify-center py-4 bg-black bg-opacity-80 backdrop-blur-sm">
                    <SocialMediaBar />
                  </div>
                </div>
              ) : (
                <>
                  {/* This container centers all content with responsive padding */}
                  <div
                    className="w-full max-w-[1200px] mx-auto flex-1 flex flex-col"
                    style={{
                      paddingLeft: window.innerWidth <= 768 ? "16px" : "24px",
                      paddingRight: window.innerWidth <= 768 ? "16px" : "24px",
                    }}
                  >
                    <div className="flex-1 pb-24">
                      <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route
                          path="/pricing"
                          element={<Pricing user={user} />}
                        />
                        <Route
                          path="/dashboard"
                          element={<Dashboard user={user} />}
                        />
                        <Route
                          path="/billing"
                          element={
                            <ProtectedRoute>
                              <Billing user={user} />
                            </ProtectedRoute>
                          }
                        />
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
                        <Route
                          path="/oauth/callback"
                          element={<OAuthCallback />}
                        />
                      </Routes>
                    </div>

                    {/* Footer always at bottom */}
                    <div className="mt-auto pt-12 pb-8">
                      <SocialMediaBar />
                    </div>
                  </div>
                </>
              )}
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
