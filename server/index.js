const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const { start } = require("node:repl");
const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(bodyParser.json());

app.get("/sender", (req, res) => {
  res.sendFile(join(__dirname, "sender.html"));
});
app.get("/receiver", (req, res) => {
  res.sendFile(join(__dirname, "receiver.html"));
});

var sender = -1;
var receiver = -1;
io.on("connection", (socket) => {
  console.log("User connnected !");
  socket.on("signaling", (ob) => {
    console.log(ob);
    if (ob.name == "sender") {
      sender = 1;
    }
    if (ob.name == "receiver") {
      receiver = 1;
    }
    if (sender == 1 && receiver == 1) {
      io.emit("start", {});
    }
  });
  socket.on("handshake", (ICE) => {
    console.log("handshake");
    socket.broadcast.emit("handshake", ICE);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
