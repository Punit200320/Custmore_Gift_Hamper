// Transparent Skincare Discovery Assistant Service
// Non-medical, preference-based matching engine for Surreal Treasures handmade formulations

export const SKINCARE_TEXTURE_OPTIONS = [
  'Any Texture',
  'Rich Whipped Butter',
  'Silky Lightweight Oil',
  'Velvety Cream',
  'Refreshing Water Mist',
  'Dry Mineral Powder to Paste',
  'Gentle Sugar Paste',
  'Solid Creamy Lather Bar'
];

export const SKINCARE_FRAGRANCE_OPTIONS = [
  'Any Fragrance',
  'Unscented / Pure Botanicals',
  'Warm Saffron & Earthy Vetiver',
  'French Lavender & Roman Chamomile',
  'Mysore Sandalwood & Damask Rose',
  'Sweet Citrus & Wild Bergamot',
  'Warm Madagascan Vanilla & Amber'
];

export const INGREDIENT_PREFERENCES = [
  { id: 'pure-botanicals', label: '100% Plant & Herbal Botanicals' },
  { id: 'cruelty-free', label: 'Cruelty-Free & Vegetarian' },
  { id: 'raw-unrefined', label: 'Raw Unrefined Butters & Oils' },
  { id: 'paraben-free', label: 'Zero Synthetic Preservatives / Parabens' },
  { id: 'alcohol-free', label: 'Alcohol-Free Formulation' },
  { id: 'nut-free', label: 'Avoid Nut Derivatives (Almond/Shea)' }
];

export const FORMAT_OPTIONS = [
  'Any Format',
  'Glass Dropper Bottle',
  'Amber Glass Jar',
  'Glass Spray Bottle',
  'Aluminum Tin',
  'Hand-cut Solid Bar',
  'Mini Glass Pot'
];

export function discoverSkincareProducts({
  category = 'Any Category',
  texture = 'Any Texture',
  fragrance = 'Any Fragrance',
  ingredientPreferences = [],
  avoidIngredients = [],
  productFormat = 'Any Format',
  maxPrice = 2000,
  products = []
}) {
  // Only search skincare & bath items
  const pool = products.filter((p) => p.isSkincare && p.available);

  const matched = pool.map((product) => {
    let score = 50; // baseline
    const matchReasons = [];

    // Category match
    if (category !== 'Any Category' && category) {
      if (product.subCategory === category || product.category === category) {
        score += 30;
        matchReasons.push(`Matches your requested category: "${category}"`);
      } else {
        score -= 20;
      }
    }

    // Texture match
    if (texture !== 'Any Texture' && texture) {
      if (product.texture === texture) {
        score += 25;
        matchReasons.push(`Formulated in your chosen texture: "${texture}"`);
      }
    }

    // Fragrance match
    if (fragrance !== 'Any Fragrance' && fragrance) {
      if (product.fragrance === fragrance) {
        score += 25;
        matchReasons.push(`Features your preferred scent notes: "${fragrance}"`);
      }
    }

    // Format match
    if (productFormat !== 'Any Format' && productFormat) {
      if (product.productFormat === productFormat) {
        score += 15;
        matchReasons.push(`Packaged in your desired container: "${productFormat}"`);
      }
    }

    // Budget match
    if (product.price <= maxPrice) {
      score += 10;
      matchReasons.push(`Within your ₹${maxPrice} budget target`);
    } else {
      score -= 25;
    }

    // Avoid ingredients check
    let violatesAvoidance = false;
    if (avoidIngredients.length > 0) {
      avoidIngredients.forEach((avoidTerm) => {
        const lowerTerm = avoidTerm.toLowerCase();
        const hasTerm =
          product.ingredients?.some((ing) => ing.toLowerCase().includes(lowerTerm)) ||
          product.allergens?.toLowerCase().includes(lowerTerm);
        if (hasTerm) {
          violatesAvoidance = true;
        }
      });
    }

    if (violatesAvoidance) {
      score = 0; // Filtered out
    }

    // Special allergen flag for nut-free preference
    if (ingredientPreferences.includes('nut-free')) {
      if (product.allergens?.toLowerCase().includes('nut') || product.allergens?.toLowerCase().includes('almond')) {
        score = 0;
      }
    }

    return {
      product,
      score: Math.min(100, Math.max(0, score)),
      matchReasons: matchReasons.length > 0 ? matchReasons : ['Matches high artisanal quality standard']
    };
  });

  // Filter out non-matching products and sort descending
  const filtered = matched
    .filter((m) => m.score >= 50)
    .sort((a, b) => b.score - a.score);

  return filtered;
}
