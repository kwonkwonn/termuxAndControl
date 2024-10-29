const { userLocation } = require("../functions/userLocation.js");
const {
  voiceRecord,
  quitRecord,
  sendVoice,
chatAI
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
	res.writeHead(200); 
try{
  quitRecord(0, sessionNumber)
.then(()=>{sendVoice(sessionNumber).then((response) => {
    console.log(response);
    res.write(response);
    chatAI(response).then((answer)=>{
    	res.write(answer);
	console.log(answer);
    })
})
	
  sessionNumber %= 20;
  sessionNumber++;
  res.end();
} )     }catch(err){
	console.log(err);
};


});

module.exports = router;
