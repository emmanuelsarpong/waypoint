import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // Force reload so App picks up new token and updates isAuthenticated
      window.location.href = "/dashboard";
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Processing login...</p>;
}
