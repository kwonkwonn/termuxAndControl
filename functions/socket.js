// socket.js
const net = require("net");

function sendCommandToRobot(command) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    // 서버 연결
    client.connect(8888, "192.168.245.62", () => {
      console.log("Connected to robot server");

      // JSON 데이터 전송
      const message = JSON.stringify({ command });
      client.write(message);
      console.log("Message sent:", message);
    });

    // 데이터 전송 성공 처리
    client.on("data", (data) => {
      console.log("Response from server:", data.toString());
      resolve(data.toString());
      client.destroy(); // 연결 닫기
    });

    // 에러 처리
    client.on("error", (err) => {
      console.error("Connection error:", err.message);
      reject(err);
      client.destroy();
    });

    // 연결 종료
    client.on("close", () => {
      console.log("Connection closed");
    });
  });
}

module.exports = { sendCommandToRobot };
