import AuthForm from "../components/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [email] = useState("");
  const [password] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const res = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard"); 
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <AuthForm mode="login" onSubmit={handleLogin} />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
