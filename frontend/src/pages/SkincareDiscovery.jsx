import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { wizardStepVariants, wizardStepVariantsReduced, wizardStepTransition, staggerContainer, staggerItem, staggerItemReduced } from '../utils/animations';
import { useSelections } from '../context/SelectionContext';
import ProductDetailModal from '../components/ProductDetailModal';
import {
  SKINCARE_TEXTURE_OPTIONS,
  SKINCARE_FRAGRANCE_OPTIONS,
  INGREDIENT_PREFERENCES,
  FORMAT_OPTIONS,
  discoverSkincareProducts
} from '../services/skincareService';
import {
  Compass,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Check,
  ShoppingBag,
  Eye,
  Sliders,
  RotateCcw,
  Star,
  Info,
  ArrowRight
} from 'lucide-react';

export default function SkincareDiscovery() {
  const { products, addStandaloneItem } = useSelections();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Questionnaire responses
  const [category, setCategory] = useState('Any Category');
  const [texture, setTexture] = useState('Any Texture');
  const [fragrance, setFragrance] = useState('Any Fragrance');
  const [ingredientPreferences, setIngredientPreferences] = useState(['pure-botanicals', 'paraben-free']);
  const [avoidInput, setAvoidInput] = useState('');
  const [avoidList, setAvoidList] = useState([]);
  const [productFormat, setProductFormat] = useState('Any Format');
  const [maxPrice, setMaxPrice] = useState(1500);

  // Results & Modal
  const [results, setResults] = useState([]);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  // Add avoid item
  const handleAddAvoidTag = () => {
    if (avoidInput.trim() && !avoidList.includes(avoidInput.trim())) {
      setAvoidList([...avoidList, avoidInput.trim()]);
      setAvoidInput('');
    }
  };

  const handleRemoveAvoidTag = (tag) => {
    setAvoidList(avoidList.filter((t) => t !== tag));
  };

  const handleRunDiscovery = () => {
    const matched = discoverSkincareProducts({
      category,
      texture,
      fragrance,
      ingredientPreferences,
      avoidIngredients: avoidList,
      productFormat,
      maxPrice: Number(maxPrice),
      products
    });
    setResults(matched);
    setHasSubmitted(true);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shouldReduceMotion = useReducedMotion();
  const stepAnim = shouldReduceMotion ? wizardStepVariantsReduced : wizardStepVariants;
  const itemAnim = shouldReduceMotion ? staggerItemReduced : staggerItem;

  return (
    <AnimatedPage>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header with Welcome Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE2D5] text-xs font-semibold text-[#556B52]">
          <Compass className="w-3.5 h-3.5 text-[#C86D51]" />
          <span>Non-Medical Guided Discovery</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3D2C1F]">
          Let's help you explore skincare products that match your preferences.
        </h1>
        <p className="text-sm text-[#7A6A5A]">
          Share your desired sensory textures, natural aromas, and ingredient preferences. We match verified formulations directly from our artisan laboratory.
        </p>
      </div>

      {/* Prominent Non-Medical Safety Disclaimer Banner */}
      <div className="max-w-4xl mx-auto bg-[#FDF9F2] p-4 sm:p-5 rounded-2xl border border-[#EADBBD] flex items-start gap-3.5 text-xs text-[#7A6548] leading-relaxed shadow-sm">
        <ShieldAlert className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#4A3728] block mb-0.5">
            Transparent Formulation Standard & Medical Disclaimer:
          </span>
          Surreal Treasures recommendations are designed purely for product discovery and sensory exploration based on personal preferences and cosmetic qualities. This tool does not diagnose, treat, cure, or prevent dermatological or medical skin conditions. We never invent clinical claims or unverified certifications.
        </div>
      </div>

      {/* Progress Pills */}
      {!hasSubmitted && (
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-3">
          {[
            { step: 1, label: 'Form & Texture' },
            { step: 2, label: 'Aroma & Ingredients' },
            { step: 3, label: 'Format & Budget' }
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                currentStep === s.step
                  ? 'bg-[#556B52] text-white shadow-sm'
                  : currentStep > s.step
                  ? 'bg-[#EAE2D5] text-[#4A3728]'
                  : 'bg-white text-[#9E9080] border border-[#DDD0BF]'
              }`}
            >
              Step {s.step}: {s.label}
            </button>
          ))}
        </div>
      )}

      {/* STEP 1: CATEGORY & TEXTURE */}
      <AnimatePresence mode="wait">
      {currentStep === 1 && (
        <motion.div
          key="skincare-step-1"
          variants={stepAnim}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={wizardStepTransition}
          className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DEC9] shadow-md space-y-8"
        >
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#3D2C1F]">
              Step 1: Category & Preferred Texture
            </h2>
            <p className="text-xs text-[#7A6A5A] mt-1">
              Select what type of formulation you are looking to explore today.
            </p>
          </div>

          <div className="space-y-6">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-2">
                Product Category of Interest
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  'Any Category',
                  'Face Oils & Serums',
                  'Moisturisers',
                  'Toners & Mists',
                  'Face Masks',
                  'Lip Care',
                  'Body Butters',
                  'Artisan Soaps',
                  'Body Scrubs'
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      category === cat
                        ? 'bg-[#FAF3EA] border-[#556B52] text-[#3D2C1F] font-semibold ring-1 ring-[#556B52]'
                        : 'bg-[#FAF7F2] border-[#E8DEC9] text-[#7A6A5A] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Texture */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-2">
                Preferred Sensory Texture
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SKINCARE_TEXTURE_OPTIONS.map((tex) => (
                  <button
                    key={tex}
                    type="button"
                    onClick={() => setTexture(tex)}
                    className={`p-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      texture === tex
                        ? 'bg-[#FAF3EA] border-[#556B52] text-[#3D2C1F] font-semibold ring-1 ring-[#556B52]'
                        : 'bg-[#FAF7F2] border-[#E8DEC9] text-[#7A6A5A] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    {tex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0E6D8] flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-8 py-3.5 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all"
            >
              <span>Next: Scent & Ingredients</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: FRAGRANCE & INGREDIENT PREFERENCES */}
      {currentStep === 2 && (
        <motion.div
          key="skincare-step-2"
          variants={stepAnim}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={wizardStepTransition}
          className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DEC9] shadow-md space-y-8"
        >
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#3D2C1F]">
              Step 2: Fragrance & Botanical Ingredients
            </h2>
            <p className="text-xs text-[#7A6A5A] mt-1">
              Select aromatic blends and specify any ingredients you wish to prioritize or avoid.
            </p>
          </div>

          <div className="space-y-6">
            {/* Fragrance options */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-2">
                Aromatic Fragrance Preference
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SKINCARE_FRAGRANCE_OPTIONS.map((frag) => (
                  <button
                    key={frag}
                    type="button"
                    onClick={() => setFragrance(frag)}
                    className={`p-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      fragrance === frag
                        ? 'bg-[#FAF3EA] border-[#556B52] text-[#3D2C1F] font-semibold ring-1 ring-[#556B52]'
                        : 'bg-[#FAF7F2] border-[#E8DEC9] text-[#7A6A5A] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    {frag}
                  </button>
                ))}
              </div>
            </div>

            {/* Desired Formulation Highlights */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-2">
                Formulation Preferences (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {INGREDIENT_PREFERENCES.map((pref) => {
                  const isChecked = ingredientPreferences.includes(pref.id);
                  return (
                    <button
                      key={pref.id}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setIngredientPreferences(ingredientPreferences.filter((p) => p !== pref.id));
                        } else {
                          setIngredientPreferences([...ingredientPreferences, pref.id]);
                        }
                      }}
                      className={`p-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-[#FAF3EA] border-[#556B52] text-[#3D2C1F] font-semibold'
                          : 'bg-[#FAF7F2] border-[#E8DEC9] text-[#7A6A5A]'
                      }`}
                    >
                      <span>{pref.label}</span>
                      {isChecked && <Check className="w-4 h-4 text-[#556B52]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ingredients to Avoid Tag Input */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-1">
                Ingredients or Sensitivities to Avoid (Optional)
              </label>
              <p className="text-[11px] text-[#8C7A6A] mb-2">
                Type an ingredient (e.g. Nut, Almond, Honey, Goat Milk) and press Add:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Almond, Honey, Essential Oil"
                  value={avoidInput}
                  onChange={(e) => setAvoidInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAvoidTag();
                    }
                  }}
                  className="flex-1 p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddAvoidTag}
                  className="px-4 py-2.5 rounded-xl bg-[#4A3728] text-white text-xs font-medium hover:bg-[#342417]"
                >
                  Add Filter
                </button>
              </div>

              {/* Active avoided tags */}
              {avoidList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {avoidList.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FDF0EC] text-[#9E3E28] border border-[#F3D5CE]"
                    >
                      <span>Avoid: {tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAvoidTag(tag)}
                        className="hover:font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0E6D8] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 rounded-full border border-[#D5C7B4] text-[#4A3728] text-xs font-medium hover:bg-[#FAF7F2]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-8 py-3.5 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all"
            >
              <span>Next: Format & Budget</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: FORMAT & BUDGET */}
      {currentStep === 3 && (
        <motion.div
          key="skincare-step-3"
          variants={stepAnim}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={wizardStepTransition}
          className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DEC9] shadow-md space-y-8"
        >
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#3D2C1F]">
              Step 3: Container Format & Budget
            </h2>
            <p className="text-xs text-[#7A6A5A] mt-1">
              Select your preferred dispenser packaging and maximum per-item budget target.
            </p>
          </div>

          <div className="space-y-6">
            {/* Format */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-2">
                Preferred Product Format / Container
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {FORMAT_OPTIONS.map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setProductFormat(fmt)}
                    className={`p-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      productFormat === fmt
                        ? 'bg-[#FAF3EA] border-[#556B52] text-[#3D2C1F] font-semibold ring-1 ring-[#556B52]'
                        : 'bg-[#FAF7F2] border-[#E8DEC9] text-[#7A6A5A] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Price slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#4A3728] uppercase tracking-wider">
                  Maximum Budget Target
                </label>
                <span className="font-serif text-lg font-bold text-[#556B52]">
                  Up to ₹{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-[#556B52]"
              />
              <div className="flex justify-between text-[10px] text-[#8C7A6A] mt-1">
                <span>₹300</span>
                <span>₹1,500</span>
                <span>₹2,500+</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0E6D8] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-full border border-[#D5C7B4] text-[#4A3728] text-xs font-medium hover:bg-[#FAF7F2]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleRunDiscovery}
              className="px-8 py-3.5 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-[#556B52]/25 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#E8C5B8]" />
              <span>Discover Matched Products</span>
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* STEP 4: RESULTS CARDS */}
      {hasSubmitted && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Active criteria bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-[#FAF6EE] p-5 rounded-2xl border border-[#E7DCB8] gap-4">
            <div className="text-xs text-[#4A3728]">
              <span className="font-semibold text-[#556B52] block sm:inline mr-2">
                Discovery Criteria:
              </span>
              Category: <strong>{category}</strong> • Texture: <strong>{texture}</strong> • Scent: <strong>{fragrance}</strong> • Up to ₹{maxPrice}
            </div>
            <button
              type="button"
              onClick={() => {
                setHasSubmitted(false);
                setCurrentStep(1);
              }}
              className="text-xs font-semibold text-[#4A3728] hover:text-[#556B52] flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refine Preferences</span>
            </button>
          </div>

          {/* Results Grid */}
          {results.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {results.map(({ product, score, matchReasons }, idx) => (
                <motion.div
                  key={product.id}
                  variants={itemAnim}
                  className="bg-white rounded-3xl border border-[#E5DAC9] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Image & Match Tag */}
                    <div className="relative aspect-[4/3] bg-[#F4EDE2] overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-[#556B52] text-white shadow-md">
                        {score}% Preference Match
                      </div>
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl text-xs font-semibold bg-white/90 backdrop-blur-md text-[#4A3728] shadow-sm">
                        {product.texture}
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Name & Pricing */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-[#8C7A6A] font-semibold uppercase tracking-wider block">
                            {product.category}
                          </span>
                          <h3 className="font-serif text-xl font-bold text-[#342417] leading-snug">
                            {product.name}
                          </h3>
                        </div>
                        <span className="font-serif text-2xl font-bold text-[#4A3728] shrink-0">
                          ₹{product.price}
                        </span>
                      </div>

                      <p className="text-xs text-[#6B5A4B] leading-relaxed line-clamp-2">
                        {product.description}
                      </p>

                      {/* Why this matches explanation */}
                      <div className="p-3 rounded-2xl bg-[#FAF5ED] border border-[#EFE5D5] space-y-1 text-xs">
                        <span className="font-semibold text-[#556B52] block text-[11px]">
                          Why this matches your preferences:
                        </span>
                        <ul className="space-y-1 text-[#6B5A4B]">
                          {matchReasons.slice(0, 3).map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                              <Check className="w-3.5 h-3.5 text-[#556B52] shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Verified Ingredients Chips */}
                      {product.ingredients && product.ingredients.length > 0 ? (
                        <div>
                          <span className="text-[10px] font-semibold text-[#8C7A6A] uppercase tracking-wider block mb-1">
                            Verified Ingredients:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {product.ingredients.slice(0, 3).map((ing, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF0E4] border border-[#E5DAC8] text-[#5C4A3A]"
                              >
                                {ing}
                              </span>
                            ))}
                            {product.ingredients.length > 3 && (
                              <span className="text-[10px] px-2 py-0.5 text-[#8C7A6A]">
                                +{product.ingredients.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-[#8C7A6A] italic">
                          Information not provided
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 bg-[#FAF7F2] border-t border-[#EAE0D1] flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProductForModal(product)}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-[#D5C7B4] hover:bg-white text-[#4A3728] text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addStandaloneItem(product, 1)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#556B52] hover:bg-[#3E523B] text-white text-xs font-semibold text-center shadow-sm transition-all hover:scale-105 flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Selections</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#E5DAC9] max-w-2xl mx-auto space-y-4">
              <Compass className="w-12 h-12 text-[#C86D51] mx-auto" />
              <h3 className="font-serif text-2xl font-semibold text-[#3D2C1F]">
                No Formulations Matched All Criteria
              </h3>
              <p className="text-sm text-[#7A6A5A] max-w-md mx-auto">
                No items in our verified catalogue matched this exact combination of texture, scent, budget, and avoidance filters. Try broadening your preferences.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategory('Any Category');
                  setTexture('Any Texture');
                  setFragrance('Any Fragrance');
                  setAvoidList([]);
                  setMaxPrice(2000);
                  handleRunDiscovery();
                }}
                className="px-6 py-3 rounded-full bg-[#556B52] text-white text-xs font-semibold"
              >
                Broaden Discovery Preferences
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProductForModal && (
          <ProductDetailModal
            product={selectedProductForModal}
            onClose={() => setSelectedProductForModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
    </AnimatedPage>
  );
}
