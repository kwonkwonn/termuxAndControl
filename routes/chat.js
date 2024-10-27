const { userLocation } = require("../functions/userLocation.js");
const {
  voiceRecord,
  quitRecord,
  sendVoice,
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

router.get("/quitChat", function (req, res, next) {
  vibrate(1000);

  quitRecord(0, sessionNumber)
.then(()=>{sendVoice(sessionNumber).then((response) => {
    console.log(response);

		 res.send(response);
} )

  sessionNumber %= 20;
  sessionNumber++;

});


});

module.exports = router;
