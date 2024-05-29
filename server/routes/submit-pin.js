const express = require("express");
const { db } = require("../config/firebase");
const {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} = require("firebase/firestore");

const router = express.Router();

// Submit a check-in request using a PIN from the query string
router.post("/", async (req, res) => {
  const pin = req.query.pin;
  if (!pin) {
    return res.status(400).json({ error: "PIN is required" });
  }

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("pin", "==", pin));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;
    const userName = userData.name;

    // Check if a request already exists for this user
    const requestsRef = collection(db, "requests");
    const requestQuery = query(requestsRef, where("userId", "==", userId));
    const requestSnapshot = await getDocs(requestQuery);

    if (!requestSnapshot.empty) {
      return res.status(409).json({ error: "Request already exists" });
    }

    // Submit a check-in request for the user
    const newRequest = { userId, userName };
    const docRef = await addDoc(requestsRef, newRequest);

    res.status(201).json({ id: docRef.id, ...newRequest });
  } catch (error) {
    console.error("Error processing PIN request:", error);
    res.status(500).json({ error: "Error processing PIN request" });
  }
});

module.exports = router;
