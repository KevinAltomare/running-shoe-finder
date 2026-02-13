import fs from "fs";
import path from "path";

const filesToUpdate = [
  "./src/data/shoes.json",
  "./src/data/shoes-rw.json"
];

const outputDir = "/shoes-normalized";

function normalizeName(filename) {
  return filename
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-")
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, "");
}

function updateImagePath(oldPath) {
  if (!oldPath) return oldPath;

  const file = path.basename(oldPath);
  const base = normalizeName(file);

  return `${outputDir}/${base}.avif`;
}

filesToUpdate.forEach((jsonPath) => {
  if (!fs.existsSync(jsonPath)) {
    console.log(`⚠️  Skipping ${jsonPath} — file not found.`);
    return;
  }

  try {
    console.log(`\n🔧 Updating ${jsonPath}...`);

    const raw = fs.readFileSync(jsonPath, "utf8");
    const data = JSON.parse(raw);

    const updated = data.map((shoe) => {
      if (shoe.image) {
        shoe.image = updateImagePath(shoe.image);
      }
      if (shoe.image_url) {
        shoe.image_url = updateImagePath(shoe.image_url);
      }
      return shoe;
    });

    fs.writeFileSync(jsonPath, JSON.stringify(updated, null, 2));
    console.log(`✅ Finished updating ${jsonPath}`);
  } catch (err) {
    console.error(`❌ Error updating ${jsonPath}:`, err);
  }
});

console.log("\n✨ All done!");