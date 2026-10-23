import React, { useState } from 'react';
import { useSelections } from '../context/SelectionContext';
import { X, Star, ShoppingBag, ShieldCheck, Sparkles, Check, Heart, Leaf, AlertCircle } from 'lucide-react';

export default function ProductDetailModal({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { addStandaloneItem } = useSelections();

  if (!product) return null;

  const handleAddToCart = () => {
    addStandaloneItem(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E4D9C8] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#FAF7F2]/90 hover:bg-white text-[#4A3728] shadow-md border border-[#E5DAC9] transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

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
                <span className="text-xs text-[#8A7969]">({product.reviewCount} artisan reviews)</span>
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

              {/* Texture & Fragrance specs */}
              <div className="mt-5 grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F4EDE2]/70 border border-[#E8DEC9] text-xs">
                <div>
                  <span className="text-[#8C7A68] block text-[10px] uppercase font-semibold">Texture</span>
                  <span className="font-medium text-[#4A3728]">{product.texture || 'Handcrafted Standard'}</span>
                </div>
                <div>
                  <span className="text-[#8C7A68] block text-[10px] uppercase font-semibold">Aroma Profile</span>
                  <span className="font-medium text-[#4A3728]">{product.fragrance || 'Botanical Notes'}</span>
                </div>
              </div>

              {/* Verified Ingredients Accordion */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4A3728] uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#556B52]" />
                    <span>Verified Botanical Ingredients</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF0E4] border border-[#E5DAC8] text-[#5C4A3A]"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* How to use */}
              {product.howToUse && (
                <div className="mt-4 text-xs text-[#6B5A4B] bg-[#FFFDF9] p-3 rounded-xl border border-[#EAE1D3]">
                  <span className="font-semibold text-[#4A3728] block mb-1">Artisan Ritual Guide:</span>
                  {product.howToUse}
                </div>
              )}

              {/* Allergens note */}
              {product.allergens && (
                <div className="mt-3 flex items-start gap-2 text-[11px] text-[#8C6D4C] bg-[#FDF9F2] p-2.5 rounded-lg border border-[#F0E4D0]">
                  <AlertCircle className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>{product.allergens}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#E8DEC9] flex items-center gap-4">
              {/* Quantity selector */}
              <div className="flex items-center rounded-2xl bg-white border border-[#DACBB8] p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#4A3728] hover:bg-[#F3ECE1] font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-semibold text-[#4A3728]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#4A3728] hover:bg-[#F3ECE1] font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.available}
                className={`flex-1 py-3 px-6 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  product.available
                    ? 'bg-[#556B52] hover:bg-[#435541] text-white hover:scale-[1.02]'
                    : 'bg-[#CCC5BD] text-[#7A7167] cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.available ? `Add to Selections (₹${product.price * quantity})` : 'Temporarily Unavailable'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
