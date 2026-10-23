import React, { useState, useEffect } from 'react';
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
  getBudgetFriendlyAlternatives
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
  PenTool
} from 'lucide-react';

export default function GiftHamperBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, addHamperToCart } = useSelections();

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
  const [customCardMessage, setCustomCardMessage] = useState('Wishing you abundant joy, peace, and blissful pampering on your special day!');
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
    // Clone hamper into active editable state
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

    const packaging = PACKAGING_OPTIONS.find((pkg) => pkg.id === readyHamper.includedProductIds?.find(id => id.startsWith('pkg-'))) || PACKAGING_OPTIONS[0];

    const hamperItems = items.filter(i => !i.id.startsWith('pkg-')).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      category: p.category,
      quantity: 1
    }));

    const cardPrice = 199;
    const computedTotal = hamperItems.reduce((s, i) => s + i.price * i.quantity, 0) + packaging.price + cardPrice;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Breadcrumb */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE2D5] text-xs font-semibold text-[#556B52]">
          <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Interactive Hamper Studio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3D2C1F]">
          {currentStep === 6 ? 'Customise Your Selected Hamper' : 'Personalised Gift Hamper Builder'}
        </h1>
        <p className="text-sm text-[#7A6A5A]">
          {currentStep === 6
            ? 'Adjust quantities, swap botanical formulations, pick luxury packaging, and compose a calligraphed wish note.'
            : 'Configure your preferences in a few thoughtful steps. Our transparent engine assembles real combinations within your budget.'}
        </p>
      </div>

      {/* Step Progress Indicators */}
      {currentStep <= 5 && (
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
      )}

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
            {/* Relationship */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-2">
                Recipient Relationship
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['Best Friend', 'Partner / Spouse', 'Mother / Father', 'Sibling', 'Colleague / Mentor', 'Corporate Client', 'Self-Care', 'Loved One'].map((rel) => (
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

            {/* Preferred Categories */}
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

            {/* Scent & Aroma profile */}
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

          {/* Custom budget inputs */}
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
              Step 4: Choose your gifting style & aesthetic
            </h2>
            <p className="text-xs text-[#7A6A5A] mt-1">
              This dictates whether we prioritize raw botanical textures, opulent gilded jars, or mindful calming rituals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GIFTING_STYLES.map((st) => {
              const selected = style === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStyle(st.id)}
                  className={`p-6 rounded-2xl border text-left transition-all ${
                    selected
                      ? 'bg-[#FAF3EA] border-[#556B52] ring-2 ring-[#556B52] shadow-sm'
                      : 'bg-[#FFFDF9] border-[#E8DEC9] hover:border-[#556B52]/50 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span className="font-serif text-lg font-bold text-[#4A3728] block">
                    {st.name}
                  </span>
                  <p className="text-xs text-[#7A6A5A] mt-2 leading-relaxed">
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
          {/* Controls Bar */}
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

          {/* Results Grid */}
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((hamper) => (
                <div
                  key={hamper.id}
                  className="bg-white rounded-3xl border border-[#E5DAC9] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    {/* Header */}
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

                    {/* Why this matches explanation */}
                    <div className="p-3 rounded-xl bg-[#FAF4EB] border border-[#EFE4D4] text-xs text-[#6B5A4B] leading-relaxed">
                      <span className="font-semibold text-[#4A3728] block mb-0.5">Artisan Curation Logic:</span>
                      {hamper.matchReason}
                    </div>

                    {/* Included Products Visual Pills */}
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

                  {/* Card Footer with Pricing & Actions */}
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
            /* Friendly Empty State */
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

      {/* STEP 6: CUSTOMIZE SELECTED HAMPER */}
      {currentStep === 6 && activeHamper && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          {/* Left: Customisation Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Hamper Title & Occasion Pill */}
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
                onClick={() => setCurrentStep(5)}
                className="text-xs font-semibold text-[#7A6A5A] hover:text-[#4A3728] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Switch Hamper</span>
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
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC]"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-xs text-[#3D2C1F] line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="text-xs font-serif font-bold text-[#556B52]">
                          ₹{item.price} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Qty button */}
                      <div className="flex items-center bg-white rounded-xl border border-[#DDD1C0] p-0.5">
                        <button
                          type="button"
                          onClick={() => updateHamperItemQty(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#4A3728] hover:bg-[#FAF7F2]"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-[#4A3728]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateHamperItemQty(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#4A3728] hover:bg-[#FAF7F2]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeHamperItem(item.id)}
                        className="p-2 text-[#9E8B7A] hover:text-[#C86D51] transition-colors"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Packaging Selector */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5DAC9] shadow-sm space-y-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#3D2C1F]">
                  Select Luxury Gift Packaging
                </h3>
                <p className="text-xs text-[#7A6A5A]">
                  Every packaging option includes protective natural pine shavings or linen lining.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PACKAGING_OPTIONS.map((pkg) => {
                  const selected = activeHamper.packaging?.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => changePackaging(pkg)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                        selected
                          ? 'bg-[#FAF3EA] border-[#556B52] ring-2 ring-[#556B52]'
                          : 'bg-[#FAF7F2] border-[#E8DEC9] hover:bg-white'
                      }`}
                    >
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="font-medium text-xs text-[#3D2C1F] block leading-snug">
                          {pkg.name}
                        </span>
                        <span className="text-xs font-serif font-bold text-[#556B52]">
                          ₹{pkg.price}
                        </span>
                        <p className="text-[10px] text-[#8C7A6A] line-clamp-2">
                          {pkg.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Calligraphed Keepsake Card & Wax Seal Message */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5DAC9] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#3D2C1F]">
                    Personalised Keepsake Card & Wax Seal
                  </h3>
                  <p className="text-xs text-[#7A6A5A]">
                    Handwritten on 300 GSM deckled cotton paper with antique gold wax seal stamp (Included: ₹199).
                  </p>
                </div>
                <PenTool className="w-5 h-5 text-[#D4AF37]" />
              </div>

              {/* Card Design Template selection */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {CARD_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setCardTemplate(tmpl.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      cardTemplate === tmpl.id
                        ? 'border-[#556B52] bg-[#FAF3EA] font-semibold text-[#4A3728] ring-1 ring-[#556B52]'
                        : 'border-[#E8DEC9] bg-[#FAF7F2] text-[#7A6A5A]'
                    }`}
                  >
                    <span>{tmpl.motif}</span>
                    <span className="block text-[10px] text-[#8C7A6A] mt-0.5">{tmpl.name}</span>
                  </button>
                ))}
              </div>

              {/* To / From */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A3728] uppercase mb-1">
                    To (Recipient Name)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Ananya / Dearest Friend"
                    value={cardRecipient}
                    onChange={(e) => setCardRecipient(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A3728] uppercase mb-1">
                    From (Your Name / Family)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., With love, Rahul & Sanya"
                    value={cardSender}
                    onChange={(e) => setCardSender(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs"
                  />
                </div>
              </div>

              {/* Message text */}
              <div>
                <label className="block text-[11px] font-semibold text-[#4A3728] uppercase mb-1">
                  Card Message (Handwritten in Ink)
                </label>
                <textarea
                  rows="3"
                  value={customCardMessage}
                  onChange={(e) => setCustomCardMessage(e.target.value)}
                  placeholder="Compose your heartfelt message here..."
                  className="w-full p-3 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs text-[#3D2C1F] focus:outline-none focus:ring-2 focus:ring-[#556B52]"
                />
              </div>
            </div>
          </div>

          {/* Right: Real-time Hamper Preview & Price Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-28 bg-[#FAF6EE] rounded-3xl p-6 sm:p-8 border border-[#E5DAC8] shadow-lg space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#556B52] tracking-wider block">
                  Live Hamper Preview
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#3D2C1F]">
                  Estimated Hamper Total
                </h3>
              </div>

              {/* Itemized Price Breakdown */}
              <div className="space-y-2.5 text-xs text-[#554637] border-y border-[#E8DEC9] py-4">
                {activeHamper.products.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-serif font-bold text-[#4A3728] shrink-0">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}

                {activeHamper.packaging && (
                  <div className="flex items-center justify-between text-[#556B52]">
                    <span className="truncate pr-2">
                      1x {activeHamper.packaging.name}
                    </span>
                    <span className="font-serif font-bold shrink-0">
                      ₹{activeHamper.packaging.price}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#8C6D4C]">
                  <span>1x Calligraphed Deckled Wish Card</span>
                  <span className="font-serif font-bold">₹199</span>
                </div>
              </div>

              {/* Live Total */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#7A6A5A] block">Total Estimated Price</span>
                  <span className="font-serif text-3xl font-bold text-[#4A3728]">
                    ₹{activeHamper.totalPrice}
                  </span>
                </div>
                <span className="text-xs text-[#556B52] font-semibold bg-[#E9EFE9] px-3 py-1 rounded-full">
                  All Taxes Included
                </span>
              </div>

              {/* Save & Checkout CTA */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAndContinueToSelections}
                  className="w-full py-4 rounded-2xl bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#556B52]/20 hover:scale-[1.02] transition-all"
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
