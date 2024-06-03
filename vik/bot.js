// const TelegramBot = require("node-telegram-bot-api");

// const botToken = "7449072741:AAFOOt98MrHMDwSiffMkup1A6jPhqvfnXtI";

// const bot = new TelegramBot(botToken, { polling: true });

// const userData = {};

// // Event handler untuk perintah /start
// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   const firstName = msg.from.first_name;
//   const greetingMessage = `Hallo ${firstName}, selamat datang!`;
//   const idp = msg.chat.username;
//   console.log(idp, firstName);

//   // Membuat keyboard inline dengan tombol menu
//   const keyboard = {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           { text: "/cekantrian", callback_data: "cekantrian" },
//           { text: "/ambilanantrian", callback_data: "ambilanantrian" },
//           { text: "/laporan", callback_data: "laporan" },
//         ],
//       ],
//     },
//   };

//   bot.sendMessage(chatId, greetingMessage, keyboard);
// });

// bot.on("callback_query", (callbackQuery) => {
//   const chatId = callbackQuery.message.chat.id;
//   const data = callbackQuery.data;

//   console.log(chatId, data, callbackQuery);

//   // Menyimpan chat ID pengguna yang melakukan tindakan
//   const userId = callbackQuery.from.id;

//   if (data === "ambilanantrian") {
//     // Meminta pengguna mengirim NIK
//     bot.sendMessage(chatId, "Silakan kirim nomor NIK:");
//     // Menyimpan state pengguna untuk langkah selanjutnya
//     userData[userId] = { step: "nik" };
//   } else if (
//     data === "poli_umum" ||
//     data === "poli_balita" ||
//     data === "poli_dewasa"
//   ) {
//     if (userData[userId] && userData[userId].step === "poli") {
//       // Menyimpan pilihan poli pengguna
//       let poli;
//       if (data === "poli_umum") {
//         poli = "Poli Umum";
//       } else if (data === "poli_balita") {
//         poli = "Poli Balita";
//       } else if (data === "poli_dewasa") {
//         poli = "Poli Dewasa";
//       }
//       userData[userId].poli = poli;
//       // Menampilkan data yang disimpan di terminal
//       console.log("Data Pengguna:");
//       console.log("NIK:", userData[userId].nik);
//       console.log("Nama:", userData[userId].nama);
//       console.log("Poli:", userData[userId].poli);
//       // Reset state pengguna setelah data ditampilkan di terminal
//       delete userData[userId];
//       // Kirim pesan bahwa pendaftaran berhasil
//       bot.sendMessage(chatId, "Anda berhasil mendaftar!");
//     } else {
//       bot.sendMessage(chatId, "Mohon maaf, saya tidak mengenali pilihan Anda.");
//     }
//   } else {
//     bot.sendMessage(chatId, "Mohon maaf, saya tidak mengenali pilihan Anda.");
//   }
// });

// // Event handler untuk menerima pesan dari pengguna
// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;
//   const userId = msg.from.id;
//   const messageText = msg.text;

//   // Memeriksa apakah pengguna sedang dalam proses memasukkan data
//   if (userData[userId]) {
//     const userDataStep = userData[userId].step;

//     switch (userDataStep) {
//       case "nik":
//         // Menyimpan NIK pengguna
//         userData[userId].nik = messageText;
//         // Meminta pengguna mengirim nama
//         bot.sendMessage(chatId, "Silakan kirim nama:");
//         // Memperbarui langkah proses pengguna
//         userData[userId].step = "nama";
//         break;
//       case "nama":
//         // Menyimpan nama pengguna
//         userData[userId].nama = messageText;
//         // Meminta pengguna memilih poli menggunakan keyboard inline
//         const inlineKeyboard = {
//           reply_markup: {
//             inline_keyboard: [
//               [
//                 { text: "Poli Umum", callback_data: "poli_umum" },
//                 { text: "Poli Balita", callback_data: "poli_balita" },
//                 { text: "Poli Dewasa", callback_data: "poli_dewasa" },
//               ],
//             ],
//           },
//         };
//         bot.sendMessage(chatId, "Silakan pilih poli:", inlineKeyboard);
//         // Memperbarui langkah proses pengguna
//         userData[userId].step = "poli";
//         break;
//       default:
//         // Jika langkah tidak dikenali, reset state pengguna
//         delete userData[userId];
//         break;
//     }
//   }
// });

// console.log("Bot sedang berjalan...");

const TelegramBot = require("node-telegram-bot-api");
const { generateImage } = require("../canvas");

const botToken = "7449072741:AAFOOt98MrHMDwSiffMkup1A6jPhqvfnXtI";

const bot = new TelegramBot(botToken, { polling: true });

const userData = {};

// Event handler untuk perintah /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;
  const greetingMessage = `Hallo ${firstName} selamat datang!, ada yang bisa di bantu?`;
  const idp = msg.chat.username;
  console.log(idp, firstName);

  // Membuat keyboard dengan tombol menu
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

// Event handler untuk menerima pesan dari pengguna
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageText = msg.text;

  if (messageText === "Cek Antrian") {
    bot.sendMessage(chatId, "Ini adalah fitur untuk mengecek antrian.");
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
            console.log("NIK:", userData[userId].nik);
            console.log("Nama:", userData[userId].nama);
            console.log("Poli:", userData[userId].poli);

            // Generate image
            // Generate image
            generateImage(userData[userId]).then((imageBuffer) => {
              // Send image to user
              bot
                .sendPhoto(chatId, imageBuffer, {
                  caption: "Anda berhasil mendaftar!",
                  filename: "registration.jpg",
                })
                .then(() => {
                  // Reset user data
                  delete userData[userId];
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
