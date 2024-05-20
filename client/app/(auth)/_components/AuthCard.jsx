"use client";

import Logo from "@/images/tictrack-logo.svg";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const AuthCard = ({ authType }) => {
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState("trackee");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleAuth = async () => {
    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, userRole, action: authType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${authType}`);
      }

      const data = await response.json();
      // Use the userRole from the backend response
      localStorage.setItem("userRole", data.userRole);
      localStorage.setItem("name", name);
      localStorage.setItem("userId", data.userId);
      router.push("/");
    } catch (error) {
      setErrorMessage(error.message);
      console.error(`Error during ${authType}:`, error);
    }
  };

  return (
    <div className="relative bg-white w-full max-w-[600px] m-2 h-full max-h-[700px] py-16 px-8 rounded-[16px] flex flex-col">
      <div className="absolute top-7 right-7">
        <Image src={Logo} alt="logo" />
      </div>

      <div className="font-bold text-[24px]">
        {authType === "login" ? "Log In" : "Sign Up"}
      </div>

      <div className="my-16">
        <div>
          <div className="font-bold mb-2">Name</div>
          <input
            type="text"
            className="w-full bg-[#f1f1f1] border border-none rounded-lg px-4 py-3"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        {authType === "signup" && (
          <div className="mt-8">
            <div className="font-bold mb-2">Role</div>
            <select
              className="w-full bg-[#f1f1f1] border border-none rounded-lg px-4 py-3"
              onChange={(e) => setUserRole(e.target.value)}
              value={userRole}
            >
              <option value="trackee">Trackee</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
        )}

        <div className="mt-8">
          <div className="font-bold mb-2">Password</div>
          <input
            type="password"
            className="w-full bg-[#f1f1f1] border border-none rounded-lg px-4 py-3"
            placeholder="Enter your password"
          />
        </div>

        {errorMessage && (
          <div className="mt-4 text-red-500">{errorMessage}</div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleAuth}
          className="bg-[#FF5C5C] text-white rounded-lg px-6 py-2 self-start font-medium"
        >
          {authType === "login" ? "Log In" : "Sign Up"}
        </button>
      </div>

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
