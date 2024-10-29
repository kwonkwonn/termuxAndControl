const { userLocation } = require("../functions/userLocation.js");
const {
  voiceRecord,
  quitRecord,
  sendVoice,
  chatAI,
} = require("../functions/voiceRecorder.js");
const { vibrate } = require("../functions/vibrate.js");
const { exec } = require("child_process");
const dotenv = require("dotenv");

dotenv.config();
var sessionNumber = 0;

var express = require("express");
var router = express.Router();

router.get("/chatVoice", function (req, res, next) {
  vibrate(1000);

  try {
    voiceRecord(0, sessionNumber);
  } catch (error) {
    res.send(error);
  }
  res.send("Voice Recorded");
});

router.get("/quitChat", async function (req, res, next) {
  try {
    vibrate(1000);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json"); // text/plain 대신 application/json 사용

    await quitRecord(0, sessionNumber);
    const voiceResponse = await sendVoice(sessionNumber);

    res.write(
      JSON.stringify({
        type: "user",
        content: voiceResponse,
      }) + "\n"
    );

    const aiAnswer = await chatAI(voiceResponse);

    res.write(
      JSON.stringify({
        type: "ai",
        content: aiAnswer,
      }) + "\n"
    );

    sessionNumber = (sessionNumber + 1) % 20;
    res.end();
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
