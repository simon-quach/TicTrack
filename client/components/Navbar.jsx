import Image from "next/image";
import Logo from "@/images/tictrack-logo.svg";
import Profile from "@/images/profile.svg";
import Notification from "@/images/notification.svg";

const Navbar = () => {
  return (
    <div className="h-[96px] bg-white flex items-center sm:px-8 px-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex">
          <Image src={Logo} />
          <div className="font-bold text-[20px] mx-4 sm:block hidden">
            <span className="text-[#FF5C5C]">T</span>ic
            <span className="text-[#FF5C5C]">T</span>rack
          </div>
        </div>

        <div className="flex gap-6">
          <Image className="w-6" src={Notification} />
          <Image className="w-10" src={Profile} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
