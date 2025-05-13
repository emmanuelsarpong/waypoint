import AuthForm from "../components/Authform";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm mode="login" />
    </div>
  );
}
