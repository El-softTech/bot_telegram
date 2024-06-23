const TelegramBot = require("node-telegram-bot-api");
const { generateImage } = require("../views/canvas"); // Update the path accordingly
const { ref, set, get } = require("firebase/database");
const { database } = require("../model/firebase");
const moment = require("moment-timezone");

const botToken = "7449072741:AAFOOt98MrHMDwSiffMkup1A6jPhqvfnXtI"; // Replace with your bot token
const bot = new TelegramBot(botToken, { polling: true });

const userData = {};

// Function to generate a unique queue number
async function generateQueueNumber() {
  const queueRef = ref(database, "queueNumber");
  let queueNumberSnapshot = await get(queueRef);
  let queueNumber = 1;

  if (queueNumberSnapshot.exists()) {
    queueNumber = queueNumberSnapshot.val() + 1;
  }

  await set(queueRef, queueNumber);
  return queueNumber;
}

function isEligibleForQueue(lastQueueTime) {
  const now = moment().tz("Asia/Jakarta");
  const sixAMToday = now.clone().startOf("day").hour(6);
  const sixAMTomorrow = sixAMToday.clone().add(1, "day");

  return (
    (now >= sixAMToday && lastQueueTime < sixAMToday) || now >= sixAMTomorrow
  );
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;
  const greetingMessage = `Hallo ${firstName}, selamat datang! Ada yang bisa dibantu?`;

  const keyboard = {
    reply_markup: {
      keyboard: [
        [{ text: "Cek Antrian" }],
        [{ text: "Mengambil Antrian" }],
        [{ text: "Laporan" }],
      ],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  };

  bot.sendMessage(chatId, greetingMessage, keyboard);
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageText = msg.text;

  if (messageText === "Cek Antrian") {
    bot.sendMessage(chatId, "Antrian belum tersedia");
    delete userData[userId]; // Reset state pengguna jika ada
  } else if (messageText === "Mengambil Antrian") {
    const userRef = ref(database, `users/${userId}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      const lastQueueTime = userSnapshot.val().lastQueueTime;

      if (!isEligibleForQueue(lastQueueTime)) {
        bot.sendMessage(
          chatId,
          "Satu akun hanya untuk satu kali daftar untuk satu hari."
        );
        return;
      }
    }

    bot.sendMessage(chatId, "Silakan kirim nomor NIK:");
    userData[userId] = { step: "nik" };
  } else if (messageText === "Laporan") {
    bot.sendMessage(chatId, "Ini adalah fitur untuk membuat laporan.");
    delete userData[userId]; // Reset state pengguna jika ada
  } else {
    if (userData[userId]) {
      const userDataStep = userData[userId].step;

      switch (userDataStep) {
        case "nik":
          userData[userId].nik = messageText;
          bot.sendMessage(chatId, "Silakan kirim nama:");
          userData[userId].step = "nama";
          break;
        case "nama":
          userData[userId].nama = messageText;
          const poliKeyboard = {
            reply_markup: {
              keyboard: [
                [{ text: "Poli Umum" }],
                [{ text: "Poli Balita" }],
                [{ text: "Poli Dewasa" }],
              ],
              one_time_keyboard: true,
              resize_keyboard: true,
            },
          };
          bot.sendMessage(chatId, "Silakan pilih poli:", poliKeyboard);
          userData[userId].step = "poli";
          break;
        case "poli":
          if (
            ["Poli Umum", "Poli Balita", "Poli Dewasa"].includes(messageText)
          ) {
            userData[userId].poli = messageText;
            console.log("Data Pengguna:");
            console.log("NIK:", userData[userId].nik);

            // Generate queue number
            const queueNumber = await generateQueueNumber();
            userData[userId].queueNumber = queueNumber;
            userData[userId].lastQueueTime = new Date().getTime();

            // Simpan data ke Firebase Realtime Database
            const userRef = ref(database, `users/${userId}`);
            try {
              await set(userRef, userData[userId]);
              console.log(
                "Data berhasil ditulis ke Firebase Realtime Database"
              );
            } catch (error) {
              console.error("Gagal menulis data:", error);
            }

            generateImage(userData[userId]).then((imageBuffer) => {
              bot
                .sendPhoto(chatId, imageBuffer, {
                  caption:
                    "Anda berhasil mendaftar, tunjukkan tiket ketika nomor Anda dipanggil!",
                  filename: "registration.jpg",
                })
                .then(() => {
                  delete userData[userId]; // Reset state pengguna setelah pengiriman gambar
                })
                .catch((err) => {
                  console.error("Error sending photo:", err);
                });
            });
          } else {
            bot.sendMessage(chatId, "Mohon pilih poli yang valid.");
          }
          break;
        default:
          delete userData[userId]; // Reset state pengguna jika langkah tidak dikenali
          break;
      }
    }
  }
});

console.log("Bot sedang berjalan...");
