// routes/auth.js
const express = require("express");
const { auth, db } = require("../config/firebase");
const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} = require("firebase/auth");
const { doc, setDoc } = require("firebase/firestore");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      role: role,
      email: email,
    });

    res
      .status(200)
      .json({ message: "User signed up and role assigned", userId: user.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    res.status(200).json({ message: "User logged in", userId: user.uid });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    await signOut(auth);
    res.status(200).json({ message: "User signed out" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
