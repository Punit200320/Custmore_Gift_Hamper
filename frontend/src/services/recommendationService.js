// Rule-Based Hamper Recommendation Engine for Surreal Treasures
// Transparently assembles available catalog items into harmonious gift combinations
// strictly respecting user budget, packaging costs, stock levels, and allergy safety.

import { PACKAGING_OPTIONS } from '../data/demoProducts';

// Common allergen definitions with comprehensive keyword mappings
export const COMMON_ALLERGENS = [
  {
    id: 'nuts',
    label: 'Tree Nuts & Almonds',
    icon: '🥜',
    keywords: [
      'nut',
      'almond',
      'sweet almond',
      'shea',
      'cashew',
      'walnut',
      'pistachio',
      'hazelnut',
      'prunus amygdalus',
      'butyrospermum parkii'
    ],
    hint: 'Blocks sweet almond oil, cold-pressed nut extracts, and unrefined shea butter'
  },
  {
    id: 'dairy',
    label: 'Dairy & Goat Milk',
    icon: '🥛',
    keywords: ['dairy', 'milk', 'goat milk', 'farm fresh goat', 'goat', 'lacto', 'whey', 'casein'],
    hint: 'Blocks farm-fresh whole goat milk cold-process soaps'
  },
  {
    id: 'honey',
    label: 'Bee Honey & Beeswax',
    icon: '🍯',
    keywords: ['honey', 'bee', 'beeswax', 'cera alba', 'propolis', 'royal jelly'],
    hint: 'Blocks raw forest honey lip polishes and natural beeswax polished keepsakes'
  },
  {
    id: 'fragrance',
    label: 'Synthetic Fragrance & Heavy Scents',
    icon: '🌸',
    keywords: ['fragrance', 'perfume', 'parfum', 'artificial fragrance', 'synthetic fragrance'],
    hint: 'Blocks artificial fragrances, prioritizing fragrance-free or pure hydrosols'
  },
  {
    id: 'coconut',
    label: 'Coconut Derivatives',
    icon: '🥥',
    keywords: ['coconut', 'cocos nucifera', 'coconut oil', 'coconut wax'],
    hint: 'Blocks saponified coconut oils and coconut-soy wax blends'
  },
  {
    id: 'gluten',
    label: 'Gluten & Oats',
    icon: '🌾',
    keywords: ['gluten', 'oat', 'colloidal oat', 'wheat', 'barley', 'rye'],
    hint: 'Blocks colloidal oat flours and wheat derivatives'
  }
];

/**
 * Checks a product's allergy status against active user restrictions.
 * Requirement 6: Known allergy conflicts are blocked.
 * Requirement 7: Missing ingredient or allergen info prevents product from being marked allergy-safe; returns verification warning.
 */
export function checkProductAllergyStatus(product, activeRestrictions = []) {
  const hasIngredients = Array.isArray(product.ingredients) && product.ingredients.length > 0;
  const hasAllergensInfo = typeof product.allergens === 'string' && product.allergens.trim().length > 0;
  const missingInfo = !hasIngredients || !hasAllergensInfo;

  const ingredientsText = (product.ingredients || []).join(' ').toLowerCase();
  const allergensText = (product.allergens || '').toLowerCase();
  const nameText = (product.name || '').toLowerCase();
  const fullSearchText = `${nameText} ${ingredientsText} ${allergensText}`;

  const matchedRestrictions = [];

  activeRestrictions.forEach((restriction) => {
    const rLower = String(restriction).trim().toLowerCase();
    if (!rLower) return;

    const predefined = COMMON_ALLERGENS.find(
      (a) => a.id === rLower || a.label.toLowerCase() === rLower
    );
    const keywords = predefined ? predefined.keywords : [rLower];

    const hasMatch = keywords.some((kw) => fullSearchText.includes(kw));

    if (hasMatch) {
      matchedRestrictions.push(predefined ? predefined.label : restriction);
    }
  });

  const isConflict = matchedRestrictions.length > 0;

  let warningMessage = null;
  if (missingInfo) {
    warningMessage = 'Ingredients or allergen information is missing — unverified safe.';
  }

  return {
    isSafe: !isConflict && (!missingInfo || activeRestrictions.length === 0),
    isConflict,
    missingInfo,
    matchedRestrictions,
    conflictReason: isConflict ? `Contains ${matchedRestrictions.join(', ')}` : null,
    warningMessage
  };
}

