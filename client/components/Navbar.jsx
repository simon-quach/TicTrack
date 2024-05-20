"use client";
import { useState } from "react";
import Image from "next/image";
import Logo from "@/images/tictrack-logo.svg";
import Profile from "@/images/profile.svg";
import ProfileModal from "@/app/(protected)/_components/ProfileModal";
import Link from "next/link";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);

  const handleProfileClick = () => {
    setShowModal(true);
  };

  return (
    <div className="h-[96px] bg-white flex items-center sm:px-8 px-6">
      <div className="flex items-center justify-between w-full">
        <Link href="/" className="flex">
          <Image src={Logo} alt="logo" />
          <div className="font-bold text-[20px] mx-4 sm:block hidden">
            <span className="text-[#FF5C5C]">T</span>ic
            <span className="text-[#FF5C5C]">T</span>rack
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/trackies"
            className="bg-[#FF5C5C] text-white font-medium px-4 py-2 rounded mr-4 hover:bg-[#e95c5c] hover:cursor-pointer"
          >
            Trackies
          </Link>
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
