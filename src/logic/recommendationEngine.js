// recommendationEngine.js

const DEFAULT_OPTIONS = {
  topN: 3,
  debug: false
};

export function getRecommendations(user, allShoes, options = {}) {
  const { topN, debug } = { ...DEFAULT_OPTIONS, ...options };

  const scored = allShoes.map(shoe => {
    const { score, reasons } = scoreShoe(user, shoe);
    return {
      shoe,
      score,
      explanation: reasons,
      tagline: generateTagline(shoe, user),
      debug: debug ? { reasons, rawScore: score } : undefined
    };
  });

  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  // Pick top N with a bit of diversity
  const diversified = pickWithDiversity(scored, topN);

  return diversified;
}

/**
 * Core scoring logic
 * Uses soft matching + weights so we get nuance and variation.
 */
function scoreShoe(user, shoe) {
  let score = 0;
  const reasons = [];

  // --- 1. Category / pronation affinity (weight: high) ---
  const { delta: catScore, reason: catReason } = scoreCategoryAffinity(user, shoe);
  score += catScore;
  if (catReason) reasons.push(catReason);

  // --- 2. Cushioning preference (weight: medium-high) ---
  const { delta: cushScore, reason: cushReason } = scoreCushioning(user, shoe);
  score += cushScore;
  if (cushReason) reasons.push(cushReason);

  // --- 3. Terrain (weight: medium) ---
  const { delta: terrainScore, reason: terrainReason } = scoreTerrain(user, shoe);
  score += terrainScore;
  if (terrainReason) reasons.push(terrainReason);

  // --- 4. Width (weight: low-medium) ---
  const { delta: widthScore, reason: widthReason } = scoreWidth(user, shoe);
  score += widthScore;
  if (widthReason) reasons.push(widthReason);

  // --- 5. Toe box (weight: low) ---
  const { delta: toeScore, reason: toeReason } = scoreToeBox(user, shoe);
  score += toeScore;
  if (toeReason) reasons.push(toeReason);

  // --- 6. Injuries (weight: high) ---
  const { delta: injuryScore, reason: injuryReason } = scoreInjuries(user, shoe);
  score += injuryScore;
  if (injuryReason) reasons.push(injuryReason);

  // --- 7. Budget (weight: medium) ---
  const { delta: budgetScore, reason: budgetReason } = scoreBudget(user, shoe);
  score += budgetScore;
  if (budgetReason) reasons.push(budgetReason);

  // --- 8. Experience level (weight: low-medium) ---
  const { delta: expScore, reason: expReason } = scoreExperience(user, shoe);
  score += expScore;
  if (expReason) reasons.push(expReason);

  // -------------------------------
// UNKNOWN FALLBACK LOGIC
// -------------------------------

// 1. RUNNING TYPE
if (user.running_type === "unknown") {
  if (shoe.use_case?.category === "daily_trainer") score += 3;
  else score += 1;
}

// 2. PRONATION
if (user.pronation === "unknown") {
  if (shoe.fit?.category === "neutral") score += 3;
  if (shoe.fit?.category === "stability") score += 2;
}

// 3. CUSHIONING
if (user.cushioning === "unknown") {
  if (shoe.ride?.cushioning_level === "medium") score += 3;
  else score += 1;
}

// 4. TERRAIN
if (user.terrain === "unknown") {
  if (shoe.use_case?.terrain === "road") score += 3;
  else score += 1;
}

// 5. INJURIES
if (
  user.injuries?.includes("unknown") ||
  user.injuries?.includes("none")
) {
  if (
    shoe.ride?.cushioning_level === "soft" ||
    shoe.ride?.cushioning_level === "medium"
  ) score += 3;

  if (shoe.fit?.category === "neutral") score += 2;
}

// 6. EXPERIENCE
if (user.experience === "unknown") {
  if (
    shoe.meta?.experience_level === "beginner" ||
    shoe.meta?.experience_level === "intermediate"
  ) score += 2;
}

// -------------------------------
// UNKNOWN EXPLANATION LOGIC
// -------------------------------

// 1. RUNNING TYPE
if (user.running_type === "unknown") {
  reasons.push(
    "Since you weren’t sure about your running type, we leaned toward versatile daily trainers that work for most runners."
  );
}

// 2. PRONATION
if (user.pronation === "unknown") {
  reasons.push(
    "You weren’t sure about pronation, so we focused on neutral shoes with stable platforms that suit a wide range of runners."
  );
}

// 3. CUSHIONING
if (user.cushioning === "unknown") {
  reasons.push(
    "Because you weren’t sure about cushioning feel, we recommended shoes with balanced or moderate cushioning that adapt well to different running styles."
  );
}

// 4. TERRAIN
if (user.terrain === "unknown") {
  reasons.push(
    "You didn’t specify a running surface, so we prioritized road shoes since they’re the most universal option."
  );
}

// 5. INJURIES
if (
  user.injuries?.includes("unknown") ||
  user.injuries?.includes("none")
) {
  reasons.push(
    "Since you didn’t list any injury concerns, we highlighted shoes with comfortable, forgiving cushioning and smooth transitions."
  );
}

// 6. EXPERIENCE
if (user.experience === "unknown") {
  reasons.push(
    "You weren’t sure about your experience level, so we recommended shoes that work well for both beginners and intermediate runners."
  );
}

  return { score, reasons };
}

