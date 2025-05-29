import React from "react";
import AuthForm from "../components/AuthForm";

export default function CheckEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <AuthForm mode="check-email" />
      </div>
    </div>
  );
}
