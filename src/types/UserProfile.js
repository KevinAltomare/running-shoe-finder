// src/types/UserProfile.js

export const UserProfileSchema = {
  running_type: [
    "daily_training",
    "long_run",
    "tempo",
    "walking",
    "race",
    "unknown"
  ],

  pronation: [
    "neutral",
    "overpronation",
    "supination",
    "unknown"
  ],

  cushioning: [
    "soft",
    "balanced",
    "firm",
    "unknown"
  ],

  terrain: [
    "road",
    "trail",
    "mixed",
    "unknown"
  ],

  budget: [
    "budget",
    "midrange",
    "premium"
  ],

  injuries: [
    "plantar_fasciitis",
    "shin_splints",
    "knee_pain",
    "achilles",
    "none",
    "unknown"
  ],

  experience: [
    "beginner",
    "intermediate",
    "advanced",
    "unknown"
  ]
};