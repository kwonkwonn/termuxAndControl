

function main(){
const axios = require('axios');


try{
	const response= await axios.get("http://google.com");
	console.log(response.data);
}catch(error){
	console.error(error);
}
}

}
