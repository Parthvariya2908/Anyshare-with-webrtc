const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const { start } = require("node:repl");
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(bodyParser.json());

app.get("/sender", (req, res) => {
  res.sendFile(join(__dirname, "sender.html"));
});
app.get("/receiver", (req, res) => {
  res.sendFile(join(__dirname, "receiver.html"));
});
// for connection
var sender = -1;
var receiver = -1;
io.on("connection", (socket) => {
  console.log("User connnected !");
  socket.on("signaling", (ob) => {
    console.log(ob);
    if (ob.name == "sender") {
      sender = socket.id;
    }
    if (ob.name == "receiver") {
      receiver = socket.id;
    }
    if (sender != -1 && receiver != -1) {
      io.emit("start", {});
    }
  });
  socket.on("handshake1", (ICE) => {
    console.log("handshake");
    io.to(receiver).emit("handshake2", ICE);
  });
  socket.on("handshake2", (ICE) => {
    console.log("handshake");
    io.to(sender).emit("handshake1", ICE);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
