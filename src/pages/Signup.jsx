import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignupSuccess = () => {
    navigate("/check-email");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm mode="signup" onSuccess={handleSignupSuccess} />
    </div>
  );
}
