const express = require("express");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(bodyParser.json());

io.on("connection", (socket) => {});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
