const express = require("express");
const { db } = require("../config/firebase");
const {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
} = require("firebase/firestore");

const router = express.Router();

// Fetch all requests
router.get("/", async (req, res) => {
  try {
    const requestsRef = collection(db, "requests");
    const snapshot = await getDocs(requestsRef);
    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Error fetching requests" });
  }
});

// Request check-in
router.post("/", async (req, res) => {
  const { userId, userName } = req.body;
  if (!userId || !userName) {
    return res
      .status(400)
      .json({ error: "User ID and user name are required" });
  }

  try {
    const requestsRef = collection(db, "requests");
    const q = query(requestsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return res.status(409).json({ error: "Request already exists" });
    }

    const newRequest = { userId, userName };
    const docRef = await addDoc(requestsRef, newRequest);
    res.status(201).json({ id: docRef.id, ...newRequest });
  } catch (error) {
    console.error("Error requesting check-in:", error);
    res.status(500).json({ error: "Error requesting check-in" });
  }
});

// Cancel check-in request
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const requestDocRef = doc(db, "requests", id);
    await deleteDoc(requestDocRef);
    res.status(200).json({ message: "Request cancelled" });
  } catch (error) {
    console.error("Error cancelling request:", error);
    res.status(500).json({ error: "Error cancelling request" });
  }
});

// Approve check-in request
router.post("/approve", async (req, res) => {
  const { requestId, timeStarted } = req.body;
  if (!requestId || !timeStarted) {
    return res
      .status(400)
      .json({ error: "Request ID and timeStarted are required" });
  }

  try {
    // Get the request document
    const requestDocRef = doc(db, "requests", requestId);
    const requestDoc = await getDoc(requestDocRef);

    if (!requestDoc.exists()) {
      return res.status(404).json({ error: "Request not found" });
    }

    const { userId, userName } = requestDoc.data();

    // Add to activeTrackies
    const activeTrackiesRef = collection(db, "activeTrackies");
    const newTrackie = {
      userId,
      userName,
      timeStarted: new Date(timeStarted),
    };
    const activeTrackieDocRef = await addDoc(activeTrackiesRef, newTrackie);

    // Remove from requests
    await deleteDoc(requestDocRef);

    res.status(200).json({
      id: activeTrackieDocRef.id,
      ...newTrackie,
      timeStarted: newTrackie.timeStarted.toISOString(),
      message: "Check-in approved",
    });
  } catch (error) {
    console.error("Error approving check-in:", error);
    res.status(500).json({ error: "Error approving check-in" });
  }
});

module.exports = router;
