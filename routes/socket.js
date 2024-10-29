const express = require("express");
const router = express.Router();

router.post("/roboControl", (req, res) => {
  const { command, text } = req.body;
  const robotSocket = req.robotSocket; // 미들웨어에서 전달된 robotSocket 사용

  if (robotSocket && robotSocket.connected) {
    robotSocket.emit("control", { command, text });
    res.send("Command sent to robot");
  } else {
    res.status(500).send("Robot server is not connected");
  }
});

module.exports = router;
