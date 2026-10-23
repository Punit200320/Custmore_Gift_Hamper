import React from 'react';
import { useSelections } from '../context/SelectionContext';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';

export default function ProductCard({ product, onSelectDetail }) {
  const { addStandaloneItem } = useSelections();

  return (
    <div className="group relative flex flex-col bg-[#FFFDF9] rounded-3xl overflow-hidden border border-[#EBE3D5] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
        <button
          type="button"
          onClick={() => onSelectDetail(product)}
          className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/95 text-[#4A3728] shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-[#556B52] hover:text-white"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
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
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-[#695646] bg-[#FAF3EA] px-2 py-1 rounded-md border border-[#ECE0D0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#556B52]"></span>
              <span className="truncate">{product.ingredients[0]}</span>
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
            <button
              type="button"
              onClick={() => onSelectDetail(product)}
              className="text-xs font-medium text-[#7A6A5A] hover:text-[#4A3728] px-2 py-1.5 rounded-lg hover:bg-[#F2ECE1] transition-colors"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => addStandaloneItem(product, 1)}
              disabled={!product.available}
              className={`p-2.5 rounded-2xl flex items-center justify-center transition-all ${
                product.available
                  ? 'bg-[#556B52] text-white hover:bg-[#435541] hover:scale-105 shadow-sm'
                  : 'bg-[#DDD6CE] text-[#8C847B] cursor-not-allowed'
              }`}
              title="Add to Selections"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
