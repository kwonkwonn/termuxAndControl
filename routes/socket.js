const express = require("express");
const { sendCommandToRobot } = require("../functions/socket"); // socket.js에서 가져오기
const router = express.Router();

router.post("/roboControl", async (req, res) => {
  const { command, text } = req.body;

  if (!command) {
    return res.status(400).json({ error: "Command is required" });
  }

  try {
    const response = await sendCommandToRobot(command);
    res.status(200).json({ message: "Command sent to robot", response });
  } catch (err) {
    console.error("Failed to send command:", err.message);
    res
      .status(500)
      .json({ error: "Failed to send command to robot", details: err.message });
  }
});

module.exports = router;
