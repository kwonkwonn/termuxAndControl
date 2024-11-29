const net = require("net");

let client;

function initializeRobotSocket() {
  client = new net.Socket();

  client.connect(8888, "192.168.245.62", () => {
    console.log("Connected to robot server");
  });

  client.on("error", (err) => {
    console.error("Connection error:", err.message);
    client.destroy(); // 연결 문제가 생기면 소켓 종료
    client = null; // 클라이언트를 재설정
  });

  client.on("close", () => {
    console.log("Connection closed");
    client = null; // 연결 종료 시 소켓 재설정
  });
}

function sendCommandToRobot(command) {
  return new Promise((resolve, reject) => {
    if (!client) {
      initializeRobotSocket(); // 연결이 없다면 초기화
      setTimeout(
        () => sendCommandToRobot(command).then(resolve).catch(reject),
        1000
      ); // 재시도
      return;
    }

    try {
      const message = JSON.stringify({ command: command });
      client.write(message, () => {
        console.log("Message sent:", message);
        resolve("Command sent successfully");
      });
    } catch (err) {
      console.error("Error sending command:", err.message);
      reject(err);
    }
  });
}

// 서버 실행 시 소켓 초기화
initializeRobotSocket();

module.exports = { sendCommandToRobot };
