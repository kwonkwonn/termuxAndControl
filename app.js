const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const chatRouter = require("./routes/chat");
const socketRouter = require("./routes/socket");
const http = require("http");
const { io } = require("socket.io-client");

const app = express();
app.use(cors());

// const net =require('net');
// const testTCTConnection=()=>{
// 	const client= new net.Socket();
// 	client.connect(8888, '192.168.245.62', ()=>{
// 		console.log('success');
// 		client.write(JSON.stringify({command:'1'}));
// 		client.destroy();
// 	});
// 	client.on('error',(err)=>{
// 		console.error('error',err);
// 	});

// };

// 로봇 서버(WebSocket)와 연결 설정
// const robotSocket = io("http://192.168.245.62:8888",{
// 	transport:['websocket', 'polling'],
// 	timeout:5000,
// 	reconnection: true,
// 	reconnectionAttepts: 5,
// 	reconnectionDelay: 1000,
// 	debug:true}); // 로봇 서버 주소로 대체

// robotSocket.on("connect", () => {
//   console.log("Connected to robot server");
// });

// robotSocket.on("connection_error", (error) => {
//   console.error("Disconnected from robot server", error);
// });
// robotSocket.on("disconnect", (reason) => {
//   console.log("Disconnected from robot server",reason);
// });
// console.log("connecting");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("robotSocket", robotSocket);
app.use((req, res, next) => {
  req.robotSocket = robotSocket;
  next();
});
app.use("/chat", chatRouter);
app.use("/robot", socketRouter);

// robotSocket을 다른 모듈에서
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
