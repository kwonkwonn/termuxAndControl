const express = require("express");
const router = express.Router();

// app.js에서 robotSocket 객체 가져오기
const robotSocket = require("../app").app.get("robotSocket");

router.post("/roboControl", (req, res) => {
  const { command, text } = req.body;

  // 로봇 서버에 데이터 전송
  if (robotSocket && robotSocket.connected) {
    robotSocket.emit("control", { command, text });
    res.send("Command sent to robot");
  } else {
    res.status(500).send("Robot server is not connected");
  }
});

module.exports = router;