/* ---------- SCORING HELPERS ---------- */

function scoreCategoryAffinity(user, shoe) {
  const userPron = user.pronation; // e.g. "neutral", "stability"
  const cat = shoe.fit.category;   // e.g. "neutral", "neutral_cushioned", "stability", "trail", "super_shoe"
  let delta = 0;
  let reason = "";

  if (!userPron || !cat) return { delta, reason };

  // Base weights
  const STRONG = 8;
  const MEDIUM = 4;
  const LIGHT = 1;
  const PENALTY = -4;

  if (userPron === "neutral") {
    if (cat === "neutral" || cat === "neutral_cushioned") {
      delta += STRONG;
      reason = "Built for neutral runners.";
    } else if (cat === "super_shoe" || cat === "tempo_trainer") {
      delta += MEDIUM;
      reason = "Performance shoe that still suits neutral runners.";
    } else if (cat === "stability") {
      delta += LIGHT;
      reason = "Stability shoe that can still work for some neutral runners.";
    } else if (cat === "trail") {
      delta += LIGHT;
      reason = "Trail-focused shoe that can still work if you run off-road.";
    }
  }

  if (userPron === "stability") {
    if (cat === "stability") {
      delta += STRONG;
      reason = "Provides the stability you asked for.";
    } else if (cat === "neutral_cushioned") {
      delta += MEDIUM;
      reason = "Neutral cushioned shoe that may still work for mild overpronation.";
    } else if (cat === "neutral") {
      delta += LIGHT;
      reason = "Neutral shoe; may work if your stability needs are mild.";
    } else if (cat === "super_shoe") {
      delta += LIGHT;
      reason = "Performance shoe; may not be ideal for strong stability needs.";
    }
  }

  // If user specified stability but shoe is clearly not supportive
  if (userPron === "stability" && cat === "minimal_zero_drop") {
    delta += PENALTY;
    reason = "Minimal shoe may not provide enough support for your stability needs.";
  }

  return { delta, reason };
}

function scoreCushioning(user, shoe) {
  const pref = user.cushioning; // "soft", "medium", "firm"
  const level = shoe.ride?.cushioning_level;
  if (!pref || !level) return { delta: 0, reason: "" };

  const FULL = 6;
  const PARTIAL = 3;
  const PENALTY = -2;

  let delta = 0;
  let reason = "";

  if (pref === level) {
    delta += FULL;
    reason = "Matches your cushioning preference.";
  } else if (
    (pref === "soft" && level === "medium") ||
    (pref === "medium" && (level === "soft" || level === "firm")) ||
    (pref === "firm" && level === "medium")
  ) {
    delta += PARTIAL;
    reason = "Close to your cushioning preference.";
  } else {
    delta += PENALTY;
    reason = "Offers a different cushioning feel you might still enjoy.";
  }

  return { delta, reason };
}

