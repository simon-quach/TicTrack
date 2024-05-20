const express = require("express");
const { db } = require("../config/firebase");
const {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  where,
  getDoc,
} = require("firebase/firestore");

const router = express.Router();

// Fetch all active trackies
router.get("/", async (req, res) => {
  try {
    const activeTrackiesRef = collection(db, "activeTrackies");
    const snapshot = await getDocs(activeTrackiesRef);

    if (snapshot.empty) {
      return res.status(404).json({ message: "No matching documents." });
    }

    const activeTrackies = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      activeTrackies.push({
        id: doc.id,
        ...data,
        timeStarted: data.timeStarted.toDate().toISOString(),
      });
    });

    res.status(200).json(activeTrackies);
  } catch (error) {
    console.error("Error fetching activeTrackies:", error);
    res.status(500).json({ error: "Error fetching activeTrackies" });
  }
});

// Add a new active trackie
router.post("/", async (req, res) => {
  const { userName, timeStarted } = req.body;
  if (!userName || !timeStarted) {
    return res
      .status(400)
      .json({ error: "User name and timeStarted are required" });
  }

  try {
    const activeTrackiesRef = collection(db, "activeTrackies");
    const newTrackie = {
      userName,
      timeStarted: new Date(timeStarted),
    };

    const docRef = await addDoc(activeTrackiesRef, newTrackie);
    res.status(201).json({
      id: docRef.id,
      ...newTrackie,
      timeStarted: newTrackie.timeStarted.toISOString(),
    });
  } catch (error) {
    console.error("Error adding active trackie:", error);
    res.status(500).json({ error: "Error adding active trackie" });
  }
});

// Stop an active trackie by ID and update their log
router.post("/stop", async (req, res) => {
  const { id, timeStopped } = req.body;
  if (!id || !timeStopped) {
    return res.status(400).json({ error: "ID and timeStopped are required" });
  }

  try {
    const trackieDocRef = doc(db, "activeTrackies", id);
    const trackieSnapshot = await getDoc(trackieDocRef);
    if (!trackieSnapshot.exists()) {
      return res.status(404).json({ error: "Trackie not found" });
    }

    const trackieData = trackieSnapshot.data();
    const startTime = trackieData.timeStarted.toDate();
    const endTime = new Date(timeStopped);
    const duration = (endTime - startTime) / 1000 / 3600; // duration in hours

    // Update user log
    const usersRef = collection(db, "users");
    const userQuery = query(
      usersRef,
      where("name", "==", trackieData.userName)
    );
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDocRef = userSnapshot.docs[0].ref;
    const userDoc = userSnapshot.docs[0].data();
    const updatedLogs = [
      ...userDoc.logs,
      {
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
        duration,
      },
    ];

    await updateDoc(userDocRef, { logs: updatedLogs });

    // Delete from activeTrackies
    await deleteDoc(trackieDocRef);

    res
      .status(200)
      .json({ message: "Trackie stopped and log updated", duration });
  } catch (error) {
    console.error("Error stopping trackie and updating log:", error);
    res.status(500).json({ error: "Error stopping trackie and updating log" });
  }
});

module.exports = router;
