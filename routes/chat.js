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
const sessionManager=require("../functions/sessionManager.js");

dotenv.config();

var express = require("express");
var router = express.Router();

router.get("/chatVoice", function (req, res, next) {
  vibrate(1000);
const currentSession= sessionManager.getSession();
  try {
    voiceRecord(0, currentSession);
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
   const currentSession=sessionManager.getSession();
    await quitRecord(0, currentSession);
    const voiceResponse = await sendVoice(currentSession);
    sessionManager.incrementSession();

console.log(sessionManager.getSession());    
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



    res.end();
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
