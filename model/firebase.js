// // firebase.js

// const { initializeApp } = require("firebase/app");
// const { getDatabase } = require("firebase/database");
// const { getStorage, ref: storageRef, push } = require("firebase/storage");

// // Konfigurasi Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyAL3cGaifh1BnucsC-6cEhpzRX0kriWgMU",
//   authDomain: "realtime-23619.firebaseapp.com",
//   databaseURL: "https://realtime-23619-default-rtdb.firebaseio.com",
//   projectId: "realtime-23619",
//   storageBucket: "realtime-23619.appspot.com",
//   messagingSenderId: "322869586285",
//   appId: "1:322869586285:web:374f83a559aa8257d01264",
//   measurementId: "G-WMQY7XYBY5",
// };

// // Inisialisasi Firebase app
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// const storage = getStorage(app);

// module.exports = {
//   database,
//   storage,
//   storageRef,
// };
// model/firebase.js

const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyAL3cGaifh1BnucsC-6cEhpzRX0kriWgMU",
  authDomain: "realtime-23619.firebaseapp.com",
  databaseURL: "https://realtime-23619-default-rtdb.firebaseio.com",
  projectId: "realtime-23619",
  storageBucket: "realtime-23619.appspot.com",
  messagingSenderId: "322869586285",
  appId: "1:322869586285:web:374f83a559aa8257d01264",
  measurementId: "G-WMQY7XYBY5",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const usersRef = ref(database, "users");

module.exports = { database, usersRef, push };