function scoreTerrain(user, shoe) {
  const pref = user.terrain; // "road", "trail", etc.
  const terrain = shoe.use_case?.terrain;
  if (!pref || !terrain) return { delta: 0, reason: "" };

  // Stronger weights because terrain is a major factor
  const FULL = 8;
  const PARTIAL = 3;
  const PENALTY = -6;

  let delta = 0;
  let reason = "";

  // Exact match
  if (pref === terrain) {
    delta += FULL;
    reason = "Designed for your primary running surface.";
  }

  // Direct mismatch (road vs trail)
  else if (
    (pref === "road" && terrain === "trail") ||
    (pref === "trail" && terrain === "road")
  ) {
    delta += PENALTY;
    reason = "Not built for your main running surface, but included for its strengths in other areas.";
  }

  // Hybrid or mixed-use shoes (e.g., "mixed", "light_trail")
  else {
    delta += PARTIAL;
    reason = "Versatile enough to handle your running surface.";
  }

  return { delta, reason };
}

function scoreWidth(user, shoe) {
  const pref = user.width; // "standard", "wide", etc.
  const options = shoe.fit?.width_options || [];
  if (!pref || options.length === 0) return { delta: 0, reason: "" };

  const FULL = 3;
  const PARTIAL = 1;

  let delta = 0;
  let reason = "";

  if (options.includes(pref)) {
    delta += FULL;
    reason = "Available in your preferred width.";
  } else if (pref === "wide" && options.includes("standard")) {
    delta += PARTIAL;
    reason = "Standard width only, but may still work depending on your foot shape.";
  }

  return { delta, reason };
}

function scoreToeBox(user, shoe) {
  const pref = user.toeBox; // "standard", "roomy", "wide"
  const shape = shoe.fit?.toe_box_shape;
  if (!pref || !shape) return { delta: 0, reason: "" };

  const FULL = 2;
  const PARTIAL = 1;

  let delta = 0;
  let reason = "";

  if (pref === shape) {
    delta += FULL;
    reason = "Toe box shape fits your preference.";
  } else if (
    (pref === "wide" && shape === "roomy") ||
    (pref === "roomy" && shape === "standard")
  ) {
    delta += PARTIAL;
    reason = "Toe box shape is close to what you prefer.";
  }

  return { delta, reason };
}

function scoreInjuries(user, shoe) {
  let injuries = user.injuries || [];

  // ⭐ Fix B: ensure injuries is ALWAYS an array
  if (!Array.isArray(injuries)) {
    injuries = [injuries];
  }

  const tags = shoe.injury_tags || [];
  if (!injuries.length) return { delta: 0, reason: "" };

  let delta = 0;
  const matched = [];

  const PER_MATCH = 3;

  injuries.forEach(injury => {
    if (tags.includes(injury)) {
      delta += PER_MATCH;
      matched.push(injury.replace(/_/g, " "));
    }
  });

  const reason = matched.length
    ? `May help with: ${matched.join(", ")}.`
    : "";

  return { delta, reason };
}

function scoreBudget(user, shoe) {
  const pref = user.budget; // "budget", "midrange", "premium"
  const cat = shoe.meta?.budget_category;
  if (!pref || !cat) return { delta: 0, reason: "" };

  const FULL = 4;
  const PARTIAL = 2;
  const PENALTY = -3;

  let delta = 0;
  let reason = "";

  if (pref === cat) {
    delta += FULL;
    reason = "Fits your budget range.";
  } else if (
    (pref === "budget" && cat === "midrange") ||
    (pref === "midrange" && (cat === "budget" || cat === "premium")) ||
    (pref === "premium" && cat === "midrange")
  ) {
    delta += PARTIAL;
    reason = "Slightly outside your ideal budget, but still in a reasonable range.";
  } else {
    delta += PENALTY;
    reason = "Outside your preferred budget range.";
  }

  return { delta, reason };
}