/**
 * Value Hamper Recommendation Engine
 * Generates 3 distinct options: Budget, Balanced, and Premium
 * Strictly enforces:
 * - Total price <= budget (NEVER exceeds customer budget)
 * - Packaging cost included in total
 * - Out-of-stock items excluded
 * - Known allergy conflicts blocked
 * - Missing info flagged with verification warning
 */
export function generateValueHampers({
  budget = 2000,
  allergyRestrictions = [],
  preferredPackagingId = null,
  products = [],
  includeCard = false
}) {
  const numericBudget = Math.max(0, Number(budget) || 2000);
  const cardFee = includeCard ? 199 : 0;

  // 1. Filter out-of-stock, pre-assembled hampers, and standalone packaging
  // Requirement 5: Out-of-stock products recommend nahi hone chahiye.
  const inStockStandalone = products.filter(
    (p) =>
      p.available &&
      (p.stock === undefined || p.stock > 0) &&
      p.category !== 'Gift Hampers' &&
      p.category !== 'Gift Packaging'
  );

  // 2. Evaluate allergy status for each item
  const evaluatedProducts = inStockStandalone.map((item) => {
    const allergyStatus = checkProductAllergyStatus(item, allergyRestrictions);
    return {
      ...item,
      allergyStatus
    };
  });

  // Requirement 6 & 7:
  // Strictly filter out products with known allergy conflicts.
  // If allergy restrictions are active, unverified items (missing info) are NOT considered safe and excluded from safe sets.
  const safeItems = evaluatedProducts.filter((item) => {
    if (item.allergyStatus.isConflict) return false;
    if (allergyRestrictions.length > 0 && item.allergyStatus.missingInfo) return false;
    return true;
  });

  const unverifiedItems = evaluatedProducts.filter((item) => item.allergyStatus.missingInfo);
  const minPackagingPrice = Math.min(...PACKAGING_OPTIONS.map((p) => p.price));
  const sortedByPriceAsc = [...safeItems].sort((a, b) => a.price - b.price);

  // Requirement 8: If budget or safe items cannot assemble a hamper, return clear message
  if (safeItems.length < 2) {
    return {
      success: false,
      reason: 'insufficient_safe_items',
      budget: numericBudget,
      activeAllergens: allergyRestrictions,
      unverifiedCount: unverifiedItems.length,
      message:
        allergyRestrictions.length > 0
          ? `We could not find enough allergy-safe in-stock products matching your allergy restrictions (${allergyRestrictions.join(
              ', '
            )}). Please consider relaxing or adjusting your allergy filters.`
          : 'Not enough in-stock products are available right now to assemble a hamper.',
      options: []
    };
  }

  const minPossibleHamperCost =
    minPackagingPrice + cardFee + sortedByPriceAsc[0].price + sortedByPriceAsc[1].price;

  if (numericBudget < minPossibleHamperCost) {
    return {
      success: false,
      reason: 'budget_too_low',
      budget: numericBudget,
      minRequiredBudget: minPossibleHamperCost,
      message: `The budget of ₹${numericBudget} is below the minimum required to assemble a hamper with keepsake packaging and at least 2 safe products (minimum required: ₹${minPossibleHamperCost}).`,
      options: []
    };
  }

  // Packaging selection helper
  const getPackaging = (tierId) => {
    if (preferredPackagingId) {
      const chosen = PACKAGING_OPTIONS.find((pkg) => pkg.id === preferredPackagingId);
      if (
        chosen &&
        chosen.price + cardFee + sortedByPriceAsc[0].price + sortedByPriceAsc[1].price <= numericBudget
      ) {
        return chosen;
      }
    }
    // Auto-select tier-appropriate packaging within budget
    if (tierId === 'budget') {
      return PACKAGING_OPTIONS.find((p) => p.id === 'pkg-2') || PACKAGING_OPTIONS[1]; // Eco Kraft Box (₹199)
    } else if (tierId === 'balanced') {
      const basket = PACKAGING_OPTIONS.find((p) => p.id === 'pkg-3'); // Woven Basket (₹349)
      const wrap = PACKAGING_OPTIONS.find((p) => p.id === 'pkg-4'); // Furoshiki (₹249)
      if (basket && basket.price + cardFee + 600 <= numericBudget) return basket;
      if (wrap && wrap.price + cardFee + 400 <= numericBudget) return wrap;
      return PACKAGING_OPTIONS[1];
    } else {
      // Premium tier
      const chest = PACKAGING_OPTIONS.find((p) => p.id === 'pkg-1'); // Pine Wood Chest (₹399)
      const basket = PACKAGING_OPTIONS.find((p) => p.id === 'pkg-3');
      if (chest && chest.price + cardFee + 900 <= numericBudget) return chest;
      if (basket && basket.price + cardFee + 600 <= numericBudget) return basket;
      return PACKAGING_OPTIONS[1];
    }
  };

  // Helper to build a tier hamper:
  // Guarantees: finalTotalPrice <= numericBudget
  function buildHamperForTier(tierConfig) {
    const packaging = getPackaging(tierConfig.tierId);
    const packagingCost = packaging.price;
    const availableProductBudget = numericBudget - packagingCost - cardFee;

    if (availableProductBudget <= 0) return null;

    let selectedProducts = [];
    let currentProductSum = 0;
    let candidatePool = [...safeItems];

    if (tierConfig.tierId === 'budget') {
      // Budget Option: Focus on value staples & cost-effective essentials (sorted by price ascending)
      candidatePool.sort((a, b) => a.price - b.price);

      for (const item of candidatePool) {
        if (selectedProducts.length >= tierConfig.maxItems) break;
        if (currentProductSum + item.price <= availableProductBudget) {
          selectedProducts.push(item);
          currentProductSum += item.price;
        }
      }
    } else if (tierConfig.tierId === 'balanced') {
      // Balanced Option: Mix of categories across skincare and bath & accessories
      const categoriesSeen = new Set();
      const sortedByRating = [...candidatePool].sort((a, b) => b.rating - a.rating);

      // Pass 1: Try diverse categories
      for (const item of sortedByRating) {
        if (selectedProducts.length >= tierConfig.maxItems) break;
        if (!categoriesSeen.has(item.category) && currentProductSum + item.price <= availableProductBudget) {
          selectedProducts.push(item);
          categoriesSeen.add(item.category);
          currentProductSum += item.price;
        }
      }

      // Pass 2: Fill remaining slots up to target count/budget
      for (const item of candidatePool) {
        if (selectedProducts.length >= tierConfig.maxItems) break;
        if (
          !selectedProducts.some((p) => p.id === item.id) &&
          currentProductSum + item.price <= availableProductBudget
        ) {
          selectedProducts.push(item);
          currentProductSum += item.price;
        }
      }
    } else {
      // Premium Option: Maximize luxury and budget utilization (highest-value items first)
      candidatePool.sort((a, b) => b.price - a.price);

      for (const item of candidatePool) {
        if (selectedProducts.length >= tierConfig.maxItems) break;
        if (currentProductSum + item.price <= availableProductBudget) {
          selectedProducts.push(item);
          currentProductSum += item.price;
        }
      }
    }

    // Safety fallback: Ensure at least 2 items fit
    if (selectedProducts.length < 2) {
      selectedProducts = [];
      currentProductSum = 0;
      for (const item of sortedByPriceAsc) {
        if (selectedProducts.length >= 2) break;
        if (currentProductSum + item.price <= availableProductBudget) {
          selectedProducts.push(item);
          currentProductSum += item.price;
        }
      }
    }

    if (selectedProducts.length < 2) return null;

    const totalProductPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
    const finalTotalPrice = totalProductPrice + packagingCost + cardFee;

    // Requirement 4: Final total customer ke budget se zyada nahi hona chahiye.
    if (finalTotalPrice > numericBudget) return null;

    // Requirement 2: Har option mein selected products, quantity aur price dikhao.
    const itemsWithQty = selectedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: 1,
      imageUrl: p.imageUrl,
      category: p.category,
      subCategory: p.subCategory,
      badge: p.badge,
      allergyStatus: p.allergyStatus
    }));

    return {
      tierId: tierConfig.tierId,
      tierName: tierConfig.tierName,
      subtitle: tierConfig.subtitle,
      badge: tierConfig.badge,
      description: tierConfig.description,
      products: itemsWithQty,
      packaging: {
        id: packaging.id,
        name: packaging.name,
        price: packaging.price,
        imageUrl: packaging.imageUrl,
        quantity: 1
      },
      card: includeCard
        ? {
            id: 'prod-per-2',
            name: 'Calligraphed Gold-Foiled Keepsake Wish Card & Wax Seal',
            price: 199,
            quantity: 1
          }
        : null,
      totalProductPrice,
      totalPrice: finalTotalPrice,
      budget: numericBudget,
      budgetRemaining: numericBudget - finalTotalPrice,
      itemCount: itemsWithQty.length,
      matchScore: tierConfig.matchScore,
      isGuaranteedUnderBudget: true
    };
  }

  // Requirement 1: Customer ko Budget, Balanced aur Premium ke 3 options dikhao.
  const tiersConfig = [
    {
      tierId: 'budget',
      tierName: 'Budget Hamper',
      subtitle: 'Value Essentials',
      badge: 'Smart Value • Best Savings',
      description: 'Streamlined essentials delivering handcrafted botanical pampering while saving you the most money.',
      maxItems: 3,
      matchScore: 92
    },
    {
      tierId: 'balanced',
      tierName: 'Balanced Hamper',
      subtitle: 'Harmonious Care',
      badge: 'Most Popular • Optimal Blend',
      description: 'An artful balance pairing nourishing facial care with calming bath luxuries for comprehensive delight.',
      maxItems: 4,
      matchScore: 96
    },
    {
      tierId: 'premium',
      tierName: 'Premium Hamper',
      subtitle: 'Grand Indulgence',
      badge: 'Maximum Luxury • Full Pampering',
      description: 'Maximizes your budget with award-winning saffron elixirs, jade facial tools, and keepsake timber craft.',
      maxItems: 5,
      matchScore: 99
    }
  ];

  const generatedOptions = [];
  for (const config of tiersConfig) {
    const hamper = buildHamperForTier(config);
    if (hamper) {
      generatedOptions.push(hamper);
    }
  }

  if (generatedOptions.length === 0) {
    return {
      success: false,
      reason: 'no_valid_combination',
      budget: numericBudget,
      minRequiredBudget: minPossibleHamperCost,
      message: `Could not assemble hamper options strictly within ₹${numericBudget}. Consider increasing your budget or adjusting allergy restrictions.`,
      options: []
    };
  }

  return {
    success: true,
    budget: numericBudget,
    options: generatedOptions,
    totalSafeProductsCount: safeItems.length,
    unverifiedItemsCount: unverifiedItems.length,
    activeAllergens: allergyRestrictions
  };
}

