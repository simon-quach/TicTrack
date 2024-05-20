"use client";
import { useEffect, useState } from "react";

const Trackies = () => {
  const [trackies, setTrackies] = useState([]);
  const [selectedTrackie, setSelectedTrackie] = useState(null);

  useEffect(() => {
    const fetchTrackies = async () => {
      try {
        const response = await fetch("http://localhost:8080/users");
        const data = await response.json();
        setTrackies(data);
      } catch (error) {
        console.error("Error fetching trackies:", error);
      }
    };

    fetchTrackies();
  }, []);

  const handleTrackieSelect = (trackie) => {
    setSelectedTrackie(trackie);
  };

  return (
    <div className="p-4">
      <h1>All Trackies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trackies.map((trackie) => (
          <div
            key={trackie.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer"
            onClick={() => handleTrackieSelect(trackie)}
          >
            <h2 className="font-bold">{trackie.name}</h2>
            <p>
              Total Hours:{" "}
              {trackie.logs
                .reduce((acc, log) => acc + log.duration, 0)
                .toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {selectedTrackie && (
        <div className="mt-8">
          <h2>Logs for {selectedTrackie.name}</h2>
          <ul>
            {selectedTrackie.logs.map((log, index) => (
              <li key={index}>
                {new Date(log.startTime.seconds * 1000).toLocaleString()} -{" "}
                {new Date(log.endTime.seconds * 1000).toLocaleString()} :{" "}
                {log.duration.toFixed(2)} hours
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Trackies;
