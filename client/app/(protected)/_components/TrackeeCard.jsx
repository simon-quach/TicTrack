import Image from "next/image";

import Profile from "@/images/profile.svg";
import StopButton from "@/images/stop-button.svg";

const TrackeeCard = () => {
  return (
    <div className="bg-white rounded-[16px] flex px-4 py-8 shadow-sm">
      <Image className="w-12" src={Profile} />
      <div className="ml-4">
        <div className="font-bold text-[#FF5C5C]">Judy Jeong</div>
        <div>Study Hours</div>
      </div>

      <div className="flex items-center ml-auto gap-4">
        <div className="font-bold">00:01:17</div>
        <Image className="w-8" src={StopButton} />
      </div>
    </div>
  );
};

export default TrackeeCard;
