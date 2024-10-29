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
const server = http.createServer(app);
app.use(cors());

// 로봇 서버(WebSocket)와 연결 설정
const robotSocket = io("http://ROBOT_SERVER_URL:ROBOT_PORT"); // 로봇 서버 주소로 대체

robotSocket.on("connect", () => {
  console.log("Connected to robot server");
});

robotSocket.on("disconnect", () => {
  console.log("Disconnected from robot server");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.robotSocket = robotSocket;
  next();
});

app.use("/chat", chatRouter);
app.use("/robot", socketRouter);

// robotSocket을 다른 모듈에서 사용할 수 있도록 설정
app.set("robotSocket", robotSocket);

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

module.exports = { app, server };
