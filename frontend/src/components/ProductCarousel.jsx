import React, { useRef, useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCarousel({
  products = [],
  title = 'Artisan Product Showcase',
  subtitle = 'Explore all micro-batch skincare, cold-processed soaps, and bespoke gift hampers',
  onSelectDetail,
  initialCategory = 'All'
}) {
  const scrollRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Derive unique categories from products
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category))).filter(Boolean)];

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  // Check scroll bounds
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [filteredProducts]);

  const handleScroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 340;
    const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="space-y-6">
      {/* Header with Title and Nav Arrows */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-[#342417]">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6A5A] mt-1">
            {subtitle}
          </p>
        </div>

        {/* Carousel Arrow Controls & Link to Shop */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#556B52] hover:text-[#3E523B] mr-2"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous products"
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
              canScrollLeft
                ? 'border-[#D5C7B4] bg-white text-[#4A3728] hover:bg-[#FAF6EE] shadow-sm active:scale-95'
                : 'border-[#EBE4D8] bg-[#F7F5F2] text-[#B0A598] cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next products"
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
              canScrollRight
                ? 'border-[#D5C7B4] bg-white text-[#4A3728] hover:bg-[#FAF6EE] shadow-sm active:scale-95'
                : 'border-[#EBE4D8] bg-[#F7F5F2] text-[#B0A598] cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const count = cat === 'All' ? products.length : products.filter((p) => p.category === cat).length;
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                }
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                active
                  ? 'bg-[#556B52] text-white shadow-sm'
                  : 'bg-white text-[#4A3728] hover:bg-[#FAF6EE] border border-[#E8DEC9]'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                active ? 'bg-white/20 text-white' : 'bg-[#F2ECE1] text-[#7A6A5A]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scrollable Track */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="w-[280px] sm:w-[320px] shrink-0 snap-start flex flex-col"
          >
            <ProductCard
              product={prod}
              onSelectDetail={onSelectDetail}
            />
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="w-full py-12 text-center text-xs text-[#7A6A5A]">
            No products found in this category.
          </div>
        )}
      </div>

      {/* Subtle Scroll Progress Indicator */}
      <div className="w-full bg-[#EBE4D8] h-0.5 rounded-full overflow-hidden">
        <div
          className="bg-[#556B52] h-full transition-all duration-150"
          style={{ width: `${Math.max(10, scrollProgress)}%` }}
        />
      </div>
    </section>
  );
}
