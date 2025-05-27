import React from "react";

export default function CheckEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black">Check your email</h2>
        <p className="text-black">
          We’ve sent a link to your email. Please check your inbox and follow
          the instructions.
        </p>
      </div>
    </div>
  );
}
