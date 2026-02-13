import fs from "fs";
import path from "path";

// Load CSV file
const csv = fs.readFileSync("./shoes.csv", "utf8");

// Split into rows
const rows = csv.trim().split("\n");

// Extract headers
const headers = rows[0].split(",");

// Convert each row to JSON
const shoes = rows.slice(1).map(row => {
  const cols = row.split(",");

  const obj = {};
  headers.forEach((header, i) => {
    obj[header] = cols[i];
  });

  return {
    brand: obj.brand,
    model: obj.model,
    version: obj.version,
    price: obj.price,
    affiliate_link: obj.affiliate_link,
    image_url: obj.image_url,
    release_year: obj.release_year,

    fit: {
      category: obj.category,
      arch_support_level: obj.arch_support_level,
      width_options: obj.width_options ? obj.width_options.split("|") : [],
      toe_box_shape: obj.toe_box_shape,
      heel_fit: obj.heel_fit
    },

    ride: {
      drop_mm: Number(obj.drop_mm),
      stack_height_mm: Number(obj.stack_height_mm),
      cushioning_level: obj.cushioning_level,
      energy_return: obj.energy_return,
      stability_level: obj.stability_level,
      ride_character: obj.ride_character,
      weight_grams: Number(obj.weight_grams)
    },

    use_case: {
      terrain: obj.terrain,
      best_for: obj.best_for ? obj.best_for.split("|") : []
    },

    injury_tags: [
      ...(obj.good_for_plantar_fasciitis === "TRUE" ? ["plantar_fasciitis"] : []),
      ...(obj.good_for_shin_splints === "TRUE" ? ["shin_splints"] : []),
      ...(obj.good_for_knee_pain === "TRUE" ? ["knee_pain"] : []),
      ...(obj.good_for_achilles_issues === "TRUE" ? ["achilles_issues"] : [])
    ],

    meta: {
      budget_category: obj.budget_category,
      durability_rating: obj.durability_rating,
      experience_level: obj.experience_level,
      availability: obj.availability
    }
  };
});

// Save JSON
fs.writeFileSync(
  path.join("./shoes.json"),
  JSON.stringify(shoes, null, 2)
);

console.log("Conversion complete → shoes.json created!");

