import AnimatedPage from "../components/AnimatedPage";
import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelections } from '../context/SelectionContext';
import {
  HAMPER_SIZES,
  PACKAGING_OPTIONS,
  OCCASIONS,
  GIFTING_STYLES,
  BUDGET_RANGES
} from '../data/demoProducts';
import {
  generateValueHampers,
  generateHamperRecommendations,
  COMMON_ALLERGENS,
  checkProductAllergyStatus
} from '../services/recommendationService';
import Hamper2DVisualizer from '../components/Hamper2DVisualizer';
import CelebrationCard2DVisualizer from '../components/CelebrationCard2DVisualizer';
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Upload,
  ShoppingBag,
  Trash2,
  Check,
  Sliders,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  Package,
  Info,
  X,
  Palette,
  HeartHandshake
} from 'lucide-react';

const createHamperUniqueId = (prefix) => `${prefix}-${Date.now()}`;

export default function GiftHamperBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, addHamperToCart } = useSelections();

  // Top Mode Switcher: 'studio' (2D Hamper Studio) | 'value' (Value Hamper Mode) | 'wizard' (Occasion Wizard)
  const initialMode = searchParams.get('mode') === 'value'
    ? 'value'
    : searchParams.get('mode') === 'wizard' || searchParams.get('occasion')
    ? 'wizard'
    : 'studio';

  const [builderMode, setBuilderMode] = useState(initialMode);

  // Available catalog products for hampers (excluding hampers and raw packaging)
  const availableCatalogProducts = useMemo(() => {
    return products.filter(
      (p) => p.available && p.category !== 'Gift Hampers' && p.category !== 'Gift Packaging'
    );
  }, [products]);

  // =========================================================================
  // --- 1. INTERACTIVE 2D STUDIO STATE ---
  // =========================================================================
  // Active Tab in Studio: 'hamper' | 'card' | 'review'
  const [activeTab, setActiveTab] = useState('hamper');

  // Hamper Configuration
  const [hamperSize, setHamperSize] = useState(() => {
    const customizeId = searchParams.get('customize');
    if (customizeId) {
      const ready = products.find((p) => p.id === customizeId);
      if (ready && ready.includedProductIds) {
        const count = ready.includedProductIds.filter((id) => !id.startsWith('pkg-')).length;
        if (count <= 3) return HAMPER_SIZES[0];
        if (count <= 5) return HAMPER_SIZES[1];
        if (count <= 8) return HAMPER_SIZES[2];
        return HAMPER_SIZES[3];
      }
    }
    return HAMPER_SIZES[1];
  });

  const [selectedPackaging, setSelectedPackaging] = useState(() => {
    const customizeId = searchParams.get('customize');
    if (customizeId) {
      const ready = products.find((p) => p.id === customizeId);
      if (ready && ready.includedProductIds) {
        const pkgMatch = PACKAGING_OPTIONS.find((pkg) =>
          ready.includedProductIds.includes(pkg.id)
        );
        if (pkgMatch) return pkgMatch;
      }
    }
    return PACKAGING_OPTIONS[0];
  });

  const [selectedItems, setSelectedItems] = useState(() => {
    const customizeId = searchParams.get('customize');
    if (customizeId) {
      const ready = products.find((p) => p.id === customizeId);
      if (ready && ready.includedProductIds) {
        return products
          .filter((p) => ready.includedProductIds.includes(p.id) && !p.id.startsWith('pkg-'))
          .map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            imageUrl: p.imageUrl,
            quantity: 1
          }));
      }
    }
    const avail = products.filter(
      (p) => p.available && p.category !== 'Gift Hampers' && p.category !== 'Gift Packaging'
    );
    return avail.slice(0, 3).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      quantity: 1
    }));
  });

  const [productCategoryFilter, setProductCategoryFilter] = useState('All');

  // Celebration Card
  const [cardPhoto, setCardPhoto] = useState(null);
  const [celebrationTitle, setCelebrationTitle] = useState('Warmest Wishes');
  const [cardRecipient, setCardRecipient] = useState('');
  const [cardSender, setCardSender] = useState('');
  const [cardMessage, setCardMessage] = useState(
    'Wishing you radiant joy, abundant blessings, and peaceful moments.'
  );

  const currentTotalItemCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const maxCapacity = hamperSize?.maxItems || 5;

  // Filtered products in studio
  const filteredStudioProducts = useMemo(() => {
    if (productCategoryFilter === 'All') return availableCatalogProducts;
    return availableCatalogProducts.filter((p) => p.category === productCategoryFilter);
  }, [availableCatalogProducts, productCategoryFilter]);

  // Categories list for Studio product picker
  const studioCategories = useMemo(() => {
    const cats = new Set(availableCatalogProducts.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, [availableCatalogProducts]);

  // Pricing for Studio
  const productsSubtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const packagingPrice = selectedPackaging?.price || 0;
  const cardPrice = 199;
  const totalPrice = productsSubtotal + packagingPrice + cardPrice;

  // =========================================================================
  // --- 2. VALUE HAMPER MODE STATE ---
  // =========================================================================
  const [valueBudget, setValueBudget] = useState(2000);
  const [customValueBudgetInput, setCustomValueBudgetInput] = useState('2000');
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [customAllergenInput, setCustomAllergenInput] = useState('');
  const [valuePackagingId, setValuePackagingId] = useState('');
  const [valueIncludeCard, setValueIncludeCard] = useState(true);
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

  // =========================================================================
  // --- 3. OCCASION WIZARD STATE ---
  // =========================================================================
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardOccasion, setWizardOccasion] = useState(searchParams.get('occasion') || 'Birthday');
  const [recipientRelationship, setRecipientRelationship] = useState('Best Friend');
  const [wizardCategories, setWizardCategories] = useState(['Handmade Skincare', 'Bath and Body']);
  const [wizardStyle, setWizardStyle] = useState('Self-Care and Wellness');
  const [wizardBudgetRange, setWizardBudgetRange] = useState('1000-2000');
  const [wizardCustomMin, setWizardCustomMin] = useState(1000);
  const [wizardCustomMax, setWizardCustomMax] = useState(2500);
  const [wizardRecommendations, setWizardRecommendations] = useState([]);

  const getWizardBudgetBounds = () => {
    if (wizardBudgetRange === 'custom') {
      return { min: Number(wizardCustomMin) || 500, max: Number(wizardCustomMax) || 3000 };
    }
    const found = BUDGET_RANGES.find((b) => b.id === wizardBudgetRange);
    return { min: found?.min || 1000, max: found?.max || 2000 };
  };

  const handleGenerateWizard = () => {
    const { min, max } = getWizardBudgetBounds();
    const results = generateHamperRecommendations({
      occasion: wizardOccasion,
      recipientRelationship,
      preferredCategories: wizardCategories,
      style: wizardStyle,
      budgetMin: min,
      budgetMax: max,
      products
    });
    setWizardRecommendations(results);
    setWizardStep(5);
  };

  // Helper to load any combination directly into 2D Studio
  const loadIntoStudio = (items, packaging, occasionName = 'Custom Hamper') => {
    const totalCount = items.reduce((s, i) => s + (i.quantity || 1), 0);
    // Find matching size
    let matchedSize = HAMPER_SIZES[1];
    if (totalCount <= 3) matchedSize = HAMPER_SIZES[0];
    else if (totalCount <= 5) matchedSize = HAMPER_SIZES[1];
    else if (totalCount <= 8) matchedSize = HAMPER_SIZES[2];
    else matchedSize = HAMPER_SIZES[3];

    setHamperSize(matchedSize);
    if (packaging) {
      const pkgMatch = PACKAGING_OPTIONS.find((p) => p.id === packaging.id) || packaging;
      setSelectedPackaging(pkgMatch);
    }
    setSelectedItems(
      items.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        imageUrl: it.imageUrl,
        quantity: it.quantity || 1
      }))
    );
    setCelebrationTitle(occasionName);
    setBuilderMode('studio');
    setActiveTab('hamper');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product Selection Handlers for Studio
  const handleAddItem = (product) => {
    if (currentTotalItemCount >= maxCapacity) return;

    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1
        }
      ];
    });
  };

  const handleDecreaseItem = (productId) => {
    setSelectedItems((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const nextQty = item.quantity - 1;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (productId) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Photo Upload Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save to Cart from 2D Studio
  const handleSaveStudioHamperToCart = () => {
    if (selectedItems.length === 0) return;

    addHamperToCart({
      id: createHamperUniqueId('custom-hamper'),
      name: `${hamperSize.name} ${selectedPackaging.name}`,
      occasion: celebrationTitle || 'Custom Hamper',
      packaging: selectedPackaging,
      hamperSize: hamperSize.name,
      products: selectedItems,
      celebrationCard: {
        photo: cardPhoto,
        title: celebrationTitle,
        message: cardMessage,
        recipient: cardRecipient,
        sender: cardSender
      },
      cardMessage,
      recipientName: cardRecipient,
      senderName: cardSender,
      totalPrice
    });

    navigate('/selections');
  };

  // Add directly from Value Hamper Mode
  const handleSelectValueHamper = (hamper) => {
    addHamperToCart({
      id: createHamperUniqueId(`value-${hamper.tierId}`),
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
        ? 'Wishing you radiant joy, abundant blessings, and peaceful moments.'
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

  // Add directly from Occasion Wizard
  const handleSelectWizardHamper = (hamper) => {
    addHamperToCart({
      id: createHamperUniqueId('wizard'),
      name: hamper.name,
      occasion: hamper.occasion,
      style: hamper.style,
      packaging: hamper.packaging,
      products: hamper.products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl,
        quantity: 1
      })),
      cardMessage: 'Wishing you abundant blessings and radiant joy on this special occasion.',
      recipientName: '',
      senderName: '',
      cardTemplate: 'gold-botanical',
      totalPrice: hamper.totalPrice
    });
    navigate('/selections');
  };

  return (
    <AnimatedPage>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header & Mode Switcher */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3EA] border border-[#E8DEC9] text-xs font-semibold text-[#556B52]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#556B52]"></span>
          <span>Bespoke Gifting Studio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3D2C1F]">
          {builderMode === 'studio'
            ? 'Interactive Hamper Studio'
            : builderMode === 'value'
            ? 'Value Hamper Mode'
            : 'Occasion Gifting Wizard'}
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6A5A]">
          {builderMode === 'studio'
            ? 'Design your keepsake hamper with live 2D box visualization, custom capacity, and calligraphed celebration card.'
            : builderMode === 'value'
            ? 'Set your budget ceiling and botanical sensitivity filters. Our transparent engine curates 3 guaranteed under-budget options.'
            : 'Let our guided wizard recommend the ideal pairing for your special milestone, recipient, and gifting aesthetic.'}
        </p>

        {/* Top 3-Mode Switcher */}
        <div className="pt-2 flex justify-center">
          <div className="bg-[#FAF7F2] p-1.5 rounded-2xl flex items-center gap-1 border border-[#E8DEC9] shadow-xs max-w-xl w-full">
            <button
              type="button"
              onClick={() => {
                setBuilderMode('studio');
                setActiveTab('hamper');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                builderMode === 'studio'
                  ? 'bg-[#556B52] text-white shadow-xs'
                  : 'text-[#6B5A4B] hover:text-[#3D2C1F] hover:bg-white/60'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>2D Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setBuilderMode('value')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                builderMode === 'value'
                  ? 'bg-[#556B52] text-white shadow-xs'
                  : 'text-[#6B5A4B] hover:text-[#3D2C1F] hover:bg-white/60'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Value Mode</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setBuilderMode('wizard');
                setWizardStep(1);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                builderMode === 'wizard'
                  ? 'bg-[#556B52] text-white shadow-xs'
                  : 'text-[#6B5A4B] hover:text-[#3D2C1F] hover:bg-white/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Occasion Wizard</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: INTERACTIVE 2D STUDIO                                            */}
      {/* ========================================================================= */}
      {builderMode === 'studio' && (
        <div className="space-y-6">
          {/* Minimal 3 Tabs for Studio */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-[#FAF7F2] rounded-xl border border-[#E8DEC9] max-w-sm w-full">
              <button
                type="button"
                onClick={() => setActiveTab('hamper')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs transition-all ${
                  activeTab === 'hamper'
                    ? 'bg-white text-[#2D2A26] shadow-xs font-semibold'
                    : 'text-[#7A6A5A] hover:text-[#2D2A26]'
                }`}
              >
                1. Hamper
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs transition-all ${
                  activeTab === 'card'
                    ? 'bg-white text-[#2D2A26] shadow-xs font-semibold'
                    : 'text-[#7A6A5A] hover:text-[#2D2A26]'
                }`}
              >
                2. Gift Card
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('review')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs transition-all ${
                  activeTab === 'review'
                    ? 'bg-white text-[#2D2A26] shadow-xs font-semibold'
                    : 'text-[#7A6A5A] hover:text-[#2D2A26]'
                }`}
              >
                3. Review
              </button>
            </div>
          </div>

          {/* TAB 1: BUILD HAMPER (Split Layout with Live 2D Visualizer) */}
          {activeTab === 'hamper' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              {/* LEFT: 2D VISUALIZER & PRICE (Sticky) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                <Hamper2DVisualizer
                  selectedPackaging={selectedPackaging}
                  hamperSize={hamperSize}
                  selectedProducts={selectedItems}
                  onRemoveItem={handleRemoveItem}
                  onSelectSlot={() => {
                    const el = document.getElementById('products-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* Price Box */}
                <div className="bg-white p-5 rounded-2xl border border-[#EBE4D8] shadow-xs space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium text-[#7A6A5A]">Estimated Total</span>
                    <span className="font-serif text-2xl font-bold text-[#2D2A26]">
                      ₹{totalPrice}
                    </span>
                  </div>

                  <div className="text-xs text-[#7A6A5A] space-y-1.5 pt-2 border-t border-[#F2ECE1]">
                    <div className="flex justify-between">
                      <span>Products ({currentTotalItemCount}/{maxCapacity})</span>
                      <span className="text-[#2D2A26] font-medium">₹{productsSubtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{selectedPackaging?.name}</span>
                      <span className="text-[#2D2A26] font-medium">₹{packagingPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calligraphed Card & Wax Seal</span>
                      <span className="text-[#2D2A26] font-medium">₹{cardPrice}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('card')}
                    className="w-full mt-2 py-3 rounded-xl bg-[#2D231B] hover:bg-[#3D2F24] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>Continue to Gift Card</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* RIGHT: CONFIGURATION CONTROLS */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Hamper Size */}
                <div className="bg-white p-5 rounded-2xl border border-[#EBE4D8] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-bold text-[#2D2A26]">
                      1. Hamper Size
                    </h3>
                    <span className="text-xs text-[#7A6A5A]">
                      Capacity: {hamperSize.maxItems} items
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {HAMPER_SIZES.map((size) => {
                      const isSelected = hamperSize.id === size.id;
                      return (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setHamperSize(size)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'border-[#556B52] bg-[#FAF3EA] text-[#556B52] font-semibold ring-1 ring-[#556B52]'
                              : 'border-[#EBE4D8] bg-white text-[#4A3728] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          <div className="font-serif text-sm font-semibold">{size.name}</div>
                          <div className="text-[11px] text-[#7A6A5A]">{size.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Packaging Box */}
                <div className="bg-white p-5 rounded-2xl border border-[#EBE4D8] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-bold text-[#2D2A26]">
                      2. Keepsake Packaging
                    </h3>
                    <span className="text-xs text-[#556B52] font-medium">
                      {selectedPackaging?.name} (+₹{selectedPackaging?.price})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PACKAGING_OPTIONS.map((pkg) => {
                      const isSelected = selectedPackaging?.id === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackaging(pkg)}
                          className={`cursor-pointer rounded-xl border overflow-hidden transition-all ${
                            isSelected
                              ? 'border-[#556B52] ring-1 ring-[#556B52]'
                              : 'border-[#EBE4D8] hover:border-[#D5C7B4]'
                          }`}
                        >
                          <div className="aspect-square bg-[#FAF7F2] overflow-hidden">
                            <img
                              src={pkg.imageUrl}
                              alt={pkg.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-2.5 text-center bg-white">
                            <div className="text-xs font-semibold text-[#2D2A26] truncate">
                              {pkg.name}
                            </div>
                            <div className="text-[11px] text-[#7A6A5A]">₹{pkg.price}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Product Selection Grid */}
                <div id="products-section" className="bg-white p-5 rounded-2xl border border-[#EBE4D8] shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F2ECE1]">
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#2D2A26]">
                        3. Select Artisan Formulations
                      </h3>
                      <p className="text-xs text-[#7A6A5A]">
                        {currentTotalItemCount >= maxCapacity ? (
                          <span className="text-[#C86D51] font-semibold">Hamper is at full capacity ({maxCapacity}/{maxCapacity} items)</span>
                        ) : (
                          <span>{maxCapacity - currentTotalItemCount} slot(s) remaining in this hamper</span>
                        )}
                      </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {studioCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setProductCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                            productCategoryFilter === cat
                              ? 'bg-[#556B52] text-white'
                              : 'bg-[#FAF7F2] text-[#6B5A4B] hover:bg-[#F2ECE1]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredStudioProducts.map((product) => {
                      const selectedItem = selectedItems.find((i) => i.id === product.id);
                      const qty = selectedItem?.quantity || 0;
                      const allergyStatus = checkProductAllergyStatus(product, selectedAllergens);

                      return (
                        <div
                          key={product.id}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            qty > 0
                              ? 'border-[#556B52] bg-[#FAF9F5]'
                              : 'border-[#EBE4D8] bg-white hover:border-[#D5C7B4]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover bg-[#FAF7F2] shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-semibold text-[#2D2A26] truncate">
                                {product.name}
                              </h4>
                              <div className="text-[11px] text-[#7A6A5A]">
                                ₹{product.price}
                              </div>
                              {selectedAllergens.length > 0 && allergyStatus.isConflict && (
                                <span className="inline-block text-[10px] text-[#C86D51] font-semibold truncate max-w-[150px]">
                                  {allergyStatus.conflictReason}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Stepper Controls */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {qty > 0 ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleDecreaseItem(product.id)}
                                  className="w-7 h-7 rounded-lg border border-[#EBE4D8] bg-white hover:bg-[#FAF7F2] text-[#2D2A26] flex items-center justify-center transition-all"
                                  title="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-5 text-center text-xs font-bold text-[#2D2A26]">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleAddItem(product)}
                                  disabled={currentTotalItemCount >= maxCapacity}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                    currentTotalItemCount >= maxCapacity
                                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                      : 'bg-[#556B52] text-white hover:bg-[#3E523B]'
                                  }`}
                                  title="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddItem(product)}
                                disabled={currentTotalItemCount >= maxCapacity}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                  currentTotalItemCount >= maxCapacity
                                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                    : 'bg-[#FAF7F2] hover:bg-[#556B52] text-[#2D2A26] hover:text-white border border-[#EBE4D8]'
                                }`}
                              >
                                + Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CELEBRATION GIFT CARD */}
          {activeTab === 'card' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
                <CelebrationCard2DVisualizer
                  cardPhoto={cardPhoto}
                  celebrationTitle={celebrationTitle}
                  cardMessage={cardMessage}
                  cardRecipient={cardRecipient}
                  cardSender={cardSender}
                />
              </div>

              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs space-y-5">
                <div className="pb-3 border-b border-[#F2ECE1]">
                  <h3 className="font-serif text-lg font-bold text-[#2D2A26]">
                    Personalise Your Celebration Card
                  </h3>
                  <p className="text-xs text-[#7A6A5A]">
                    Every hamper includes a 300 GSM deckled cotton paper card, embossed gold foil, and hand-poured botanical wax seal.
                  </p>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-1.5">
                    Optional Celebration Photo
                  </label>
                  {cardPhoto ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-[#EBE4D8] bg-[#FAF7F2]">
                      <img
                        src={cardPhoto}
                        alt="Uploaded preview"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-[#2D2A26] block truncate">
                          Celebration Photo Attached
                        </span>
                        <span className="text-[11px] text-[#7A6A5A]">Printed on fine matte photo card</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCardPhoto(null)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border border-dashed border-[#D5C7B4] hover:border-[#556B52] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-[#FAF7F2] hover:bg-white transition-all">
                      <Upload className="w-5 h-5 text-[#8C7A6A] mb-1" />
                      <span className="text-xs font-semibold text-[#2D2A26]">
                        Upload Special Moment Photo
                      </span>
                      <span className="text-[11px] text-[#7A6A5A] mt-0.5">
                        PNG or JPG (Will be printed and enclosed in envelope)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-1">
                    Occasion / Card Heading
                  </label>
                  <input
                    type="text"
                    value={celebrationTitle}
                    onChange={(e) => setCelebrationTitle(e.target.value)}
                    placeholder="e.g. Warmest Wishes, Happy Birthday, Wedding Blessings"
                    className="w-full p-2.5 rounded-xl border border-[#EBE4D8] bg-[#FAF7F2] text-xs text-[#2D2A26] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#556B52]"
                  />
                </div>

                {/* To & From */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-1">
                      Recipient Name (To)
                    </label>
                    <input
                      type="text"
                      value={cardRecipient}
                      onChange={(e) => setCardRecipient(e.target.value)}
                      placeholder="e.g. Ananya"
                      className="w-full p-2.5 rounded-xl border border-[#EBE4D8] bg-[#FAF7F2] text-xs text-[#2D2A26] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#556B52]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-1">
                      Sender Name (From)
                    </label>
                    <input
                      type="text"
                      value={cardSender}
                      onChange={(e) => setCardSender(e.target.value)}
                      placeholder="e.g. Rohan & Family"
                      className="w-full p-2.5 rounded-xl border border-[#EBE4D8] bg-[#FAF7F2] text-xs text-[#2D2A26] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#556B52]"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-1">
                    Heartfelt Calligraphed Message
                  </label>
                  <textarea
                    rows="3"
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    placeholder="Write your personal message..."
                    className="w-full p-3 rounded-xl border border-[#EBE4D8] bg-[#FAF7F2] text-xs text-[#2D2A26] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#556B52]"
                  />
                </div>

                {/* Nav */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('hamper')}
                    className="px-4 py-2.5 rounded-xl border border-[#EBE4D8] text-[#4A3728] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#FAF7F2] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Products</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('review')}
                    className="px-5 py-2.5 rounded-xl bg-[#2D231B] hover:bg-[#3D2F24] text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <span>Review Hamper</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEW & FINALIZE */}
          {activeTab === 'review' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              <div className="lg:col-span-7 space-y-5">
                <Hamper2DVisualizer
                  selectedPackaging={selectedPackaging}
                  hamperSize={hamperSize}
                  selectedProducts={selectedItems}
                  onRemoveItem={handleRemoveItem}
                />

                <CelebrationCard2DVisualizer
                  cardPhoto={cardPhoto}
                  celebrationTitle={celebrationTitle}
                  cardMessage={cardMessage}
                  cardRecipient={cardRecipient}
                  cardSender={cardSender}
                />
              </div>

              <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
                <div className="bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#2D2A26]">
                    Keepsake Hamper Summary
                  </h3>

                  <div className="space-y-2 text-xs text-[#6B5A4B] border-y border-[#F2ECE1] py-3">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="truncate pr-2">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium text-[#2D2A26] shrink-0">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-[#F2ECE1] space-y-1">
                      <div className="flex justify-between">
                        <span>{selectedPackaging?.name} ({hamperSize.name} Box)</span>
                        <span className="font-medium text-[#2D2A26]">₹{packagingPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Calligraphed Card & Wax Seal</span>
                        <span className="font-medium text-[#2D2A26]">₹{cardPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs text-[#7A6A5A]">Total Cost</span>
                    <span className="font-serif text-3xl font-bold text-[#2D2A26]">
                      ₹{totalPrice}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={handleSaveStudioHamperToCart}
                      className="w-full py-3.5 rounded-xl bg-[#556B52] hover:bg-[#3E523B] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Save Hamper to Selections</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('hamper')}
                      className="w-full py-2.5 rounded-xl border border-[#EBE4D8] text-[#4A3728] text-xs font-semibold hover:bg-[#FAF7F2] transition-colors"
                    >
                      Make Adjustments
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: VALUE HAMPER MODE                                                */}
      {/* ========================================================================= */}
      {builderMode === 'value' && (
        <div className="space-y-8 animate-fade-in">
          {/* Controls Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE4D8] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F2ECE1] gap-2">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3D2C1F] flex items-center gap-2">
                  <span>Smart Hamper Configuration</span>
                  <span className="text-xs font-sans font-semibold bg-[#FAF3EA] text-[#556B52] px-3 py-1 rounded-full border border-[#E8DEC9]">
                    Strict Budget & Allergy Guard
                  </span>
                </h2>
                <p className="text-xs text-[#7A6A5A] mt-1">
                  Adjust budget ceiling, restrict allergens, or select packaging. Real combinations update instantaneously.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#556B52] font-medium">
                <span className="flex items-center gap-1 bg-[#FAF3EA] px-2.5 py-1 rounded-full border border-[#E8DEC9]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#556B52]" />
                  In-Stock Only
                </span>
                <span className="flex items-center gap-1 bg-[#FAF3EA] px-2.5 py-1 rounded-full border border-[#E8DEC9]">
                  <Package className="w-3.5 h-3.5 text-[#556B52]" />
                  Packaging Included
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Budget */}
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

                {/* Presets */}
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
                            ? 'bg-[#556B52] text-white border-[#556B52] shadow-xs'
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
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-sm text-[#3D2C1F] focus:outline-none focus:ring-1 focus:ring-[#556B52]"
                    />
                  </div>
                </div>

                {/* Packaging & Card */}
                <div className="pt-3 border-t border-[#F2ECE1] space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#4A3728] uppercase tracking-wider block mb-1">
                      Packaging Preference
                    </label>
                    <select
                      value={valuePackagingId}
                      onChange={(e) => setValuePackagingId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs text-[#3D2C1F] focus:outline-none focus:ring-1 focus:ring-[#556B52]"
                    >
                      <option value="">Auto-Match by Tier (Recommended)</option>
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

              {/* Right Column: Allergens */}
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
                        <span className="truncate">{allergen.label}</span>
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
                      className="flex-1 px-3.5 py-2 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs text-[#3D2C1F] focus:outline-none focus:ring-1 focus:ring-[#556B52]"
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

                {/* Safety Notice */}
                <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#EADFCB] text-[11px] text-[#6B5A4B] leading-relaxed flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#4A3728] block mb-0.5">
                      Strict Allergen Safety & Verification
                    </strong>
                    Known allergy conflicts are strictly excluded from generated options. Formulations with unverified ingredients are safely omitted when allergy filters are active.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Value Hamper Results: 3 Tiers */}
          {valueHamperResult.success ? (
            <div className="space-y-6">
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

              {/* 3 Tier Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {valueHamperResult.options.map((hamper) => {
                  const isBalanced = hamper.tierId === 'balanced';
                  const isPremium = hamper.tierId === 'premium';
                  const isJustAdded = addedHamperTierId === hamper.tierId;

                  return (
                    <div
                      key={hamper.tierId}
                      className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-xs hover:shadow-md ${
                        isBalanced
                          ? 'border-[#556B52] ring-1 ring-[#556B52]'
                          : isPremium
                          ? 'border-[#D4AF37]'
                          : 'border-[#EBE4D8]'
                      }`}
                    >
                      {isBalanced && (
                        <div className="bg-[#556B52] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 text-center">
                          Recommended Best Value & Balance
                        </div>
                      )}
                      {isPremium && (
                        <div className="bg-[#2D231B] text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider py-1 px-4 text-center">
                          Maximum Luxury & Indulgence
                        </div>
                      )}

                      <div className="p-6 space-y-5">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#556B52] block mb-1">
                            {hamper.badge}
                          </span>
                          <h3 className="font-serif text-2xl font-bold text-[#3D2C1F]">
                            {hamper.tierName}
                          </h3>
                          <span className="text-xs text-[#8C7A6A] font-medium">
                            {hamper.subtitle}
                          </span>
                          <p className="text-xs text-[#7A6A5A] mt-2 leading-relaxed">
                            {hamper.description}
                          </p>
                        </div>

                        {/* Included Products List */}
                        <div className="space-y-2 pt-2 border-t border-[#F2ECE1]">
                          <span className="text-[10px] font-bold text-[#8C7A6A] uppercase tracking-wider block">
                            Included Items ({hamper.products.length}):
                          </span>
                          <div className="space-y-2">
                            {hamper.products.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#FAF7F2] border border-[#E8DEC9]"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold text-[#3D2C1F] truncate">
                                      {item.name}
                                    </div>
                                    <div className="text-[10px] text-[#7A6A5A]">
                                      {item.category}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-[#4A3728] shrink-0">
                                  ₹{item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Packaging Breakdown */}
                        <div className="pt-2 border-t border-[#F2ECE1] space-y-1 text-xs">
                          <div className="flex justify-between items-center text-[#6B5A4B]">
                            <span className="flex items-center gap-1">
                              <Package className="w-3.5 h-3.5 text-[#556B52]" />
                              <span>{hamper.packaging.name}</span>
                            </span>
                            <span className="font-semibold text-[#3D2C1F]">₹{hamper.packaging.price}</span>
                          </div>

                          {hamper.card && (
                            <div className="flex justify-between items-center text-[#6B5A4B]">
                              <span>Calligraphed Card & Wax Seal</span>
                              <span className="font-semibold text-[#3D2C1F]">₹{hamper.card.price}</span>
                            </div>
                          )}
                        </div>

                        {/* Total Price Bar */}
                        <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#E7DCB8] flex items-baseline justify-between">
                          <div>
                            <span className="text-[11px] text-[#8C7A6A] block">Total Price</span>
                            <span className="font-serif text-2xl font-bold text-[#3D2C1F]">
                              ₹{hamper.totalPrice}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] text-[#556B52] font-semibold block">
                              ₹{hamper.budgetRemaining} under budget
                            </span>
                            <span className="text-[10px] text-[#8C7A6A]">Guaranteed Ceiling</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="p-6 pt-0 space-y-2">
                        <button
                          type="button"
                          onClick={() => handleSelectValueHamper(hamper)}
                          className={`w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                            isJustAdded
                              ? 'bg-[#556B52] text-white'
                              : isBalanced
                              ? 'bg-[#556B52] hover:bg-[#3E523B] text-white shadow-xs'
                              : 'bg-[#2D231B] hover:bg-[#3D2F24] text-white shadow-xs'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Added to Selections!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>Add to Selections</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            loadIntoStudio(
                              hamper.products,
                              hamper.packaging,
                              `${hamper.tierName} (${hamper.subtitle})`
                            )
                          }
                          className="w-full py-2.5 rounded-xl border border-[#D5C7B4] hover:bg-[#FAF7F2] text-[#4A3728] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Palette className="w-3.5 h-3.5 text-[#556B52]" />
                          <span>Customize in 2D Studio</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-3xl bg-white border border-[#EBE4D8] text-center max-w-xl mx-auto space-y-4">
              <ShieldAlert className="w-10 h-10 text-[#C86D51] mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#3D2C1F]">
                Unable to Assemble Hamper
              </h3>
              <p className="text-xs text-[#7A6A5A] leading-relaxed">
                {valueHamperResult.message}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                {selectedAllergens.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedAllergens([])}
                    className="px-4 py-2 rounded-xl border border-[#556B52] text-[#556B52] text-xs font-semibold hover:bg-[#FAF3EA]"
                  >
                    Clear Allergen Filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleBudgetPresetClick(2500)}
                  className="px-5 py-2 rounded-xl bg-[#556B52] text-white text-xs font-semibold hover:bg-[#3E523B]"
                >
                  Try ₹2,500 Budget
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: OCCASION WIZARD                                                  */}
      {/* ========================================================================= */}
      {builderMode === 'wizard' && (
        <div className="space-y-8 animate-fade-in">
          {/* Progress Indicator */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7A6A5A]">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center gap-1.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                      wizardStep === stepNum
                        ? 'bg-[#556B52] text-white'
                        : wizardStep > stepNum
                        ? 'bg-[#EAEFEA] text-[#556B52]'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    {stepNum}
                  </span>
                  {stepNum < 4 && <span className="w-6 h-0.5 bg-neutral-200"></span>}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Occasion */}
          {wizardStep === 1 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE4D8] shadow-xs space-y-6 max-w-3xl mx-auto">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#3D2C1F]">
                  What occasion are we celebrating?
                </h3>
                <p className="text-xs text-[#7A6A5A] mt-1">
                  Choose a milestone to help our engine tailor fragrances, textures, and packaging aesthetics.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {OCCASIONS.map((occ) => {
                  const isSelected = wizardOccasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setWizardOccasion(occ.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#556B52] bg-[#FAF3EA] text-[#556B52] font-semibold ring-1 ring-[#556B52]'
                          : 'border-[#EBE4D8] bg-white text-[#4A3728] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="font-serif text-sm font-semibold">{occ.label}</div>
                      <div className="text-[10px] text-[#7A6A5A] line-clamp-2 mt-1">
                        {occ.desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-[#F2ECE1]">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#556B52] hover:bg-[#3E523B] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Next: Recipient</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Recipient */}
          {wizardStep === 2 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE4D8] shadow-xs space-y-6 max-w-3xl mx-auto">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#3D2C1F]">
                  Who is this gift for?
                </h3>
                <p className="text-xs text-[#7A6A5A] mt-1">
                  Specify your relationship and select categories of interest.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#4A3728] uppercase tracking-wider block mb-2">
                    Relationship
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {['Best Friend', 'Partner / Spouse', 'Mother / Father', 'Colleague', 'Corporate Client', 'Self Care'].map((rel) => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => setRecipientRelationship(rel)}
                        className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                          recipientRelationship === rel
                            ? 'border-[#556B52] bg-[#FAF3EA] text-[#556B52] ring-1 ring-[#556B52]'
                            : 'border-[#EBE4D8] bg-white text-[#4A3728] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F2ECE1]">
                  <label className="text-xs font-bold text-[#4A3728] uppercase tracking-wider block mb-2">
                    Preferred Formulation Types
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Handmade Skincare', 'Bath and Body', 'Accessories'].map((cat) => {
                      const isSelected = wizardCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setWizardCategories((prev) =>
                              prev.includes(cat)
                                ? prev.filter((c) => c !== cat)
                                : [...prev, cat]
                            );
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'bg-[#556B52] text-white border-[#556B52]'
                              : 'bg-white text-[#4A3728] border-[#EBE4D8] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F2ECE1]">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-[#EBE4D8] text-[#4A3728] text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#556B52] hover:bg-[#3E523B] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Next: Gifting Style</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Style */}
          {wizardStep === 3 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE4D8] shadow-xs space-y-6 max-w-3xl mx-auto">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#3D2C1F]">
                  Select a Gifting Aesthetic
                </h3>
                <p className="text-xs text-[#7A6A5A] mt-1">
                  How should this collection feel when unwrapped?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GIFTING_STYLES.map((st) => {
                  const isSelected = wizardStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setWizardStyle(st.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#556B52] bg-[#FAF3EA] text-[#556B52] ring-1 ring-[#556B52]'
                          : 'border-[#EBE4D8] bg-white text-[#4A3728] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="font-serif text-base font-semibold">{st.name}</div>
                      <div className="text-xs text-[#7A6A5A] mt-1">{st.desc}</div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F2ECE1]">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-[#EBE4D8] text-[#4A3728] text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-[#556B52] hover:bg-[#3E523B] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Next: Budget</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Budget Range */}
          {wizardStep === 4 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE4D8] shadow-xs space-y-6 max-w-3xl mx-auto">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#3D2C1F]">
                  What is your target budget?
                </h3>
                <p className="text-xs text-[#7A6A5A] mt-1">
                  Our recommendation algorithm will keep combinations transparently within your price cap.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUDGET_RANGES.map((b) => {
                  const isSelected = wizardBudgetRange === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setWizardBudgetRange(b.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#556B52] bg-[#FAF3EA] text-[#556B52] ring-1 ring-[#556B52]'
                          : 'border-[#EBE4D8] bg-white text-[#4A3728] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="font-serif text-base font-semibold">{b.label}</div>
                      <div className="text-xs text-[#7A6A5A] mt-0.5">{b.desc}</div>
                    </button>
                  );
                })}
              </div>

              {wizardBudgetRange === 'custom' && (
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC9]">
                  <div>
                    <label className="text-[11px] font-semibold text-[#4A3728] block mb-1">
                      Min (₹)
                    </label>
                    <input
                      type="number"
                      value={wizardCustomMin}
                      onChange={(e) => setWizardCustomMin(e.target.value)}
                      className="w-full p-2 rounded-xl border border-[#D5C7B4] bg-white text-xs text-[#2D2A26]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#4A3728] block mb-1">
                      Max (₹)
                    </label>
                    <input
                      type="number"
                      value={wizardCustomMax}
                      onChange={(e) => setWizardCustomMax(e.target.value)}
                      className="w-full p-2 rounded-xl border border-[#D5C7B4] bg-white text-xs text-[#2D2A26]"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#F2ECE1]">
                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="px-4 py-2.5 rounded-xl border border-[#EBE4D8] text-[#4A3728] text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateWizard}
                  className="px-7 py-3 rounded-xl bg-[#556B52] hover:bg-[#3E523B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Generate Recommended Hampers</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Recommendations Results */}
          {wizardStep === 5 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-2xl border border-[#EBE4D8] gap-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#3D2C1F]">
                    Curated Hampers for {wizardOccasion} ({recipientRelationship})
                  </h3>
                  <p className="text-xs text-[#7A6A5A]">
                    Aesthetic: <strong>{wizardStyle}</strong> • In-Stock Verified
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2 rounded-xl border border-[#EBE4D8] text-[#4A3728] text-xs font-semibold hover:bg-[#FAF7F2]"
                >
                  Reconfigure Wizard
                </button>
              </div>

              {wizardRecommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wizardRecommendations.map((hamper) => (
                    <div
                      key={hamper.id}
                      className="bg-white rounded-3xl border border-[#EBE4D8] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#556B52] bg-[#FAF3EA] px-2.5 py-0.5 rounded-full border border-[#E8DEC9]">
                          {hamper.matchScore}% Match Score
                        </span>
                        <h4 className="font-serif text-xl font-bold text-[#2D2A26]">
                          {hamper.name}
                        </h4>
                        <p className="text-xs text-[#7A6A5A] leading-relaxed">
                          {hamper.matchReason}
                        </p>

                        {/* Items */}
                        <div className="space-y-1.5 pt-2 border-t border-[#F2ECE1]">
                          <span className="text-[10px] font-bold text-[#8C7A6A] uppercase tracking-wider block">
                            Included Items:
                          </span>
                          {hamper.products.map((p) => (
                            <div key={p.id} className="text-xs flex justify-between text-[#4A3728]">
                              <span className="truncate pr-2">• {p.name}</span>
                              <span className="font-medium shrink-0">₹{p.price}</span>
                            </div>
                          ))}
                          <div className="text-xs flex justify-between text-[#7A6A5A] pt-1 border-t border-[#F2ECE1]">
                            <span>{hamper.packaging.name}</span>
                            <span>₹{hamper.packaging.price}</span>
                          </div>
                          <div className="text-xs flex justify-between text-[#7A6A5A]">
                            <span>Calligraphed Wish Card</span>
                            <span>₹199</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#F2ECE1] space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-[#7A6A5A]">Total Cost</span>
                          <span className="font-serif text-2xl font-bold text-[#2D2A26]">
                            ₹{hamper.totalPrice}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectWizardHamper(hamper)}
                          className="w-full py-3 rounded-xl bg-[#556B52] hover:bg-[#3E523B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Selections</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => loadIntoStudio(hamper.products, hamper.packaging, hamper.name)}
                          className="w-full py-2.5 rounded-xl border border-[#D5C7B4] hover:bg-[#FAF7F2] text-[#4A3728] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Palette className="w-3.5 h-3.5 text-[#556B52]" />
                          <span>Customize in 2D Studio</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 rounded-3xl bg-white border border-[#EBE4D8] text-center max-w-xl mx-auto space-y-3">
                  <h4 className="font-serif text-lg font-bold text-[#3D2C1F]">
                    No exact match in this price tier
                  </h4>
                  <p className="text-xs text-[#7A6A5A]">
                    Try broadening your budget range or selecting different formulation categories.
                  </p>
                  <button
                    type="button"
                    onClick={() => setWizardStep(4)}
                    className="px-5 py-2.5 rounded-xl bg-[#556B52] text-white text-xs font-semibold"
                  >
                    Adjust Budget
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
    </AnimatedPage>
  );
}
