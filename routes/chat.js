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
const sessionManager = require("../functions/sessionManager.js");
const { sendCommandToRobot } = require("../functions/socket"); // socket.js에서 가져오기

dotenv.config();

var express = require("express");
var router = express.Router();

router.get("/chatVoice", function (req, res, next) {
  vibrate(1000);
  const currentSession = sessionManager.getSession();
  console.log("received number", currentSession);
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
    const currentSession = sessionManager.getSession();
    await quitRecord(currentSession);
    const voiceResponse = await sendVoice(currentSession);

    res.write(
      JSON.stringify({
        type: "user",
        content: voiceResponse,
      }) + "\n"
    );

    const aiAnswer = await chatAI(voiceResponse);

    const jsonResponse = {
      response: aiAnswer.response,
      function_call: aiAnswer.function_call || null, // function_call 정보가 있다면 추가
      additional_context: aiAnswer.additional_context, // 임의로 추가한 컨텍스트
    };

    try {
      const response = await socketSendParsing(jsonResponse);
      res.status(200).json({ message: "Command sent to robot", response });
    } catch (err) {
      console.error("Failed to send command:", err.message);
      res.status(500).json({
        error: "Failed to send command to robot",
        details: err.message,
      });
    }
    res.write(
      JSON.stringify({
        type: "ai",
        content: jsonResponse.response,
      }) + "\n"
    );

    sessionManager.incrementSession();

    console.log(sessionManager.getSession());

    res.end();
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
