import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelections } from '../context/SelectionContext';
import {
  OCCASIONS,
  GIFTING_STYLES,
  BUDGET_RANGES,
  PACKAGING_OPTIONS,
  CARD_TEMPLATES
} from '../data/demoProducts';
import {
  generateHamperRecommendations,
  getBudgetFriendlyAlternatives,
  generateValueHampers,
  COMMON_ALLERGENS,
  checkProductAllergyStatus
} from '../services/recommendationService';
import {
  Sparkles,
  Gift,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Package,
  Heart,
  Sliders,
  DollarSign,
  Info,
  ShoppingBag,
  RotateCcw,
  Tag,
  PenTool,
  ShieldCheck,
  AlertTriangle,
  X,
  CheckCircle2,
  CheckSquare,
  Square,
  ShieldAlert
} from 'lucide-react';

export default function GiftHamperBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, addHamperToCart } = useSelections();

  // Mode switcher: 'value' (Value Hamper Mode) or 'wizard' (Occasion Wizard)
  const [builderMode, setBuilderMode] = useState(
    searchParams.get('mode') === 'wizard' ? 'wizard' : 'value'
  );

  // --- VALUE HAMPER MODE STATE ---
  const [valueBudget, setValueBudget] = useState(2000);
  const [customValueBudgetInput, setCustomValueBudgetInput] = useState('2000');
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [customAllergenInput, setCustomAllergenInput] = useState('');
  const [valuePackagingId, setValuePackagingId] = useState('');
  const [valueIncludeCard, setValueIncludeCard] = useState(false);
  const [addedHamperTierId, setAddedHamperTierId] = useState(null);

  const BUDGET_PRESETS = [1000, 1500, 2000, 2500, 3000, 4000];

  const handleBudgetPresetClick = (amount) => {
    setValueBudget(amount);
    setCustomValueBudgetInput(String(amount));
  };

  const handleCustomBudgetChange = (e) => {
    const val = e.target.value;
    setCustomValueBudgetInput(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      setValueBudget(num);
    }
  };

  const toggleAllergen = (allergenId) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergenId)
        ? prev.filter((id) => id !== allergenId)
        : [...prev, allergenId]
    );
  };

  const addCustomAllergen = () => {
    const trimmed = customAllergenInput.trim();
    if (trimmed && !selectedAllergens.includes(trimmed)) {
      setSelectedAllergens((prev) => [...prev, trimmed]);
      setCustomAllergenInput('');
    }
  };

  const removeAllergen = (item) => {
    setSelectedAllergens((prev) => prev.filter((a) => a !== item));
  };

  // Synchronously compute Value Hamper 3-Tier Results
  const valueHamperResult = useMemo(() => {
    return generateValueHampers({
      budget: Number(valueBudget) || 2000,
      allergyRestrictions: selectedAllergens,
      preferredPackagingId: valuePackagingId || null,
      products,
      includeCard: valueIncludeCard
    });
  }, [valueBudget, selectedAllergens, valuePackagingId, valueIncludeCard, products]);

  const handleSelectValueHamper = (hamper) => {
    addHamperToCart({
      id: `value-${hamper.tierId}-${Date.now()}`,
      name: `${hamper.tierName} (${hamper.subtitle})`,
      occasion: 'Value Hamper Selection',
      style:
        hamper.tierId === 'premium'
          ? 'Luxury'
          : hamper.tierId === 'budget'
          ? 'Minimal and Elegant'
          : 'Self-Care and Wellness',
      packaging: hamper.packaging,
      products: hamper.products,
      cardMessage: valueIncludeCard
        ? 'Wishing you abundant joy, peace, and blissful pampering on your special day!'
        : '',
      recipientName: '',
      senderName: '',
      cardTemplate: 'gold-botanical',
      totalPrice: hamper.totalPrice
    });
    setAddedHamperTierId(hamper.tierId);
    setTimeout(() => {
      setAddedHamperTierId(null);
    }, 3000);
  };

  const handleCustomizeValueHamper = (hamper) => {
    setActiveHamper({
      id: `customized-value-${hamper.tierId}-${Date.now()}`,
      name: `${hamper.tierName} (${hamper.subtitle})`,
      occasion: 'Value Hamper',
      style:
        hamper.tierId === 'premium'
          ? 'Luxury'
          : hamper.tierId === 'budget'
          ? 'Minimal and Elegant'
          : 'Self-Care and Wellness',
      packaging: hamper.packaging,
      products: hamper.products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl,
        category: p.category,
        quantity: p.quantity || 1
      })),
      totalPrice: hamper.totalPrice
    });
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- OCCASION WIZARD STATE ---
  // Wizard state: 1 (Occasion), 2 (Recipient), 3 (Budget), 4 (Style), 5 (Recommendations), 6 (Customize)
  const [currentStep, setCurrentStep] = useState(1);

  // Form selections
  const [occasion, setOccasion] = useState(searchParams.get('occasion') || 'Birthday');
  const [recipientRelationship, setRecipientRelationship] = useState('Best Friend');
  const [preferredCategories, setPreferredCategories] = useState(['Handmade Skincare', 'Bath and Body']);
  const [themeColor, setThemeColor] = useState('Earthy Sage & Botanical');
  const [fragrancePref, setFragrancePref] = useState('French Lavender & Roman Chamomile');
  const [personalInterests, setPersonalInterests] = useState('Wellness & Relaxation');

  // Budget
  const [selectedBudgetRange, setSelectedBudgetRange] = useState('1000-2000');
  const [customBudgetMin, setCustomBudgetMin] = useState(1000);
  const [customBudgetMax, setCustomBudgetMax] = useState(2500);

  // Style
  const [style, setStyle] = useState('Self-Care and Wellness');

  // Generated recommendations
  const [recommendations, setRecommendations] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Customization active hamper state (Step 6)
  const [activeHamper, setActiveHamper] = useState(null);
  const [customCardMessage, setCustomCardMessage] = useState(
    'Wishing you abundant joy, peace, and blissful pampering on your special day!'
  );
  const [cardRecipient, setCardRecipient] = useState('');
  const [cardSender, setCardSender] = useState('');
  const [cardTemplate, setCardTemplate] = useState('gold-botanical');

  // Catalog item picker drawer during customization
  const [showItemPicker, setShowItemPicker] = useState(false);

  // Handle URL param shortcuts
  useEffect(() => {
    const occParam = searchParams.get('occasion');
    if (occParam) {
      setOccasion(occParam);
    }
    const customizeId = searchParams.get('customize');
    if (customizeId) {
      const found = products.find((p) => p.id === customizeId);
      if (found) {
        initCustomizationFromProduct(found);
      }
    }
  }, [searchParams, products]);

  // Budget min and max resolver
  const getActiveBudgetBounds = () => {
    if (selectedBudgetRange === 'custom') {
      return { min: Number(customBudgetMin) || 500, max: Number(customBudgetMax) || 3000 };
    }
    const found = BUDGET_RANGES.find((b) => b.id === selectedBudgetRange);
    return { min: found?.min || 1000, max: found?.max || 2000 };
  };

  // Run transparent recommendation engine
  const handleGenerateRecommendations = () => {
    const { min, max } = getActiveBudgetBounds();
    const results = generateHamperRecommendations({
      occasion,
      recipientRelationship,
      preferredCategories,
      style,
      budgetMin: min,
      budgetMax: max,
      products
    });
    setRecommendations(results);
    setHasGenerated(true);
    setCurrentStep(5);
  };

  // Transition to Step 6 Customization
  const handleCustomizeHamper = (hamper) => {
    setActiveHamper({
      id: hamper.id || `custom-hamper-${Date.now()}`,
      name: hamper.name,
      occasion: hamper.occasion || occasion,
      style: hamper.style || style,
      packaging: hamper.packaging || PACKAGING_OPTIONS[0],
      products: hamper.products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl,
        category: p.category,
        quantity: 1
      })),
      totalPrice: hamper.totalPrice
    });
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initialize customization from ready-made hamper
  const initCustomizationFromProduct = (readyHamper) => {
    const items = readyHamper.includedProductIds
      ? products.filter((p) => readyHamper.includedProductIds.includes(p.id))
      : products.slice(0, 3);

    const packaging =
      PACKAGING_OPTIONS.find((pkg) =>
        readyHamper.includedProductIds?.find((id) => id.startsWith('pkg-'))
      ) || PACKAGING_OPTIONS[0];

    const hamperItems = items
      .filter((i) => !i.id.startsWith('pkg-'))
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl,
        category: p.category,
        quantity: 1
      }));

    const cardPrice = 199;
    const computedTotal =
      hamperItems.reduce((s, i) => s + i.price * i.quantity, 0) + packaging.price + cardPrice;

    setActiveHamper({
      id: `customized-${readyHamper.id}-${Date.now()}`,
      name: readyHamper.name,
      occasion: readyHamper.occasionFit?.[0] || 'Celebration',
      style: readyHamper.style || 'Luxury',
      packaging,
      products: hamperItems,
      totalPrice: computedTotal
    });
    setCurrentStep(6);
  };

  // Step 6 Customization Modifiers
  const updateHamperItemQty = (productId, delta) => {
    if (!activeHamper) return;
    const updated = activeHamper.products
      .map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    recalculateActiveHamper(updated, activeHamper.packaging);
  };

  const removeHamperItem = (productId) => {
    if (!activeHamper) return;
    const updated = activeHamper.products.filter((item) => item.id !== productId);
    recalculateActiveHamper(updated, activeHamper.packaging);
  };

  const addProductToActiveHamper = (product) => {
    if (!activeHamper) return;
    const existing = activeHamper.products.find((p) => p.id === product.id);
    let updated;
    if (existing) {
      updated = activeHamper.products.map((p) =>
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      );
    } else {
      updated = [
        ...activeHamper.products,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category,
          quantity: 1
        }
      ];
    }
    recalculateActiveHamper(updated, activeHamper.packaging);
    setShowItemPicker(false);
  };

  const changePackaging = (pkg) => {
    if (!activeHamper) return;
    recalculateActiveHamper(activeHamper.products, pkg);
  };

  const recalculateActiveHamper = (itemsList, packaging) => {
    const cardPrice = 199;
    const itemsSum = itemsList.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    const newTotal = itemsSum + (packaging?.price || 0) + cardPrice;
    setActiveHamper((prev) => ({
      ...prev,
      products: itemsList,
      packaging,
      totalPrice: newTotal
    }));
  };

  // Save customized hamper to selections cart
  const handleSaveAndContinueToSelections = () => {
    if (!activeHamper || activeHamper.products.length === 0) return;

    addHamperToCart({
      id: activeHamper.id,
      name: activeHamper.name,
      occasion: activeHamper.occasion,
      style: activeHamper.style,
      packaging: activeHamper.packaging,
      products: activeHamper.products,
      cardMessage: customCardMessage,
      recipientName: cardRecipient,
      senderName: cardSender,
      cardTemplate,
      totalPrice: activeHamper.totalPrice
    });

    navigate('/selections');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Breadcrumb */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE2D5] text-xs font-semibold text-[#556B52]">
          <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Interactive Hamper Studio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3D2C1F]">
          {currentStep === 6
            ? 'Customise Your Selected Hamper'
            : builderMode === 'value'
            ? 'Value Hamper Mode'
            : 'Personalised Gift Hamper Builder'}
        </h1>
        <p className="text-sm text-[#7A6A5A]">
          {currentStep === 6
            ? 'Adjust quantities, swap botanical formulations, pick luxury packaging, and compose a calligraphed wish note.'
            : builderMode === 'value'
            ? 'Select your budget and allergy preferences. Our transparent engine instantly generates 3 curated options (Budget, Balanced, and Premium) with verified in-stock items and included packaging.'
            : 'Configure your preferences in a few thoughtful steps. Our transparent engine assembles real combinations within your budget.'}
        </p>
      </div>

      {/* Mode Selector Tabs (when not in Step 6 customisation) */}
      {currentStep !== 6 && (
        <div className="flex justify-center max-w-xl mx-auto">
          <div className="bg-[#EFE8DD] p-1.5 rounded-full flex items-center gap-1 border border-[#DDD2C3] shadow-inner w-full">
            <button
              type="button"
              onClick={() => {
                setBuilderMode('value');
                setCurrentStep(1);
              }}
              className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                builderMode === 'value'
                  ? 'bg-[#556B52] text-white shadow-md'
                  : 'text-[#6B5A4B] hover:text-[#3D2C1F]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#E8C5B8]" />
              <span>⚡ Value Hamper Mode</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-white/20 rounded-full font-normal">
                3 Options
              </span>
            </button>
            <button
              type="button"
              onClick={() => setBuilderMode('wizard')}
              className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                builderMode === 'wizard'
                  ? 'bg-[#4A3728] text-white shadow-md'
                  : 'text-[#6B5A4B] hover:text-[#3D2C1F]'
              }`}
            >
              <Sliders className="w-4 h-4 text-[#D4AF37]" />
              <span>Occasion Wizard</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-white/20 rounded-full font-normal">
                Step-by-Step
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- VALUE HAMPER MODE VIEW (Requirements 1, 2, 3, 4, 5, 6, 7, 8, 9) --- */}
      {/* ========================================================================= */}
      {builderMode === 'value' && currentStep !== 6 && (
        <div className="space-y-10 animate-fade-in">
          {/* Controls & Configuration Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DEC9] shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0E6D8] gap-2">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3D2C1F] flex items-center gap-2">
                  <span>Smart Hamper Configuration</span>
                  <span className="text-xs font-sans font-semibold bg-[#FAF3EA] text-[#556B52] px-3 py-1 rounded-full border border-[#E8DEC9]">
                    Strict Budget & Allergy Guard Active
                  </span>
                </h2>
                <p className="text-xs text-[#7A6A5A] mt-1">
                  Adjust budget ceiling, restrict allergens, or select packaging. Real combinations update instantaneously.
                </p>
              </div>

              {/* Guarantees Badges */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#556B52] font-medium">
                <span className="flex items-center gap-1 bg-[#EAEFEA] px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#556B52]" />
                  In-Stock Only
                </span>
                <span className="flex items-center gap-1 bg-[#EAEFEA] px-2.5 py-1 rounded-full">
                  <Package className="w-3.5 h-3.5 text-[#556B52]" />
                  Packaging Included
                </span>
              </div>
            </div>

            {/* Grid of 2 Columns: 1 Budget, 2 Allergens */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Budget Ceiling */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                    <span>Customer Budget Ceiling</span>
                  </label>
                  <span className="font-serif text-lg font-bold text-[#556B52]">
                    ₹{Number(valueBudget) || 0}
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-3 gap-2">
                  {BUDGET_PRESETS.map((amount) => {
                    const isSelected = Number(valueBudget) === amount;
                    return (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleBudgetPresetClick(amount)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-[#556B52] text-white border-[#556B52] shadow-sm'
                            : 'bg-[#FAF7F2] text-[#4A3728] border-[#E8DEC9] hover:bg-[#F2ECE1]'
                        }`}
                      >
                        ₹{amount}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Budget Input */}
                <div>
                  <span className="text-[11px] text-[#8C7A6A] block mb-1">
                    Or Enter Custom Budget Amount (₹ INR):
                  </span>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif text-sm font-bold text-[#7A6A5A]">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="500"
                      max="20000"
                      step="50"
                      value={customValueBudgetInput}
                      onChange={handleCustomBudgetChange}
                      placeholder="e.g. 1800"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-sm text-[#3D2C1F] focus:outline-none focus:ring-2 focus:ring-[#556B52]"
                    />
                  </div>
                </div>

                {/* Packaging & Card Add-ons */}
                <div className="pt-3 border-t border-[#F0E6D8] space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#4A3728] uppercase tracking-wider block mb-1">
                      Packaging Preference
                    </label>
                    <select
                      value={valuePackagingId}
                      onChange={(e) => setValuePackagingId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs text-[#3D2C1F] focus:outline-none focus:ring-2 focus:ring-[#556B52]"
                    >
                      <option value="">✨ Auto-Match by Tier (Recommended)</option>
                      {PACKAGING_OPTIONS.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} (+₹{pkg.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DEC9] cursor-pointer hover:bg-[#F5EFE6] transition-colors">
                    <input
                      type="checkbox"
                      checked={valueIncludeCard}
                      onChange={(e) => setValueIncludeCard(e.target.checked)}
                      className="w-4 h-4 rounded text-[#556B52] focus:ring-[#556B52] border-[#D5C7B4]"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-[#4A3728] block">
                        Include Calligraphed Keepsake Card (+₹199)
                      </span>
                      <span className="text-[11px] text-[#7A6A5A]">
                        Cotton rag paper with gold lettering & wax seal
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Right Column: Allergy Restrictions & Safety Verification */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[#C86D51]" />
                    <span>Allergy & Sensitivity Restrictions</span>
                  </label>
                  {selectedAllergens.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedAllergens([])}
                      className="text-[11px] text-[#C86D51] hover:underline font-semibold"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>

                <p className="text-xs text-[#7A6A5A]">
                  Select any ingredients your recipient must avoid. Products with known conflicting ingredients will be blocked.
                </p>

                {/* Common Allergen Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_ALLERGENS.map((allergen) => {
                    const isSelected = selectedAllergens.includes(allergen.id);
                    return (
                      <button
                        key={allergen.id}
                        type="button"
                        onClick={() => toggleAllergen(allergen.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-1.5 text-xs ${
                          isSelected
                            ? 'bg-[#FAF3EA] border-[#C86D51] text-[#9A3412] font-semibold ring-1 ring-[#C86D51]'
                            : 'bg-[#FAF7F2] border-[#E8DEC9] text-[#5A4A3A] hover:bg-[#F2ECE1]'
                        }`}
                      >
                        <span className="truncate">
                          {allergen.icon} {allergen.label}
                        </span>
                        {isSelected ? (
                          <X className="w-3.5 h-3.5 text-[#C86D51] shrink-0" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-[#9E9080] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Allergen Input */}
                <div className="pt-2">
                  <span className="text-[11px] text-[#8C7A6A] block mb-1">
                    Or Add Specific Sensitive Ingredient:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customAllergenInput}
                      onChange={(e) => setCustomAllergenInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomAllergen();
                        }
                      }}
                      placeholder="e.g. Lavender, Rose, Saffron, Grapefruit, Soy"
                      className="flex-1 px-3.5 py-2 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs text-[#3D2C1F] focus:outline-none focus:ring-2 focus:ring-[#556B52]"
                    />
                    <button
                      type="button"
                      onClick={addCustomAllergen}
                      className="px-4 py-2 rounded-xl bg-[#556B52] hover:bg-[#3E523B] text-white text-xs font-semibold shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Active Filter Tags */}
                {selectedAllergens.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-[#4A3728]">Active Blocks:</span>
                    {selectedAllergens.map((item) => {
                      const found = COMMON_ALLERGENS.find((a) => a.id === item);
                      const displayLabel = found ? found.label : item;
                      return (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-[#FAF0E6] text-[#9A3412] font-semibold border border-[#F3D7C5]"
                        >
                          <span>{displayLabel}</span>
                          <button
                            type="button"
                            onClick={() => removeAllergen(item)}
                            className="hover:text-red-700"
                            aria-label={`Remove ${displayLabel}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Strict Safety Notice (Requirement 7) */}
                <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#EADFCB] text-[11px] text-[#6B5A4B] leading-relaxed flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#4A3728] block mb-0.5">
                      Strict Allergen Safety & Verification Standard
                    </strong>
                    Known allergy conflicts are strictly blocked. In accordance with botanical safety protocols, any product with missing ingredient or allergen disclosures is NOT marked allergy-safe and is flagged with an explicit verification warning.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* --- RESULTS: 3 OPTIONS (Budget, Balanced, Premium) --- */}
          {/* ================================================================= */}
          {valueHamperResult.success ? (
            <div className="space-y-6">
              {/* Summary Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-[#FAF6EE] p-4 sm:p-5 rounded-2xl border border-[#E7DCB8] gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#556B52] bg-[#E9EFE9] px-3 py-1 rounded-full">
                    3 Hamper Options Ready
                  </span>
                  <span className="text-[#4A3728] font-medium">
                    Ceiling: ₹{valueBudget} • Packaging Included • In-Stock Verified
                  </span>
                </div>
                <div className="text-[11px] text-[#7A6A5A]">
                  Guaranteed: <strong className="text-[#556B52]">Final Total ≤ Customer Budget</strong>
                </div>
              </div>

              {/* 3 Tier Options Grid (Requirement 1) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {valueHamperResult.options.map((hamper) => {
                  const isBalanced = hamper.tierId === 'balanced';
                  const isPremium = hamper.tierId === 'premium';
                  const isJustAdded = addedHamperTierId === hamper.tierId;

                  return (
                    <div
                      key={hamper.tierId}
                      className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-md hover:shadow-xl ${
                        isBalanced
                          ? 'border-[#556B52] ring-2 ring-[#556B52]/30'
                          : isPremium
                          ? 'border-[#D4AF37]'
                          : 'border-[#E5DAC9]'
                      }`}
                    >
                      {/* Ribbon badge for Recommended / Most Popular */}
                      {isBalanced && (
                        <div className="bg-[#556B52] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 text-center">
                          ⭐ Recommended Best Value & Harmony
                        </div>
                      )}
                      {isPremium && (
                        <div className="bg-[#4A3728] text-[#E8C5B8] text-[10px] font-bold uppercase tracking-wider py-1 px-4 text-center">
                          👑 Maximum Luxury & Indulgence
                        </div>
                      )}

                      <div className="p-6 space-y-5">
                        {/* Tier Title & Badges */}
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="px-2.5 py-0.5 rounded-full font-semibold bg-[#EAE2D5] text-[#556B52]">
                              {hamper.badge}
                            </span>
                            <span className="text-[#8C7A6A] font-medium">
                              {hamper.matchScore}% Quality Match
                            </span>
                          </div>
                          <h3 className="font-serif text-2xl font-bold text-[#3D2C1F]">
                            {hamper.tierName}
                          </h3>
                          <span className="text-xs font-semibold text-[#8C7A6A]">
                            {hamper.subtitle}
                          </span>
                        </div>

                        {/* Pricing Highlight Box */}
                        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE6D8] space-y-1.5">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-[#7A6A5A]">Complete Hamper Total:</span>
                            <span className="font-serif text-3xl font-bold text-[#4A3728]">
                              ₹{hamper.totalPrice}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#EAE0D1]">
                            <span className="text-[#556B52] font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#556B52]" />
                              Under ₹{hamper.budget} budget ceiling
                            </span>
                            <span className="text-[#7A6A5A]">
                              ₹{hamper.budgetRemaining} remaining
                            </span>
                          </div>
                        </div>

                        {/* Rationale explanation */}
                        <p className="text-xs text-[#6B5A4B] leading-relaxed italic bg-[#FFFDF9] p-3 rounded-xl border border-[#F2ECE1]">
                          "{hamper.description}"
                        </p>

                        {/* Inclusions List: Products, Quantities, Prices (Requirement 2 & 3) */}
                        <div className="space-y-2.5">
                          <span className="text-[10px] font-bold text-[#8C7A6A] uppercase tracking-wider block">
                            Included In This Option ({hamper.products.length} Products + Packaging):
                          </span>

                          <div className="space-y-2">
                            {/* Products List */}
                            {hamper.products.map((item) => (
                              <div
                                key={item.id}
                                className="p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#EFE6D8] flex items-center gap-3 text-xs"
                              >
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#E5DAC9]"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline justify-between gap-1">
                                    <span className="font-semibold text-[#3D2C1F] truncate block">
                                      {item.name}
                                    </span>
                                    <span className="font-serif font-bold text-[#556B52] shrink-0">
                                      ₹{item.price}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between mt-0.5 text-[11px] text-[#7A6A5A]">
                                    <span className="bg-[#FAF7F2] px-1.5 py-0.5 rounded text-[10px] font-medium border border-[#EAE0D1]">
                                      Qty: {item.quantity}
                                    </span>

                                    {/* Allergen verification status tag (Requirement 7) */}
                                    {item.allergyStatus?.missingInfo ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-[#A6611A] bg-[#FEF6E4] px-1.5 py-0.5 rounded font-semibold border border-[#F4DCB0]">
                                        <AlertTriangle className="w-2.5 h-2.5 text-[#D97706]" />
                                        Unverified
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-[#556B52] bg-[#EAEFEA] px-1.5 py-0.5 rounded font-medium">
                                        <Check className="w-2.5 h-2.5 text-[#556B52]" />
                                        Allergy-Safe
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Packaging Inclusion Row (Requirement 3) */}
                            <div className="p-2.5 rounded-2xl bg-[#FAF4EB] border border-[#EADFCB] flex items-center gap-3 text-xs">
                              <img
                                src={hamper.packaging.imageUrl}
                                alt={hamper.packaging.name}
                                className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#DAC9B4]"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between gap-1">
                                  <span className="font-semibold text-[#4A3728] truncate block">
                                    {hamper.packaging.name}
                                  </span>
                                  <span className="font-serif font-bold text-[#556B52] shrink-0">
                                    ₹{hamper.packaging.price}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-0.5 text-[11px] text-[#7A6A5A]">
                                  <span className="bg-[#FFFDF9] px-1.5 py-0.5 rounded text-[10px] font-medium border border-[#E5DAC8]">
                                    Qty: 1 • Craft Packaging
                                  </span>
                                  <span className="text-[10px] text-[#556B52] font-semibold">
                                    Included in Total
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Optional Wish Card Row */}
                            {hamper.card && (
                              <div className="p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#EFE6D8] flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-semibold text-[#4A3728] block">
                                    {hamper.card.name}
                                  </span>
                                  <span className="text-[10px] text-[#7A6A5A]">
                                    Qty: 1 • Calligraphed Note
                                  </span>
                                </div>
                                <span className="font-serif font-bold text-[#556B52]">
                                  ₹{hamper.card.price}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer with Itemized Summary & Actions */}
                      <div className="p-6 bg-[#FAF7F2] border-t border-[#EAE0D1] space-y-4">
                        {/* Itemized math line */}
                        <div className="text-[11px] text-[#7A6A5A] flex items-center justify-between">
                          <span>
                            Items (₹{hamper.totalProductPrice}) + Packaging (₹{hamper.packaging.price})
                            {hamper.card ? ` + Card (₹${hamper.card.price})` : ''}
                          </span>
                          <span className="font-bold text-[#4A3728]">
                            = ₹{hamper.totalPrice}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleCustomizeValueHamper(hamper)}
                            className="py-3 px-3 rounded-xl border border-[#D5C7B4] hover:bg-white text-[#4A3728] text-xs font-semibold text-center transition-colors"
                          >
                            Customise Hamper
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectValueHamper(hamper)}
                            className={`py-3 px-3 rounded-xl text-white text-xs font-semibold text-center shadow-md transition-all flex items-center justify-center gap-1.5 ${
                              isJustAdded
                                ? 'bg-[#3E523B]'
                                : 'bg-[#556B52] hover:bg-[#3E523B] hover:scale-105'
                            }`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Choose Hamper</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* =============================================================== */
            /* --- EMPTY / INFEASIBLE STATE (Requirement 8) --- */
            /* =============================================================== */
            <div className="text-center py-16 px-6 bg-white rounded-3xl border border-[#E5DAC9] max-w-2xl mx-auto space-y-5 shadow-sm animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF3EA] text-[#C86D51] flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-[#3D2C1F]">
                  No Suitable Hamper Combination Available
                </h3>
                <p className="text-sm text-[#7A6A5A] max-w-md mx-auto leading-relaxed">
                  {valueHamperResult.message}
                </p>
              </div>

              {/* Helpful Action Suggestions */}
              {valueHamperResult.reason === 'budget_too_low' && (
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC9] max-w-md mx-auto space-y-3">
                  <span className="text-xs font-bold text-[#4A3728] block">
                    Recommended Minimum Budget: ₹{valueHamperResult.minRequiredBudget}
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleBudgetPresetClick(valueHamperResult.minRequiredBudget)}
                      className="px-4 py-2 rounded-xl bg-[#556B52] text-white text-xs font-semibold hover:bg-[#3E523B]"
                    >
                      Set Budget to ₹{valueHamperResult.minRequiredBudget}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBudgetPresetClick(1000)}
                      className="px-4 py-2 rounded-xl border border-[#D5C7B4] text-[#4A3728] text-xs font-medium hover:bg-white"
                    >
                      Set to ₹1,000
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBudgetPresetClick(1500)}
                      className="px-4 py-2 rounded-xl border border-[#D5C7B4] text-[#4A3728] text-xs font-medium hover:bg-white"
                    >
                      Set to ₹1,500
                    </button>
                  </div>
                </div>
              )}

              {valueHamperResult.reason === 'insufficient_safe_items' && (
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedAllergens([])}
                    className="px-6 py-2.5 rounded-xl bg-[#556B52] text-white text-xs font-semibold"
                  >
                    Clear Active Allergy Restrictions
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/shop')}
                    className="px-6 py-2.5 rounded-xl border border-[#D5C7B4] text-[#4A3728] text-xs font-medium"
                  >
                    Explore Shop Standalone Items
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- OCCASION WIZARD VIEW (Preserved from existing application) --- */}
      {/* ========================================================================= */}
      {builderMode === 'wizard' && currentStep <= 5 && (
        <div className="space-y-8 animate-fade-in">
          {/* Step Progress Indicators */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-[#E8DEC9] -z-10" />
              {[
                { num: 1, label: 'Occasion' },
                { num: 2, label: 'Recipient' },
                { num: 3, label: 'Budget' },
                { num: 4, label: 'Style' },
                { num: 5, label: 'Recommendations' }
              ].map((step) => {
                const isPassed = currentStep > step.num;
                const isCurrent = currentStep === step.num;
                return (
                  <div key={step.num} className="flex flex-col items-center">
                    <button
                      onClick={() => {
                        if (isPassed) setCurrentStep(step.num);
                      }}
                      disabled={!isPassed && !isCurrent}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm font-bold transition-all shadow-sm ${
                        isPassed
                          ? 'bg-[#556B52] text-white hover:scale-105'
                          : isCurrent
                          ? 'bg-[#4A3728] text-white ring-4 ring-[#E8C5B8]'
                          : 'bg-white text-[#9E9080] border border-[#DDD0BF]'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : step.num}
                    </button>
                    <span
                      className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                        isCurrent ? 'text-[#4A3728]' : 'text-[#8C7A6A]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 1: SELECT OCCASION */}
          {currentStep === 1 && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DEC9] shadow-md space-y-8 animate-fade-in">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#3D2C1F]">
                  Step 1: What is the celebratory occasion?
                </h2>
                <p className="text-xs text-[#7A6A5A] mt-1">
                  Selecting the right occasion helps us recommend sensory notes, aesthetics, and appropriate keepsakes.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {OCCASIONS.map((occ) => {
                  const selected = occasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setOccasion(occ.id)}
                      className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-3 ${
                        selected
                          ? 'bg-[#FAF3EA] border-[#556B52] ring-2 ring-[#556B52] shadow-sm'
                          : 'bg-[#FFFDF9] border-[#E8DEC9] hover:border-[#556B52]/50 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          selected ? 'bg-[#556B52] text-white' : 'bg-[#F2ECE1] text-[#556B52]'
                        }`}
                      >
                        <Gift className="w-6 h-6" />
                      </div>
                      <span className="font-serif font-semibold text-sm text-[#3D2C1F]">
                        {occ.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#F0E6D8] flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3.5 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all"
                >
                  <span>Continue to Preferences</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: RECIPIENT PREFERENCES */}
          {currentStep === 2 && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DEC9] shadow-md space-y-8 animate-fade-in">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#3D2C1F]">
                  Step 2: Who is this hamper for?
                </h2>
                <p className="text-xs text-[#7A6A5A] mt-1">
                  Personalize recipient relationship, fragrance inclinations, and theme aesthetics.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-2">
                    Recipient Relationship
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      'Best Friend',
                      'Partner / Spouse',
                      'Mother / Father',
                      'Sibling',
                      'Colleague / Mentor',
                      'Corporate Client',
                      'Self-Care',
                      'Loved One'
                    ].map((rel) => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => setRecipientRelationship(rel)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                          recipientRelationship === rel
                            ? 'bg-[#556B52] text-white border-[#556B52]'
                            : 'bg-[#FAF7F2] text-[#4A3728] border-[#E5DAC9] hover:bg-[#F2ECE1]'
                        }`}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-2">
                    Preferred Product Categories (Select at least one)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      'Handmade Skincare',
                      'Bath and Body',
                      'Personalised Gifts',
                      'Accessories',
                      'Artisan Soaps',
                      'Facial Tools'
                    ].map((cat) => {
                      const isChecked = preferredCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              if (preferredCategories.length > 1) {
                                setPreferredCategories(preferredCategories.filter((c) => c !== cat));
                              }
                            } else {
                              setPreferredCategories([...preferredCategories, cat]);
                            }
                          }}
                          className={`p-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                            isChecked
                              ? 'bg-[#FAF3EA] border-[#556B52] text-[#3D2C1F] font-semibold'
                              : 'bg-[#FAF7F2] border-[#E8DEC9] text-[#7A6A5A]'
                          }`}
                        >
                          <span>{cat}</span>
                          {isChecked && <Check className="w-3.5 h-3.5 text-[#556B52]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-2">
                      Preferred Scent / Aroma Profile
                    </label>
                    <select
                      value={fragrancePref}
                      onChange={(e) => setFragrancePref(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs text-[#3D2C1F] focus:outline-none focus:ring-2 focus:ring-[#556B52]"
                    >
                      <option value="French Lavender & Roman Chamomile">French Lavender & Roman Chamomile (Calming)</option>
                      <option value="Sweet Citrus & Wild Bergamot">Sweet Citrus & Wild Bergamot (Uplifting)</option>
                      <option value="Warm Saffron & Earthy Vetiver">Warm Saffron & Earthy Vetiver (Opulent)</option>
                      <option value="Mysore Sandalwood & Damask Rose">Mysore Sandalwood & Damask Rose (Romantic)</option>
                      <option value="Roasted Coffee & Warm Vanilla">Roasted Coffee & Warm Vanilla (Cozy)</option>
                      <option value="Unscented / Pure Botanicals">Unscented / Pure Botanicals (Hypoallergenic)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-2">
                      Theme & Aesthetic Palette
                    </label>
                    <select
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs text-[#3D2C1F] focus:outline-none focus:ring-2 focus:ring-[#556B52]"
                    >
                      <option value="Earthy Sage & Botanical">Earthy Sage & Natural Kraft</option>
                      <option value="Warm Ivory & Soft Gold">Warm Ivory & Soft Gold</option>
                      <option value="Blush Rose & Terracotta">Blush Rose & Terracotta</option>
                      <option value="Minimalist Charcoal & White">Minimalist Monochrome</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F0E6D8] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 rounded-full border border-[#D5C7B4] text-[#4A3728] text-xs font-medium flex items-center gap-2 hover:bg-[#FAF7F2]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3.5 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all"
                >
                  <span>Continue to Budget</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SET BUDGET */}
          {currentStep === 3 && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DEC9] shadow-md space-y-8 animate-fade-in">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#3D2C1F]">
                  Step 3: What budget would you like to allocate?
                </h2>
                <p className="text-xs text-[#7A6A5A] mt-1">
                  We never exceed your ceiling. Recommendations strictly include product values, keepsake packaging, and card craft.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BUDGET_RANGES.map((b) => {
                  const selected = selectedBudgetRange === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBudgetRange(b.id)}
                      className={`p-6 rounded-2xl border text-left transition-all ${
                        selected
                          ? 'bg-[#FAF3EA] border-[#556B52] ring-2 ring-[#556B52] shadow-sm'
                          : 'bg-[#FFFDF9] border-[#E8DEC9] hover:border-[#556B52]/50 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span className="font-serif text-xl font-bold text-[#4A3728] block">
                        {b.label}
                      </span>
                      <p className="text-xs text-[#7A6A5A] mt-1.5 leading-relaxed">
                        {b.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {selectedBudgetRange === 'custom' && (
                <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#E5DAC8] grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3728] mb-1">
                      Minimum Budget (₹ INR)
                    </label>
                    <input
                      type="number"
                      min="500"
                      step="100"
                      value={customBudgetMin}
                      onChange={(e) => setCustomBudgetMin(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3728] mb-1">
                      Maximum Budget (₹ INR)
                    </label>
                    <input
                      type="number"
                      min="500"
                      step="100"
                      value={customBudgetMax}
                      onChange={(e) => setCustomBudgetMax(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-white text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#F0E6D8] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-full border border-[#D5C7B4] text-[#4A3728] text-xs font-medium flex items-center gap-2 hover:bg-[#FAF7F2]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-3.5 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all"
                >
                  <span>Continue to Gifting Style</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CHOOSE GIFTING STYLE */}
          {currentStep === 4 && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DEC9] shadow-md space-y-8 animate-fade-in">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#3D2C1F]">
                  Step 4: What aesthetic or gifting style fits best?
                </h2>
                <p className="text-xs text-[#7A6A5A] mt-1">
                  Our algorithm prioritizes packaging, color accents, and ingredient formulations based on this style.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {GIFTING_STYLES.map((st) => {
                  const selected = style === st.name;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setStyle(st.name)}
                      className={`p-6 rounded-2xl border text-left transition-all ${
                        selected
                          ? 'bg-[#FAF3EA] border-[#556B52] ring-2 ring-[#556B52] shadow-sm'
                          : 'bg-[#FFFDF9] border-[#E8DEC9] hover:border-[#556B52]/50 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span className="font-serif font-bold text-base text-[#4A3728] block">
                        {st.name}
                      </span>
                      <p className="text-xs text-[#7A6A5A] mt-1 leading-relaxed">
                        {st.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#F0E6D8] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-full border border-[#D5C7B4] text-[#4A3728] text-xs font-medium flex items-center gap-2 hover:bg-[#FAF7F2]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateRecommendations}
                  className="px-8 py-3.5 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-[#556B52]/25 hover:scale-105 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#E8C5B8]" />
                  <span>Generate Personalised Hampers</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: RECOMMENDATIONS RESULTS CARDS */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-[#FAF6EE] p-5 rounded-2xl border border-[#E7DCB8] gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#556B52] bg-[#E9EFE9] px-3 py-1 rounded-full">
                    Active Criteria:
                  </span>
                  <span className="text-xs text-[#4A3728] font-medium">
                    {occasion} • For {recipientRelationship} • {style} • Budget {selectedBudgetRange}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-[#4A3728] hover:text-[#556B52] flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Adjust Criteria</span>
                </button>
              </div>

              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recommendations.map((hamper) => (
                    <div
                      key={hamper.id}
                      className="bg-white rounded-3xl border border-[#E5DAC9] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2.5 py-0.5 rounded-full font-semibold bg-[#E8C5B8] text-[#4A3728]">
                            {hamper.matchScore}% Match Score
                          </span>
                          <span className="text-[#8C7A6A] font-medium">
                            Budget Left: ₹{hamper.budgetRemaining}
                          </span>
                        </div>

                        <h3 className="font-serif text-2xl font-bold text-[#3D2C1F]">
                          {hamper.name}
                        </h3>

                        <div className="p-3 rounded-xl bg-[#FAF4EB] border border-[#EFE4D4] text-xs text-[#6B5A4B] leading-relaxed">
                          <span className="font-semibold text-[#4A3728] block mb-0.5">
                            Artisan Curation Logic:
                          </span>
                          {hamper.matchReason}
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-[#8C7A6A] uppercase tracking-wider block mb-2">
                            Included In This Combination ({hamper.products.length} Products + Packaging):
                          </span>
                          <div className="space-y-2">
                            {hamper.itemBreakdown.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2] border border-[#EFE6D8] text-xs"
                              >
                                <span className="truncate text-[#4A3728] font-medium max-w-[200px]">
                                  {item.name}
                                </span>
                                <span className="font-serif font-bold text-[#556B52]">
                                  ₹{item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-[#FAF7F2] border-t border-[#EAE0D1] space-y-4">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] text-[#8C7A6A] block">Complete Hamper Total</span>
                            <span className="font-serif text-2xl font-bold text-[#4A3728]">
                              ₹{hamper.totalPrice}
                            </span>
                          </div>
                          <span className="text-xs text-[#556B52] font-semibold">
                            Sum of items + packaging
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleCustomizeHamper(hamper)}
                            className="py-3 px-4 rounded-xl border border-[#D5C7B4] hover:bg-white text-[#4A3728] text-xs font-semibold text-center transition-colors"
                          >
                            Customise Hamper
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              addHamperToCart({
                                id: hamper.id,
                                name: hamper.name,
                                occasion: hamper.occasion,
                                style: hamper.style,
                                packaging: hamper.packaging,
                                products: hamper.products,
                                totalPrice: hamper.totalPrice
                              });
                              navigate('/selections');
                            }}
                            className="py-3 px-4 rounded-xl bg-[#556B52] hover:bg-[#3E523B] text-white text-xs font-semibold text-center shadow-sm transition-all hover:scale-105"
                          >
                            Choose Hamper
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#E5DAC9] max-w-2xl mx-auto space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF3EA] text-[#C86D51] flex items-center justify-center">
                    <Gift className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-[#3D2C1F]">
                    No Exact Combinations Within Current Budget
                  </h3>
                  <p className="text-sm text-[#7A6A5A] max-w-md mx-auto">
                    We could not build a full multi-item keepsake hamper strictly under this budget limit. Please consider adjusting your budget or exploring individual products.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBudgetRange('1000-2000');
                        setCurrentStep(3);
                      }}
                      className="px-6 py-3 rounded-full bg-[#556B52] text-white text-xs font-semibold"
                    >
                      Increase Budget Range
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/shop')}
                      className="px-6 py-3 rounded-full border border-[#D5C7B4] text-[#4A3728] text-xs font-medium"
                    >
                      Shop Standalone Items
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- STEP 6: CUSTOMIZE SELECTED HAMPER STUDIO (Common Editor) --- */}
      {/* ========================================================================= */}
      {currentStep === 6 && activeHamper && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          {/* Left: Customisation Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E5DAC9] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#556B52] tracking-wider block">
                  Bespoke Studio Edition
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#3D2C1F]">
                  {activeHamper.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (builderMode === 'value') {
                    setActiveHamper(null);
                    setCurrentStep(1);
                  } else {
                    setCurrentStep(5);
                  }
                }}
                className="text-xs font-semibold text-[#7A6A5A] hover:text-[#4A3728] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{builderMode === 'value' ? 'Back to Value Mode' : 'Switch Hamper'}</span>
              </button>
            </div>

            {/* 1. Items Customizer */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5DAC9] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#3D2C1F]">
                    Hamper Contents & Quantities
                  </h3>
                  <p className="text-xs text-[#7A6A5A]">
                    Add, remove, or modify quantities of artisan products.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowItemPicker(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#FAF0E4] hover:bg-[#F3E3D3] text-[#4A3728] text-xs font-semibold flex items-center gap-1 border border-[#E2D2BE]"
                >
                  <Plus className="w-3.5 h-3.5 text-[#556B52]" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {activeHamper.products.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC9] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <h4 className="font-medium text-xs sm:text-sm text-[#3D2C1F]">
                          {item.name}
                        </h4>
                        <span className="font-serif font-bold text-xs text-[#556B52]">
                          ₹{item.price} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white rounded-xl border border-[#D5C7B4] p-0.5">
                        <button
                          type="button"
                          onClick={() => updateHamperItemQty(item.id, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-[#4A3728] hover:bg-[#FAF7F2]"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-[#4A3728]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateHamperItemQty(item.id, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-[#4A3728] hover:bg-[#FAF7F2]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeHamperItem(item.id)}
                        className="p-1.5 text-[#A08C7D] hover:text-[#C86D51] rounded-lg transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Packaging Picker */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5DAC9] shadow-sm space-y-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#3D2C1F]">
                  Select Keepsake Packaging
                </h3>
                <p className="text-xs text-[#7A6A5A]">
                  Each hamper is packed with natural wood excelsior filler and dried botanical sprigs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PACKAGING_OPTIONS.map((pkg) => {
                  const isSelected = activeHamper.packaging?.id === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => changePackaging(pkg)}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'bg-[#FAF3EA] border-[#556B52] ring-2 ring-[#556B52]'
                          : 'bg-[#FFFDF9] border-[#E8DEC9] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-serif font-bold text-xs text-[#3D2C1F] block leading-snug">
                          {pkg.name}
                        </span>
                        <span className="font-bold text-xs text-[#556B52] block mt-1">
                          ₹{pkg.price}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Calligraphed Card Message */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5DAC9] shadow-sm space-y-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#3D2C1F] flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-[#D4AF37]" />
                  <span>Calligraphed Deckled Wish Card & Wax Seal (+₹199)</span>
                </h3>
                <p className="text-xs text-[#7A6A5A]">
                  Handmade cotton rag paper hand-lettered by our artisan calligrapher and sealed with hot antique gold wax.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CARD_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setCardTemplate(tmpl.id)}
                    className={`p-2 rounded-xl border text-center text-xs transition-all ${
                      cardTemplate === tmpl.id
                        ? 'bg-[#FAF3EA] border-[#556B52] font-bold ring-1 ring-[#556B52]'
                        : 'bg-[#FAF7F2] border-[#E8DEC9] text-[#7A6A5A]'
                    }`}
                  >
                    <span>{tmpl.motif}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Recipient Name (e.g. Dearest Mira)"
                  value={cardRecipient}
                  onChange={(e) => setCardRecipient(e.target.value)}
                  className="p-3 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs text-[#3D2C1F] focus:outline-none focus:ring-2 focus:ring-[#556B52]"
                />
                <input
                  type="text"
                  placeholder="Your Name / Signature (e.g. With love, Kabir)"
                  value={cardSender}
                  onChange={(e) => setCardSender(e.target.value)}
                  className="p-3 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs text-[#3D2C1F] focus:outline-none focus:ring-2 focus:ring-[#556B52]"
                />
              </div>

              <textarea
                rows={3}
                value={customCardMessage}
                onChange={(e) => setCustomCardMessage(e.target.value)}
                placeholder="Compose your custom heartfelt message to be hand-lettered onto the card..."
                className="w-full p-3.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs text-[#3D2C1F] focus:outline-none focus:ring-2 focus:ring-[#556B52] leading-relaxed"
              />
            </div>
          </div>

          {/* Right: Real-time Hamper Cost Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DAC9] shadow-lg space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#3D2C1F] pb-3 border-b border-[#F0E6D8]">
                Hamper Total Summary
              </h3>

              <div className="space-y-3 text-xs">
                {activeHamper.products.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-[#4A3728]">
                    <span className="truncate max-w-[200px]">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-serif font-bold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between items-center text-[#4A3728] pt-2 border-t border-[#F0E6D8]">
                  <span>{activeHamper.packaging?.name}</span>
                  <span className="font-serif font-bold">
                    ₹{activeHamper.packaging?.price || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#4A3728]">
                  <span>Calligraphed Keepsake Card & Wax Seal</span>
                  <span className="font-serif font-bold">₹199</span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-[#556B52]/20 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#8C7A6A] block">Final Hamper Total</span>
                  <span className="font-serif text-3xl font-bold text-[#4A3728]">
                    ₹{activeHamper.totalPrice}
                  </span>
                </div>
                <span className="text-xs text-[#556B52] font-semibold">
                  All taxes & craft included
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAndContinueToSelections}
                  className="w-full py-4 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-sm shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#E8C5B8]" />
                  <span>Save Hamper & Go to Selections</span>
                </button>

                <p className="text-[11px] text-center text-[#8C7A6A] leading-relaxed">
                  You can review all items and submit your official order enquiry on the next screen.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Item Picker Modal for Hamper Customization */}
      {showItemPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-[#E5DAC8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC9]">
              <h3 className="font-serif text-xl font-bold text-[#3D2C1F]">
                Add Item to Hamper
              </h3>
              <button
                type="button"
                onClick={() => setShowItemPicker(false)}
                className="text-xs font-semibold text-[#8C7A6A] hover:text-[#4A3728]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products
                .filter((p) => p.available && p.category !== 'Gift Hampers' && p.category !== 'Gift Packaging')
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8DEC9] text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <span className="font-medium text-[#4A3728] block truncate max-w-[140px]">
                          {product.name}
                        </span>
                        <span className="font-serif font-bold text-[#556B52]">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addProductToActiveHamper(product)}
                      className="px-3 py-1.5 rounded-lg bg-[#556B52] hover:bg-[#3E523B] text-white font-semibold text-[11px]"
                    >
                      + Add
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
