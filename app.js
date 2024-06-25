// app.js

const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const { database, push } = require("./model/firebase");
const { ref, set } = require("firebase/database");

const app = express();
const port = process.env.PORT || 3000;
const botPath = path.join(__dirname, "vik", "bot.js");

// Verifikasi path yang dihasilkan
console.log(`Bot path: ${botPath}`);

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

// Middleware untuk memproses body JSON pada request
app.use(express.json());

// Endpoint untuk menyimpan data pengguna ke Firebase
app.post("/save-user", async (req, res) => {
  const { userId, nama, nik, poli } = req.body;

  if (!userId || !nama || !nik || !poli) {
    return res.status(400).json({ message: "Data pengguna tidak lengkap" });
  }

  const userData = { nama, nik, poli, step: "poli" };

  try {
    // Gunakan push untuk membuat entri baru dengan kunci unik
    const newUserRef = push(ref(database, `users/${userId}`)); // Membuat kunci unik secara otomatis
    await set(newUserRef, userData);

    console.log("Data berhasil ditulis ke Firebase Realtime Database");
    return res.status(200).json({ message: "Data pengguna berhasil disimpan" });
  } catch (error) {
    console.error("Gagal menulis data:", error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menyimpan data" });
  }
});

// Endpoint untuk mengirimkan file dashboard.html
app.get("/", (req, res) => {
  const dashboardPath = path.join(__dirname, "views", "dasbord.html");
  res.sendFile(dashboardPath);
});

app.listen(port, () => {
  console.log(`Backend berjalan di http://localhost:${port}`);
});
