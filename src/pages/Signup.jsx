import AuthForm from "../components/Authform";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm mode="signup" />
    </div>
  );
}
