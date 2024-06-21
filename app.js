const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const port = 3000;
// const server = http.createServer(app);
// const io = socketIo(server);
const botPath = path.join(__dirname, "vik", "bot.js");

// Verifikasi path yang dihasilkan
console.log(`Bot path: ${botPath}`);

let currentQueueNumber = 0;

// Mulai bot Telegra
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

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   // Send the current queue number to the newly connected client
//   socket.emit("queue update", currentQueueNumber);

//   // Handle the event when a client requests a new queue number
//   socket.on("new queue number", () => {
//     currentQueueNumber++;
//     io.emit("queue update", currentQueueNumber); // Update all clients
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

// Endpoint sederhana
let registeredUsers = []; // Simpan data pengguna yang sudah mendaftar

// Endpoint untuk menerima data pengguna baru
app.post("/new-user", (req, res) => {
  const userData = req.body; // Data pengguna baru dari frontend/bot
  registeredUsers.push(userData); // Tambahkan ke array pengguna terdaftar
  res.status(200).send("Data pengguna berhasil ditambahkan");
});

// Endpoint untuk mengirim data pengguna terdaftar
app.get("/registered-users", (req, res) => {
  res.json(registeredUsers); // Kirim data pengguna terdaftar sebagai respons
});

app.listen(port, () => {
  console.log(`Backend berjalan di http://localhost:${port}`);
});
