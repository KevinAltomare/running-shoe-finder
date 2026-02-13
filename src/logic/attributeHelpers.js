export function formatAttributes(shoe) {
  const parts = [];

  // Drop
  if (shoe.ride?.drop_mm !== undefined) {
    const drop = shoe.ride.drop_mm;
    if (drop === 0) parts.push("Zero‑drop platform");
    else if (drop <= 4) parts.push("Low drop");
    else if (drop <= 8) parts.push("Moderate drop");
    else parts.push("Higher heel‑to‑toe drop");
  }

  // Cushioning
  if (shoe.ride?.cushioning_level) {
    const map = {
      soft: "Soft cushioning",
      medium: "Medium cushioning",
      firm: "Firm, responsive cushioning"
    };
    parts.push(map[shoe.ride.cushioning_level]);
  }

  // Terrain
  if (shoe.use_case?.terrain) {
    const map = {
      road: "Road running",
      trail: "Trail running",
      mixed: "Mixed surfaces"
    };
    parts.push(map[shoe.use_case.terrain]);
  }

  // Budget
  if (shoe.meta?.budget_category) {
    const map = {
      budget: "Budget‑friendly",
      midrange: "Midrange pricing",
      premium: "Premium tier"
    };
    parts.push(map[shoe.meta.budget_category]);
  }

  return parts;
}