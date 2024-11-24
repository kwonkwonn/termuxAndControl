let sessionNumber=0;


module.exports={
	getSession:()=>
		sessionNumber,
	incrementSession:()=>{
		sessionNumber=(sessionNumber+1) %20;
	return sessionNumber;
	}};