function scoreExperience(user, shoe) {
  const pref = user.experience; // e.g. "beginner", "intermediate", "advanced"
  const level = shoe.meta?.experience_level;
  if (!pref || !level) return { delta: 0, reason: "" };

  const FULL = 2;
  const PARTIAL = 1;

  let delta = 0;
  let reason = "";

  if (pref === level) {
    delta += FULL;
    reason = "Matches your experience level.";
  } else if (
    (pref === "beginner" && level === "intermediate") ||
    (pref === "intermediate" && (level === "beginner" || level === "advanced")) ||
    (pref === "advanced" && level === "intermediate")
  ) {
    delta += PARTIAL;
    reason = "Suitable for your experience, even if not a perfect match.";
  }

  return { delta, reason };
}

/* ---------- DIVERSITY PICKER ---------- */

function pickWithDiversity(scored, topN) {
  if (scored.length <= topN) return scored;

  const picks = [];
  const usedBrands = new Set();
  const usedCategories = new Set();

  for (const item of scored) {
    if (picks.length === 0) {
      picks.push(item);
      usedBrands.add(item.shoe.brand);
      usedCategories.add(item.shoe.fit.category);
      continue;
    }

    const brand = item.shoe.brand;
    const category = item.shoe.fit.category;

    const brandAlreadyUsed = usedBrands.has(brand);
    const categoryAlreadyUsed = usedCategories.has(category);

    // Prefer items that add diversity, but don't be too strict
    const isDiverse = !brandAlreadyUsed || !categoryAlreadyUsed;

    if (isDiverse || picks.length < topN - 1) {
      picks.push(item);
      usedBrands.add(brand);
      usedCategories.add(category);
    }

    if (picks.length >= topN) break;
  }

  // If we still don't have enough (very rare), just fill from the top
  if (picks.length < topN) {
    const existingIds = new Set(picks.map(p => p.shoe.model + p.shoe.version));
    for (const item of scored) {
      const id = item.shoe.model + item.shoe.version;
      if (!existingIds.has(id)) {
        picks.push(item);
        if (picks.length >= topN) break;
      }
    }
  }

  return picks;
}

/* ---------- TAGLINE GENERATOR ---------- */

function generateTagline(shoe, user) {
  // --- USER-BASED OVERRIDES FOR "UNKNOWN" ANSWERS ---
  if (user.running_type === "unknown") {
    return "A versatile daily trainer that works for almost any runner.";
  }

  if (user.pronation === "unknown") {
    return "A stable, neutral-friendly option that suits a wide range of runners.";
  }

  if (user.cushioning === "unknown") {
    return "Balanced cushioning that adapts well to different running styles.";
  }

  if (user.terrain === "unknown") {
    return "A reliable road-friendly choice for everyday running.";
  }

  if (
    user.injuries?.includes("unknown") ||
    user.injuries?.includes("none")
  ) {
    return "Comfortable, forgiving cushioning for smooth, easy miles.";
  }

  if (user.experience === "unknown") {
    return "Beginner-friendly comfort with enough support for growing runners.";
  }

  // --- FALLBACK TO YOUR EXISTING SHOE-BASED TAGLINE LOGIC ---
  const parts = [];

  const cat = shoe.fit?.category;
  const cush = shoe.ride?.cushioning_level;
  const ride = shoe.ride?.ride_character;
  const toe = shoe.fit?.toe_box_shape;

  if (cat && cat.includes("stability")) parts.push("stable");
  if (cush === "soft") parts.push("soft");
  if (cush === "firm") parts.push("responsive");
  if (ride === "bouncy") parts.push("bouncy");
  if (ride === "propulsive") parts.push("fast-feeling");
  if (toe === "roomy" || toe === "wide") parts.push("roomy fit");

  return parts.length > 0
    ? parts.join(", ") + "."
    : "A balanced, versatile daily trainer.";
}