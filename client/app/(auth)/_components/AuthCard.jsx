import Logo from "@/images/tictrack-logo.svg";
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import Link from "next/link";

const AuthCard = ({ authType }) => {
  return (
    <div className="relative bg-white w-full max-w-[600px] m-2 h-full max-h-[700px] py-16 px-8 rounded-[16px] flex flex-col">
      <div className="absolute top-7 right-7">
        <Image src={Logo} />
      </div>

      <div className="font-bold text-[24px]">
        {authType === "login" ? "Log In" : "Sign Up"}
      </div>

      <div className="my-16">
        <div>
          <div className="font-bold mb-2">Email</div>
          <input
            type="email"
            className="w-full bg-[#f1f1f1] border border-none rounded-lg px-4 py-3"
            placeholder="Enter your email"
          />
        </div>

        <div className="mt-8">
          <div className="font-bold mb-2">Password</div>
          <input
            type="password"
            className="w-full bg-[#f1f1f1] border border-none rounded-lg px-4 py-3"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <button className="bg-[#FF5C5C] text-white rounded-lg px-6 py-2 self-start font-medium">
        {authType === "login" ? "Log in" : "Sign Up"}
      </button>

      <div className="text-center mt-auto">
        {authType === "login"
          ? "Don't have an account? "
          : "Already have an account? "}
        <Link
          className="text-[#FF5C5C] underline"
          href={authType === "login" ? "/signup" : "/login"}
        >
          {authType === "login" ? "Sign up here!" : "Log in here!"}
        </Link>
      </div>
    </div>
  );
};

export default AuthCard;
