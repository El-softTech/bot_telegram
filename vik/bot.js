const TelegramBot = require("node-telegram-bot-api");
const { generateImage } = require("../canvas"); // Update the path accordingly

const botToken = "7449072741:AAFOOt98MrHMDwSiffMkup1A6jPhqvfnXtI";
const bot = new TelegramBot(botToken, { polling: true });

const userData = {};

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

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageText = msg.text;

  if (messageText === "Cek Antrian") {
    bot.sendMessage(chatId, "Antrian belum tersedia");
    delete userData[userId]; // Reset state pengguna jika ada
  } else if (messageText === "Mengambil Antrian") {
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
            console.log("NIK:", userData[userId]);

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
