const express = require("express");
const router = express.Router();
const { app } = require("../app");
// app.js에서 robotSocket 객체 가져오기
const robotSocket = app.get("robotSocket");

router.post("/roboControl", (req, res) => {
  const { command, text } = req.body;
  const robotSocket = req.robotSocket; // req 객체에서 직접 접근

  if (robotSocket && robotSocket.connected) {
    robotSocket.emit("control", { command, text });
    res.send("Command sent to robot");
  } else {
    res.status(500).send("Robot server is not connected");
  }
});

module.exports = router;

module.exports = router;
