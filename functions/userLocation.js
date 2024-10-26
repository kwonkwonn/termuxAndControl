const {exec} = require('child_process');

function userLocation(){
	exec('termux-location -p network -r once',
		(err,stdout,stderr)=>{
		if(err){
			return ;}
		console.log(`stdout gps: ${stdout}`);
		console.log(`stderr: ${stderr}`);
	
		})
}



module.exports = {
	userLocation:userLocation};


