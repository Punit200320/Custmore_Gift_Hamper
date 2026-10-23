import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelections } from '../context/SelectionContext';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { CATEGORIES } from '../data/demoProducts';
import { Search, SlidersHorizontal, ArrowUpDown, Filter, Sparkles, Check } from 'lucide-react';

export default function ProductCatalogue() {
  const [searchParams] = useSearchParams();
  const { products } = useSelections();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Products');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'All Products' && p.category !== selectedCategory) {
          return false;
        }

        // In stock only filter
        if (inStockOnly && !p.available) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchTag = p.tagline?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchCat = p.category?.toLowerCase().includes(q);
          const matchIng = p.ingredients?.some((ing) => ing.toLowerCase().includes(q));
          if (!matchName && !matchTag && !matchDesc && !matchCat && !matchIng) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'popular') return (b.reviewCount || 0) - (a.reviewCount || 0);
        return 0; // featured default
      });
  }, [products, selectedCategory, searchQuery, sortBy, inStockOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE2D5] text-xs font-semibold text-[#556B52]">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Small Batch Formulations & Keepsakes</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3D2C1F]">
          Digital Product Catalogue
        </h1>
        <p className="text-sm text-[#7A6A5A]">
          Explore pure cold-pressed face elixirs, artisan cured soaps, hand-poured candles, and luxury packaging.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E8DEC9] shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Live Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#8C7A6A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ingredient (e.g. Saffron, Rosehip), product name, or aroma..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs sm:text-sm text-[#3D2C1F] focus:outline-none focus:ring-2 focus:ring-[#556B52]"
            />
          </div>

          {/* Sort Selector */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#8C7A6A] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 rounded-2xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs text-[#3D2C1F] focus:outline-none focus:ring-2 focus:ring-[#556B52]"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* In-Stock Toggle */}
          <div className="sm:col-span-3 flex items-center justify-end">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#4A3728] select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#556B52] focus:ring-[#556B52] border-[#D5C7B4]"
              />
              <span>In-Stock Only</span>
            </label>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#556B52] text-white shadow-sm'
                    : 'bg-[#FAF7F2] text-[#4A3728] hover:bg-[#F2ECE1] border border-[#E5DAC9]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Results Status */}
      <div className="flex items-center justify-between text-xs text-[#8C7A6A] px-2">
        <span>
          Showing <strong className="text-[#4A3728]">{filteredProducts.length}</strong> items in{' '}
          <strong className="text-[#556B52]">{selectedCategory}</strong>
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#C86D51] hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectDetail={(p) => setSelectedProductForModal(p)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E5DAC9] space-y-3">
          <p className="font-serif text-xl text-[#4A3728]">
            No products found matching your filter criteria.
          </p>
          <p className="text-xs text-[#8C7A6A]">
            Try loosening search terms or selecting 'All Products'.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Products');
              setInStockOnly(false);
            }}
            className="px-6 py-2.5 rounded-full bg-[#556B52] text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}
    </div>
  );
}
