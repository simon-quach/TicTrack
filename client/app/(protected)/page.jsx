"use client";
import { useEffect, useState } from "react";
import TrackeeCard from "@/app/(protected)/_components/TrackeeCard";
import useAuth from "./_hooks/useAuth";
import CheckinRequestsModal from "@/app/(protected)/_components/CheckinRequestsModal";

const Home = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [trackies, setTrackies] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchTrackies = async () => {
      try {
        const response = await fetch("http://localhost:8080/activeTrackies");
        const data = await response.json();
        if (Array.isArray(data)) {
          setTrackies(data);
          const userId = localStorage.getItem("userId");
          const activeTrackie = data.find(
            (trackie) => trackie.userId === userId
          );
          setIsActive(!!activeTrackie);
        } else {
          setTrackies([]);
          setIsActive(false);
        }
      } catch (error) {
        console.error("Error fetching active trackies:", error);
        setTrackies([]); // Set to an empty array in case of error
        setIsActive(false);
      }
    };

    if (isAuthenticated) {
      fetchTrackies();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:8080/requests");
        const data = await response.json();
        setRequests(data);

        const userId = localStorage.getItem("userId");
        const existingRequest = data.find(
          (request) => request.userId === userId
        );
        setExistingRequest(existingRequest);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated]);

  const handleDelete = (id) => {
    setTrackies((prevTrackies) =>
      prevTrackies.filter((trackie) => trackie.id !== id)
    );
  };

  const handleRequestCheckin = async () => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("name");
    if (!userId || !userName) {
      console.error("User ID or user name not found in local storage");
      return;
    }

    if (existingRequest) {
      try {
        const response = await fetch(
          `http://localhost:8080/requests/${existingRequest.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setExistingRequest(null);
          console.log("Check-in request cancelled");
        } else {
          const errorData = await response.json();
          console.error("Failed to cancel check-in request:", errorData);
        }
      } catch (error) {
        console.error("Error cancelling check-in request:", error);
      }
    } else {
      try {
        const response = await fetch("http://localhost:8080/requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, userName }),
        });

        if (response.ok) {
          const newRequest = await response.json();
          setExistingRequest(newRequest);
          console.log("Check-in request submitted");
        } else {
          const errorData = await response.json();
          console.error("Failed to submit check-in request:", errorData);
        }
      } catch (error) {
        console.error("Error submitting check-in request:", error);
      }
    }
  };

  const handleCheckinClick = async () => {
    try {
      const response = await fetch("http://localhost:8080/requests");
      const data = await response.json();
      setRequests(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      const response = await fetch("http://localhost:8080/requests/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          timeStarted: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const newTrackie = await response.json();
        setTrackies((prevTrackies) => [...prevTrackies, newTrackie]);
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
        console.log("Check-in approved");
      } else {
        const errorData = await response.json();
        console.error("Failed to approve check-in request:", errorData);
      }
    } catch (error) {
      console.error("Error approving check-in request:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>You are not authenticated</div>;
  }

  return (
    <main className="px-6 py-16">
      <div className="font-bold text-[#FF5C5C]">WEEK 1</div>
      <div className="font-bold text-[24px]">Active Trackies</div>
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {trackies.length > 0 ? (
          trackies.map((trackie) => (
            <TrackeeCard
              key={trackie.id}
              id={trackie.id}
              userName={trackie.userName}
              timeStarted={trackie.timeStarted}
              userRole={userRole}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center">
            No active trackies found.
          </div>
        )}
      </div>

      {userRole === "trackee" && !isActive ? (
        <div
          onClick={handleRequestCheckin}
          className="fixed bottom-4 left-[50%] translate-x-[-50%] bg-[#FF5C5C] text-white w-[calc(100vw-64px)] text-center font-medium rounded-[8px] py-2 shadow-lg hover:bg-[#e95c5c] hover:cursor-pointer"
        >
          {existingRequest ? "Cancel Request" : "Request Check-in"}
        </div>
      ) : (
        userRole === "supervisor" && (
          <div
            onClick={handleCheckinClick}
            className="fixed bottom-4 left-[50%] translate-x-[-50%] bg-[#FF5C5C] text-white w-[calc(100vw-64px)] text-center font-medium rounded-[8px] py-2 shadow-lg hover:bg-[#e95c5c] hover:cursor-pointer"
          >
            Check in
          </div>
        )
      )}

      <CheckinRequestsModal
        showModal={showModal}
        requests={requests}
        onClose={() => setShowModal(false)}
        onApproveRequest={handleApproveRequest}
      />
    </main>
  );
};

export default Home;
