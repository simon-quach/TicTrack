"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Profile from "@/images/profile.svg";
import StopButton from "@/images/stop-button.svg";

const TrackeeCard = ({ id, userName, timeStarted, userRole, onDelete }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const calculateElapsedTime = () => {
      const startTime = new Date(timeStarted).getTime();
      const currentTime = Date.now();
      const timeDiffInSeconds = Math.floor((currentTime - startTime) / 1000);
      setElapsedTime(timeDiffInSeconds);
    };

    calculateElapsedTime(); // Initial calculation
    const interval = setInterval(calculateElapsedTime, 1000); // Update every second

    return () => clearInterval(interval); // Clean up on unmount
  }, [timeStarted]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStopClick = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activeTrackies/stop`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, timeStopped: new Date().toISOString() }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Trackie stopped successfully:", data);
        onDelete(id); // Call the onDelete callback
      } else {
        const errorData = await response.json();
        console.error("Failed to stop the trackie:", errorData);
      }
    } catch (error) {
      console.error("Error stopping trackie:", error);
    }
  };

  return (
    <div className="bg-white rounded-[16px] flex px-4 py-8 shadow-sm">
      <Image className="w-12" src={Profile} alt="profile" />
      <div className="ml-4">
        <div className="font-bold text-[#FF5C5C]">{userName}</div>
        <div>Study Hours</div>
      </div>

      <div className="flex items-center ml-auto gap-4">
        <div className="font-bold">{formatTime(elapsedTime)}</div>
        {userRole === "supervisor" && (
          <Image
            className="w-8 hover:cursor-pointer"
            src={StopButton}
            alt="stop-button"
            onClick={handleStopClick}
          />
        )}
      </div>
    </div>
  );
};

export default TrackeeCard;
