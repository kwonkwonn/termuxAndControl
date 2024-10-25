
const {exec}=require('child_process');
const {userLocation}=require('./functions/userLocation.js')

function main() {




exec('termux-microphone-record -f ./voiceRecorded/1 ', (err, stdout,stderr)=>{
	if(err){
		return;}

	console.log(`stdout: ${stdout}`);
	console.log(`stderr: ${stderr}`);
})

	userLocation();
}

main();


