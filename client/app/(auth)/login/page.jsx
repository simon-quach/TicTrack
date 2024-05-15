import AuthCard from "@/app/(auth)/_components/AuthCard";

const Login = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <AuthCard authType="login" />
    </div>
  );
};

export default Login;
