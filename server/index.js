const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const activeRouter = require("./routes/activeTrackies");
const requestsRouter = require("./routes/requests");
const usersRouter = require("./routes/users");

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// ROUTES
app.use("/auth", authRouter);
app.use("/activeTrackies", activeRouter);
app.use("/requests", requestsRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

module.exports = app;
