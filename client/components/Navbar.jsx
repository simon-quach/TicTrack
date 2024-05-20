"use client";
import { useState } from "react";
import Image from "next/image";
import Logo from "@/images/tictrack-logo.svg";
import Profile from "@/images/profile.svg";
import ProfileModal from "@/app/(protected)/_components/ProfileModal";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);

  const handleProfileClick = () => {
    setShowModal(true);
  };

  return (
    <div className="h-[96px] bg-white flex items-center sm:px-8 px-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex">
          <Image src={Logo} alt="logo" />
          <div className="font-bold text-[20px] mx-4 sm:block hidden">
            <span className="text-[#FF5C5C]">T</span>ic
            <span className="text-[#FF5C5C]">T</span>rack
          </div>
        </div>

        <div className="flex gap-6">
          <Image
            className="w-10 hover:cursor-pointer"
            src={Profile}
            alt="profile"
            onClick={handleProfileClick}
          />
        </div>
      </div>

      <ProfileModal showModal={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Navbar;
