import React from 'react';
import { useSelections } from '../context/SelectionContext';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function ProductCard({ product, onSelectDetail }) {
  const { addStandaloneItem } = useSelections();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 16 }
      }
      animate={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0 }
      }
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      className="group relative flex flex-col bg-[#FFFDF9] rounded-3xl overflow-hidden border border-[#EBE3D5] shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#F6EFE6]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#4A3728]/90 text-white backdrop-blur-sm shadow-sm">
            {product.badge}
          </div>
        )}

        {/* Stock status indicator */}
        {!product.available && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-[#C86D51] text-white text-xs font-semibold tracking-wide">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick View Floating Button */}
        <motion.button
          type="button"
          onClick={() => onSelectDetail(product)}
          whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.92 }}
          className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/95 text-[#4A3728] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#556B52] hover:text-white"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#8C7A6A] font-medium tracking-wide uppercase text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center text-[#D4AF37]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 font-semibold text-[#4A3728] text-xs">
                {product.rating}
              </span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onSelectDetail(product)}
            className="font-serif text-lg font-semibold text-[#3D2C1F] group-hover:text-[#556B52] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-[#7A6B5D] line-clamp-2 mt-1 leading-relaxed">
            {product.tagline || product.description}
          </p>

          {/* Key ingredient highlight */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#695646] bg-[#FAF3EA] px-2 py-1 rounded-md border border-[#ECE0D0]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#556B52]"></span>
                <span className="truncate">{product.ingredients[0]}</span>
              </div>
              {product.ingredientVerificationStatus === 'VERIFIED' && (
                <span className="text-[9px] font-semibold text-[#3D7A4F] ml-1 shrink-0 uppercase tracking-wider">
                  Verified
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-[#EFE7DC] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8C7D70] block leading-none">Artisan Price</span>
            <span className="font-serif text-xl font-bold text-[#4A3728]">
              ₹{product.price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => onSelectDetail(product)}
              whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              className="text-xs font-medium text-[#7A6A5A] hover:text-[#4A3728] px-2 py-1.5 rounded-lg hover:bg-[#F2ECE1] transition-colors"
            >
              Details
            </motion.button>
            <motion.button
              type="button"
              onClick={() => addStandaloneItem(product, 1)}
              disabled={!product.available}
              whileHover={shouldReduceMotion || !product.available ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion || !product.available ? {} : { scale: 0.94 }}
              className={`p-2.5 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${
                product.available
                  ? 'bg-[#556B52] text-white hover:bg-[#435541]'
                  : 'bg-[#DDD6CE] text-[#8C847B] cursor-not-allowed'
              }`}
              title="Add to Selections"
            >
              <ShoppingBag className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
