"use client";
import { useEffect, useState } from "react";
import TrackeeLogsModal from "@/app/(protected)/_components/TrackeeLogsModal";

const Trackies = () => {
  const [trackies, setTrackies] = useState([]);
  const [selectedTrackee, setSelectedTrackee] = useState(null);

  useEffect(() => {
    const fetchTrackies = async () => {
      try {
        const response = await fetch("http://localhost:8080/users");
        const data = await response.json();
        setTrackies(data.filter((user) => user.userRole === "trackee"));
      } catch (error) {
        console.error("Error fetching trackies:", error);
      }
    };

    fetchTrackies();
  }, []);

  const handleTrackeeSelect = (trackee) => {
    setSelectedTrackee(trackee);
  };

  const handleCloseModal = () => {
    setSelectedTrackee(null);
  };

  return (
    <div className="px-6 py-16">
      <div className="font-bold text-[#FF5C5C]">WEEK 1</div>
      <div className="font-bold text-[24px]">All Trackies</div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trackies.map((trackee) => (
          <div
            key={trackee.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100"
            onClick={() => handleTrackeeSelect(trackee)}
          >
            <h2 className="font-bold text-lg">{trackee.name}</h2>
            <p className="text-sm">
              Total Hours:{" "}
              {trackee.logs
                .reduce((acc, log) => acc + log.duration, 0)
                .toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {selectedTrackee && (
        <TrackeeLogsModal
          trackee={selectedTrackee}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Trackies;
