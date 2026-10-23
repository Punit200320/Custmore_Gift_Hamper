// Rule-Based Hamper Recommendation Engine for Surreal Treasures
// Transparently assembles available catalog items into harmonious gift combinations
// strictly respecting user budget, occasion, recipient relationship, and styling preferences.

import { PACKAGING_OPTIONS } from '../data/demoProducts';

export function generateHamperRecommendations({
  occasion = 'Birthday',
  recipientRelationship = 'Best Friend',
  preferredCategories = [],
  style = 'Self-Care and Wellness',
  budgetMin = 500,
  budgetMax = 2000,
  products = []
}) {
  // 1. Filter only available standalone items (exclude hampers and packaging from raw items)
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
      if (item.name.includes('Lavender') || item.name.includes('Body Soufflé') || item.name.includes('Scratch') || item.name.includes('Mist')) {
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
    if (style === 'Natural and Handmade' && (item.category === 'Bath and Body' || item.ingredients?.some(i => i.includes('Organic') || i.includes('Raw')))) score += 15;

    return score;
  }

  // Sort pool of items by relevance score
  const sortedItems = [...availableItems].sort((a, b) => scoreProduct(b) - scoreProduct(a));

  const combinations = [];
  const cardFee = 199; // Calligraphed Keepsake Card

  // Generate up to 3 distinct hamper tiers within budget constraints
  // Tier 1: "Harmony / Essential Set" (2-3 items)
  // Tier 2: "Signature Ritual Collection" (3-4 items)
  // Tier 3: "Grand Celebration Keepsake" (4-5 items)

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

      // Don't add duplicate
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

      // Itemized names
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
        matchScore: 92 + (archetype.itemCount * 2) - archIndex
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
