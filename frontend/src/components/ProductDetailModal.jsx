import React, { useState } from 'react';
import { useSelections } from '../context/SelectionContext';
import { X, Star, ShoppingBag, ShieldCheck, Check, AlertCircle, ChevronDown, Calendar } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function ProductDetailModal({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [showIngredients, setShowIngredients] = useState(true);
  const [showRitualGuide, setShowRitualGuide] = useState(true);
  const { addStandaloneItem } = useSelections();
  const shouldReduceMotion = useReducedMotion();

  if (!product) return null;

  const handleAddToCart = () => {
    addStandaloneItem(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.95, y: 12 }
        }
        animate={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.95, y: 12 }
        }
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E4D9C8] overflow-hidden my-8 z-10"
      >
        {/* Close Button */}
        <motion.button
          type="button"
          onClick={onClose}
          whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.92 }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#FAF7F2]/90 hover:bg-white text-[#4A3728] shadow-md border border-[#E5DAC9] transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Badges */}
          <div className="relative bg-[#F4EDE2] h-72 md:h-full min-h-[340px]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#4A3728] text-white shadow-md">
                {product.badge}
              </span>
            )}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/60 flex items-center justify-between text-xs text-[#4A3728]">
              <span className="font-semibold">{product.category}</span>
              <span className="text-[#6B5A4B]">{product.volume || 'Artisan Unit'}</span>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-[#D4AF37]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold ml-1 text-[#4A3728]">{product.rating}</span>
                </div>
                <span className="text-xs text-[#8A7969]">({product.reviewCount} reviews)</span>
                {product.available ? (
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-[#556B52] bg-[#E9EFE9] px-2.5 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="ml-auto text-[11px] font-semibold text-[#C86D51] bg-[#FDF0EC] px-2.5 py-0.5 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              <h3 className="font-serif text-2xl font-semibold text-[#3D2C1F] leading-tight">
                {product.name}
              </h3>
              <p className="text-xs text-[#7A6A5A] italic mt-1 font-serif">
                "{product.tagline || 'Crafted with intention and pure botanical extracts'}"
              </p>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-[#4A3728]">
                  ₹{product.price}
                </span>
                <span className="text-xs text-[#8C7B6C]">Inclusive of all craft taxes</span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs text-[#5C4D3E] leading-relaxed">
                {product.description}
              </p>

              {/* Texture, Packaging & Fragrance specs */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#F4EDE2]/70 border border-[#E8DEC9] text-xs">
                <div>
                  <span className="text-[#8C7A68] block text-[10px] uppercase font-semibold">Texture</span>
                  <span className="font-medium text-[#4A3728]">{product.texture || 'Handcrafted Standard'}</span>
                </div>
                <div>
                  <span className="text-[#8C7A68] block text-[10px] uppercase font-semibold">Aroma Profile</span>
                  <span className="font-medium text-[#4A3728]">{product.fragrance || 'Botanical Notes'}</span>
                </div>
                <div>
                  <span className="text-[#8C7A68] block text-[10px] uppercase font-semibold">Craft Origin</span>
                  <span className="font-medium text-[#4A3728]">
                    {product.handmade !== undefined
                      ? (product.handmade ? '100% Handmade' : 'Commercial Studio')
                      : 'Artisan Batch'}
                  </span>
                </div>
                {product.packagingInfo && (
                  <div className="col-span-2 sm:col-span-3 border-t border-[#E8DEC9]/60 pt-2 mt-1">
                    <span className="text-[#8C7A68] block text-[10px] uppercase font-semibold">Packaging & Container</span>
                    <span className="font-medium text-[#4A3728]">{product.packagingInfo}</span>
                  </div>
                )}
                {(product.suitability || (product.skinTypes && product.skinTypes.length > 0)) && (
                  <div className="col-span-2 sm:col-span-3 border-t border-[#E8DEC9]/60 pt-2">
                    <span className="text-[#8C7A68] block text-[10px] uppercase font-semibold">Skin Type Suitability</span>
                    <span className="font-medium text-[#4A3728]">
                      {product.suitability || (Array.isArray(product.skinTypes) ? product.skinTypes.join(', ') : product.skinTypes)}
                    </span>
                  </div>
                )}
              </div>

              {/* Step 2 Transparency: Ingredient Verification Status Banner */}
              <div className={`mt-4 p-3 rounded-2xl border flex items-start gap-3 text-xs ${
                product.ingredientVerificationStatus === 'VERIFIED'
                  ? 'bg-[#EBF3ED] border-[#B5D6BE] text-[#2F5238]'
                  : product.ingredientVerificationStatus === 'UNVERIFIED'
                  ? 'bg-[#FEF5ED] border-[#F2CFAD] text-[#8C4A19]'
                  : 'bg-[#F4EDE2] border-[#E2D2BC] text-[#5C4A3A]'
              }`}>
                {product.ingredientVerificationStatus === 'VERIFIED' ? (
                  <ShieldCheck className="w-5 h-5 text-[#3D7A4F] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="font-semibold text-[11px] tracking-wide uppercase">
                      {product.ingredientVerificationStatus === 'VERIFIED'
                        ? 'Formulation Verified'
                        : product.ingredientVerificationStatus === 'UNVERIFIED'
                        ? 'Unverified Formulation'
                        : product.ingredientVerificationStatus === 'PENDING_REVIEW'
                        ? 'Verification Under Review'
                        : 'Artisan Transparency Profile'}
                    </span>
                    {product.lastVerificationDate && (
                      <span className="text-[10px] opacity-80 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 inline" /> Verified: {product.lastVerificationDate}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed">
                    {product.ingredientVerificationStatus === 'VERIFIED'
                      ? 'All ingredients and declared allergens have been independently catalogued and audited against our strict botanical purity standard.'
                      : product.ingredientVerificationStatus === 'UNVERIFIED'
                      ? 'Catalogue record lacks formal laboratory verification. Treated as unverified for sensitive allergy filtering.'
                      : 'Standard artisan records logged in catalog.'}
                  </p>
                </div>
              </div>

              {/* Smooth Expandable Ingredients Section */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mt-4 border border-[#E8DEC9] rounded-2xl p-3.5 bg-white/60">
                  <button
                    type="button"
                    onClick={() => setShowIngredients(!showIngredients)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-[#4A3728] uppercase tracking-wider"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#556B52]" />
                      <span>Declared Ingredients ({product.ingredients.length})</span>
                    </span>
                    <motion.div
                      animate={{ rotate: showIngredients ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-[#8C7A6A]" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {showIngredients && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-1.5 pt-3">
                          {product.ingredients.map((ing, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF0E4] border border-[#E5DAC8] text-[#5C4A3A]"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Cross-contamination Warning Disclosures */}
              {product.crossContaminationWarning && (
                <div className="mt-3 flex items-start gap-2 text-[11px] text-[#8C5E28] bg-[#FFF8EB] p-3 rounded-xl border border-[#F5DCB0]">
                  <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#703D14] font-semibold mb-0.5">Facility / Cross-Contamination Warning:</strong>
                    <span>{product.crossContaminationWarning}</span>
                  </div>
                </div>
              )}

              {/* Smooth Expandable Ritual Guide */}
              {product.howToUse && (
                <div className="mt-3 border border-[#E8DEC9] rounded-2xl p-3.5 bg-white/60">
                  <button
                    type="button"
                    onClick={() => setShowRitualGuide(!showRitualGuide)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-[#4A3728] uppercase tracking-wider"
                  >
                    <span>Artisan Ritual Guide</span>
                    <motion.div
                      animate={{ rotate: showRitualGuide ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-[#8C7A6A]" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {showRitualGuide && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="pt-2 text-xs text-[#6B5A4B] leading-relaxed">
                          {product.howToUse}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Allergens Notice & Verification Warnings (Clear & noticeable) */}
              {product.allergens || product.declaredAllergens ? (
                <div className="mt-3 flex items-start gap-2 text-[11px] text-[#8C6D4C] bg-[#FDF9F2] p-3 rounded-xl border border-[#F0E4D0]">
                  <AlertCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#4A3728] font-semibold mb-0.5">Declared Allergens:</strong>
                    <span>
                      {Array.isArray(product.declaredAllergens)
                        ? product.declaredAllergens.join(', ')
                        : (product.allergens || product.declaredAllergens)}
                    </span>
                  </div>
                </div>
              ) : (
                product.category !== 'Gift Hampers' &&
                product.category !== 'Gift Packaging' && (
                  <div className="mt-3 flex items-start gap-2 text-[11px] text-[#A6611A] bg-[#FEF6E4] p-3 rounded-xl border border-[#F4DCB0]">
                    <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#9A3412] font-semibold mb-0.5">Safety Verification Notice:</strong>
                      <span>Allergen disclosure unrecorded or absent in source records — unverified allergy-safe.</span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#E8DEC9] flex items-center gap-4">
              {/* Quantity selector */}
              <div className="flex items-center rounded-2xl bg-white border border-[#DACBB8] p-1 shadow-sm">
                <motion.button
                  type="button"
                  whileTap={shouldReduceMotion ? {} : { scale: 0.88 }}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#4A3728] hover:bg-[#F3ECE1] font-bold"
                >
                  -
                </motion.button>
                <span className="w-8 text-center text-sm font-semibold text-[#4A3728]">
                  {quantity}
                </span>
                <motion.button
                  type="button"
                  whileTap={shouldReduceMotion ? {} : { scale: 0.88 }}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#4A3728] hover:bg-[#F3ECE1] font-bold"
                >
                  +
                </motion.button>
              </div>

              {/* Add to Cart button */}
              <motion.button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.available}
                whileHover={shouldReduceMotion || !product.available ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion || !product.available ? {} : { scale: 0.98 }}
                className={`flex-1 py-3 px-6 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 shadow-md transition-colors ${
                  product.available
                    ? 'bg-[#556B52] hover:bg-[#435541] text-white'
                    : 'bg-[#CCC5BD] text-[#7A7167] cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {product.available
                    ? `Add to Selections (₹${product.price * quantity})`
                    : 'Temporarily Unavailable'}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
