const express = require("express");
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");

const PORT = process.env.PORT || 8000;

const app = express();

const users = [{}];

//Middlewares
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello THere, It's working");
});

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat, ${users[socket.id]}`,
    });
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message, id });
  });

  socket.on("disconnected", () => {
    socket.broadcast.emit(`leave`, { user: "Admin", message: "User has left" });
    console.log("User Left the chat");
  });
});

server.listen(PORT, () => {
  console.log(`server is lestning on http://localhost:${PORT}`);
});
