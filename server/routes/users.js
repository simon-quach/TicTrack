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

// Fetch all users
router.get("/", async (req, res) => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Login or sign up user
router.post("/login", async (req, res) => {
  const { name, userRole, action } = req.body;
  if (!name || !userRole || !action) {
    return res
      .status(400)
      .json({ error: "Name, userRole, and action are required" });
  }

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);

    if (action === "login") {
      if (querySnapshot.empty) {
        return res.status(404).json({ error: "User not found" });
      }
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      return res.status(200).json({ userId: userDoc.id, ...userData });
    }

    if (action === "signup") {
      if (!querySnapshot.empty) {
        return res.status(409).json({ error: "User already exists" });
      }
      const newUser = { name, userRole, logs: [] };
      const docRef = await addDoc(usersRef, newUser);
      return res.status(201).json({ userId: docRef.id, ...newUser });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error("Error processing user:", error);
    res.status(500).json({ error: "Error processing user" });
  }
});

module.exports = router;
