import AuthForm from "../components/Authform";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
      <AuthForm mode="login" />
    </div>
  );
}
