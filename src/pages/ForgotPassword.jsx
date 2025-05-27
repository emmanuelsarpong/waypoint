import AuthForm from "../components/AuthForm";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm mode="forgot-password" />
    </div>
  );
}
