const {exec}= require('child_process');
const {vibrate}=require('./vibrate.js');


function voiceRecord(){
	vibrate(500);
	exec(`termux-microphone-record -f ./voiceRecorded/2`, (err, stdout,stderr)=>{
		if(err){
			return;}

		console.log(`stdout: ${stdout}`);
		console.log(`stderr: ${stderr}`);
	})


}



module.exports={voiceRecord}
