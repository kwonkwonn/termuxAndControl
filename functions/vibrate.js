const {exec}= require('child_process');


function vibrate(duration){
	exec(`termux-vibrate -d ${duration} -f`, (err,stdout,stderr)=>{
	if(err){
		return;}
	})


}


module.exports={vibrate}
