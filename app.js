const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server);
const botPath = path.join(__dirname, "vik", "bot.js");

// Verifikasi path yang dihasilkan
console.log(`Bot path: ${botPath}`);

let currentQueueNumber = 0;

// Mulai bot Telegram
const botProcess = spawn("node", [botPath]);

botProcess.stdout.on("data", (data) => {
  console.log(`Bot stdout: ${data}`);
});

botProcess.stderr.on("data", (data) => {
  console.error(`Bot stderr: ${data}`);
});

botProcess.on("close", (code) => {
  console.log(`Bot process exited with code ${code}`);
});

io.on("connection", (socket) => {
  console.log("a user connected");

  // Send the current queue number to the newly connected client
  socket.emit("queue update", currentQueueNumber);

  // Handle the event when a client requests a new queue number
  socket.on("new queue number", () => {
    currentQueueNumber++;
    io.emit("queue update", currentQueueNumber); // Update all clients
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Endpoint sederhana
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/nama", (req, res) => {
  res.send("hello ");
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
