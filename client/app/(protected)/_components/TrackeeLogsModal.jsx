import { useEffect } from "react";

const TrackeeLogsModal = ({ trackee, onClose }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!trackee) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Logs for {trackee.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <ul className="space-y-2">
          {trackee.logs.map((log, index) => (
            <li
              key={index}
              className="p-3 border border-gray-200 rounded-md flex justify-between items-center"
            >
              <span>
                {new Date(log.startTime.seconds * 1000).toLocaleString()} -{" "}
                {new Date(log.endTime.seconds * 1000).toLocaleString()}
              </span>
              <span className="font-semibold">
                {log.duration.toFixed(2)} hours
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrackeeLogsModal;
