"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ProfileModal = ({ showModal, onClose }) => {
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userName = localStorage.getItem("name");
    const userRole = localStorage.getItem("userRole");
    setName(userName);
    setUserRole(userRole);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl mb-4">Profile</h2>
        <div>
          <strong>Name:</strong> {name}
        </div>
        <div>
          <strong>Role:</strong> {userRole}
        </div>
        <div className="mt-4">
          <button
            onClick={onClose}
            className="bg-[#FF5C5C] text-white px-4 py-2 rounded mr-4"
          >
            Close
          </button>
          <button
            onClick={handleSignOut}
            className="border-[#FF5C5C] border-[1px] text-[#FF5C5C] px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
