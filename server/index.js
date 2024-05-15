const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");

const app = express();

// ROUTES
app.use("/auth", authRouter);

// MIDDLEWARE
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
