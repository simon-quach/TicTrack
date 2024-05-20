"use client";
import { useEffect, useState } from "react";

const CheckinRequestsModal = ({
  showModal,
  requests,
  onClose,
  onApproveRequest,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl mb-4 font-bold">Pending Check-in Requests</h2>
        {requests.length > 0 ? (
          <ul>
            {requests.map((request) => (
              <li key={request.id} className="mb-2">
                <span>{request.userName}</span>
                <button
                  onClick={() => onApproveRequest(request.id)}
                  className="ml-4 bg-[#4dd858] text-white px-3 py-2 rounded hover:bg-[#43c74e] hover:cursor-pointer"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div>No pending requests</div>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-[#FF5C5C] text-white px-4 py-2 rounded hover:bg-[#e95c5c] hover:cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CheckinRequestsModal;
