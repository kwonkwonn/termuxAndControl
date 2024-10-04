function main() {
  const axios = require("axios");
  getData(axios);
}

main();
async function getData(axios) {
  try {
    const response = await axios.get("http://google.com");
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
