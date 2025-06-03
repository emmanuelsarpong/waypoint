import { useSearchParams } from "react-router-dom";
import AuthForm from "../components/AuthForm";

export default function CreatePassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center max-w-md mx-auto">
          <h2>Invalid or missing token</h2>
          <p>Please use the link sent to your email.</p>
        </div>
      </div>
    );
  }

  return <AuthForm mode="reset-password" token={token} />;
}
