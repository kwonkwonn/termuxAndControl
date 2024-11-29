let sessionNumber=0;


module.exports={
	getSession:()=>{
		console.log("current session:", sessionNumber);
		return sessionNumber},
	incrementSession:()=>{
		sessionNumber=(sessionNumber+1) %20;
	console.log("incdremented session To:", sessionNumber);
	return sessionNumber;
	}};