/**
 * Standard Occasion-based Hamper Recommendations (Wizard Mode)
 */
export function generateHamperRecommendations({
  occasion = 'Birthday',
  recipientRelationship = 'Best Friend',
  preferredCategories = [],
  style = 'Self-Care and Wellness',
  budgetMin = 500,
  budgetMax = 2000,
  products = []
}) {
  // 1. Filter only available standalone items
  const availableItems = products.filter(
    (p) => p.available && p.category !== 'Gift Hampers' && p.category !== 'Gift Packaging'
  );

  const availablePackaging = PACKAGING_OPTIONS;

  // 2. Select appropriate default packaging based on style
  let preferredPackaging = availablePackaging[1]; // default eco kraft
  if (style === 'Luxury') {
    preferredPackaging = availablePackaging[0]; // wooden chest
  } else if (style === 'Cute and Colourful' || style === 'Self-Care and Wellness') {
    preferredPackaging = availablePackaging[2]; // woven basket
  } else if (style === 'Minimal and Elegant') {
    preferredPackaging = availablePackaging[3] || availablePackaging[1]; // furoshiki wrap or kraft
  }

  // 3. Product scoring function based on user inputs
  function scoreProduct(item) {
    let score = 10;

    // Category affinity
    if (preferredCategories.length > 0) {
      if (preferredCategories.includes(item.category) || preferredCategories.includes(item.subCategory)) {
        score += 25;
      }
    }

    // Occasion affinity
    if (occasion === 'Wedding' || occasion === 'Anniversary') {
      if (item.name.includes('Saffron') || item.name.includes('Gua Sha') || item.name.includes('Rose') || item.name.includes('Candle')) {
        score += 20;
      }
    } else if (occasion === 'Self-Care') {
      if (item.name.includes('Lavender') || item.name.includes('Body Soufflé') || item.name.includes('Mist')) {
        score += 20;
      }
    } else if (occasion === 'Corporate Gifting') {
      if (item.name.includes('Candle') || item.name.includes('Gua Sha') || item.name.includes('Cedarwood')) {
        score += 15;
      }
    } else if (occasion === 'Birthday') {
      if (item.isPopular) score += 15;
    }

    // Style affinity
    if (style === 'Luxury' && item.price >= 600) score += 15;
    if (style === 'Minimal and Elegant' && item.category === 'Accessories') score += 10;
    if (
      style === 'Natural and Handmade' &&
      (item.category === 'Bath and Body' || item.ingredients?.some((i) => i.includes('Organic') || i.includes('Raw')))
    ) {
      score += 15;
    }

    return score;
  }

  // Sort pool of items by relevance score
  const sortedItems = [...availableItems].sort((a, b) => scoreProduct(b) - scoreProduct(a));

  const combinations = [];
  const cardFee = 199; // Calligraphed Keepsake Card

  const archetypes = [
    {
      tierName: `The ${occasion} Signature Ritual`,
      itemCount: 3,
      descTemplate: (style, occasion, rel) =>
        `Specially curated for your ${rel || 'recipient'} with a ${style.toLowerCase()} touch for ${occasion}. Pairs daily botanical self-care with an artisan keepsake.`
    },
    {
      tierName: `The ${style} Harmony Collection`,
      itemCount: 2,
      descTemplate: (style, occasion, rel) =>
        `A streamlined, elegant combination highlighting Surreal Treasures' highest-rated artisan creations.`
    },
    {
      tierName: `The ${occasion} Grand Indulgence`,
      itemCount: 4,
      descTemplate: (style, occasion, rel) =>
        `A comprehensive multi-item indulgence thoughtfully crafted for memorable celebration and long-lasting pampering.`
    }
  ];

  archetypes.forEach((archetype, archIndex) => {
    const selectedProducts = [];
    let currentTotal = preferredPackaging.price + cardFee;

    // Pick top scored items that fit within the budget ceiling
    for (const item of sortedItems) {
      if (selectedProducts.length >= archetype.itemCount) break;
      if (selectedProducts.some((p) => p.id === item.id)) continue;

      if (currentTotal + item.price <= budgetMax) {
        selectedProducts.push(item);
        currentTotal += item.price;
      }
    }

    // Ensure we have at least 2 items and it falls reasonably within budget
    if (selectedProducts.length >= 2 && currentTotal <= budgetMax) {
      const budgetRemaining = Math.max(0, budgetMax - currentTotal);
      const isWithinBudget = currentTotal >= budgetMin && currentTotal <= budgetMax;

      const itemBreakdown = [
        ...selectedProducts.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          imageUrl: p.imageUrl,
          quantity: 1
        })),
        {
          id: preferredPackaging.id,
          name: preferredPackaging.name,
          price: preferredPackaging.price,
          isPackaging: true,
          imageUrl: preferredPackaging.imageUrl,
          quantity: 1
        },
        {
          id: 'prod-per-2',
          name: 'Calligraphed Gold-Foiled Keepsake Card & Wax Seal',
          price: cardFee,
          isCard: true,
          quantity: 1
        }
      ];

      combinations.push({
        id: `rec-hamper-${archIndex + 1}-${Date.now()}`,
        name: archetype.tierName,
        style,
        occasion,
        recipientRelationship,
        packaging: preferredPackaging,
        products: selectedProducts,
        itemBreakdown,
        totalPrice: currentTotal,
        budgetRemaining,
        isWithinBudget,
        matchReason: archetype.descTemplate(style, occasion, recipientRelationship),
        matchScore: 92 + archetype.itemCount * 2 - archIndex
      });
    }
  });

  return combinations;
}

// Fallback search when budget is too tight
export function getBudgetFriendlyAlternatives(products, targetBudget) {
  return products
    .filter((p) => p.available && p.price <= targetBudget && p.category !== 'Gift Hampers')
    .slice(0, 4);
}
