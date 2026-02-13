import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./public/shoes";
const outputDir = "./public/shoes-normalized";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Final normalized dimensions (4:3 ratio)
const WIDTH = 800;
const HEIGHT = 600;

function normalizeName(filename) {
  return filename
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-")
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, "");
}

fs.readdirSync(inputDir).forEach(async (file) => {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext)) return;

  const base = normalizeName(file);
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, `${base}.avif`);

  try {
    await sharp(inputPath)
      .resize(WIDTH, HEIGHT, {
        fit: "contain",        // keeps shoe fully visible
        background: "#ffffff"  // pads to fixed aspect ratio
      })
      .toFormat("avif", { quality: 60 })
      .toFile(outputPath);

    console.log("Processed:", file, "→", `${base}.avif`);
  } catch (err) {
    console.error("Error processing", file, err);
  }
});