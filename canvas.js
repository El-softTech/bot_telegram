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
  const imagePath = path.join(__dirname, "rs.jpg");

  const content = templateHtml
    .replace("<%= antrian %>", userData.antrian)
    .replace("<%= nik %>", userData.nik)
    .replace("<%= nama %>", userData.nama)
    .replace("<%= poli %>", userData.poli)
    .replace("<%= imagePath %>", "file://" + imagePath);

  await page.setContent(content);

  // Ambil screenshot dari elemen dengan kelas 'card'
  const cardElement = await page.$(".card");
  const screenshotBuffer = await cardElement.screenshot();

  await browser.close();
  return screenshotBuffer;
}

module.exports = { generateImage };
