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

const express = require("express");
const router = express.Router();

router.get("/quitChat", async function (req, res, next) {
  try {
    vibrate(1000);

    // CORS 헤더 설정
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    // Step 1: Stop recording
    await quitRecord(0, sessionNumber);

    // Step 2: Get voice transcription
    const voiceResponse = await sendVoice(sessionNumber);
    console.log("Voice response:", voiceResponse); // 디버깅용

    // 사용자 메시지 전송
    const userMessage =
      JSON.stringify({
        type: "user",
        content: voiceResponse,
      }) + "\n";
    res.write(userMessage);

    // Step 3: Get AI response
    const aiAnswer = await chatAI(voiceResponse);
    console.log("AI response:", aiAnswer); // 디버깅용

    // AI 메시지 전송
    const aiMessage =
      JSON.stringify({
        type: "ai",
        content: aiAnswer,
      }) + "\n";
    res.write(aiMessage);

    // Update session number
    sessionNumber = (sessionNumber + 1) % 20;

    res.end();
  } catch (error) {
    console.error("Server error:", error);
    res.write(
      JSON.stringify({
        type: "error",
        content: error.message,
      }) + "\n"
    );
    res.end();
  }
});

module.exports = router;
