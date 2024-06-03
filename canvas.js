const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");

// Register font if needed

async function generateImage(userData) {
  const canvas = createCanvas(300, 400); // Lebar 300, tinggi 400
  const ctx = canvas.getContext("2d");

  // Draw background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw border
  ctx.strokeStyle = "black"; // Warna garis border
  ctx.lineWidth = 2; // Lebar garis border
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Load and draw image
  const image = await loadImage("rs.jpg"); // Nama file gambar profil
  ctx.drawImage(image, 20, 20, 50, 50); // Gambar ditarik pada posisi (20, 20) dengan lebar 50, tinggi 50

  // Draw text
  ctx.fillStyle = "#000000";
  ctx.font = "16px ";
  ctx.textAlign = "left";
  ctx.fillText("rumah sakit bunda harapan", 90, 40); // Menempatkan teks pada posisi (90, 40)

  // Draw info
  ctx.font = "18px ";
  const infoY = 100;
  const infoSpacing = 30;

  ctx.fillText("No Antrian:", 20, infoY);
  ctx.fillText(`NIK: ${userData.nik}`, 20, infoY + infoSpacing);
  ctx.fillText(`Nama: ${userData.nama}`, 20, infoY + infoSpacing * 2);
  ctx.fillText(`Poli: ${userData.poli}`, 20, infoY + infoSpacing * 3);

  // Return canvas as buffer
  return canvas.toBuffer();
}

module.exports = { generateImage };
