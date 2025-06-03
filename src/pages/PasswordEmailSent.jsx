import React from "react";
import AuthForm from "../components/AuthForm";
import { useLocation } from "react-router-dom";

export default function PasswordEmailSent() {
  const location = useLocation();
  const forgotResult = location.state?.forgotResult || null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <AuthForm mode="password-email-sent" forgotResult={forgotResult} />
      </div>
    </div>
  );
}