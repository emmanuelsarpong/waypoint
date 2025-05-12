import { useState } from "react";

export default function AuthForm({ mode = "login" }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${mode} with email: ${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="w-full max-w-[1200px] flex flex-col items-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-black mb-8">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-5 py-3 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-black text-white font-semibold hover:bg-neutral-800 transition"
            >
              Continue
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-5">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <a href="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Log in
                </a>
              </>
            )}
          </p>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="space-y-3">
            <OAuthButton icon="/google-icon.svg" text="Continue with Google" />
            <OAuthButton
              icon="/microsoft-icon.svg"
              text="Continue with Microsoft Account"
            />
            <OAuthButton icon="/apple-icon.svg" text="Continue with Apple" />
            <OAuthButton icon="/phone-icon.svg" text="Continue with phone" />
          </div>

          <div className="text-xs text-gray-400 text-center mt-6 space-x-2">
            <a href="#" className="hover:underline">
              Terms of Use
            </a>
            <span>|</span>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function OAuthButton({ icon, text }) {
  return (
    <button className="w-full flex items-center gap-3 justify-center py-2.5 px-4 border border-gray-300 rounded-full hover:bg-gray-100 transition text-sm font-medium text-black">
      <img src={icon} alt="" className="w-5 h-5" />
      <span>{text}</span>
    </button>
  );
}
