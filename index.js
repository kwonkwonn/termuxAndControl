
const {exec}=require('child_process');
const {userLocation}=require('./functions/userLocation.js');
const {voiceRecord} = require('./functions/voiceRecorder.js');

function main() {
console.log(userLocation);

	voiceRecord();


	userLocation();
}

main();


