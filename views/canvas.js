const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function generateImage(userData) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const templateHtml = fs.readFileSync(
    path.join(__dirname, "card.html"),
    "utf8"
  );
  const imagePath = path.join(__dirname, "..", "aset", "image.png");
  const imagePathUrl = `file://${imagePath}`;

  const content = templateHtml
    .replace("<%= antrian %>", userData.queueNumber)
    .replace("<%= nik %>", userData.nik)
    .replace("<%= nama %>", userData.nama)
    .replace("<%= poli %>", userData.poli)
    .replace("<%= imagePath %>", imagePathUrl);

  await page.setContent(content);

  // Tunggu sampai gambar latar belakang selesai dimuat
  await page.waitForSelector(".card", {
    visible: true,
    timeout: 3000,
  });

  // Ambil screenshot dari elemen dengan kelas 'card'
  const cardElement = await page.$(".card");
  const screenshotBuffer = await cardElement.screenshot();

  await browser.close();
  return screenshotBuffer;
}

module.exports = { generateImage };
