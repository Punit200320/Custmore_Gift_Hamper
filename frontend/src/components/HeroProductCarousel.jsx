import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroProductCarousel({
  products = [],
  onSelectDetail,
  onAddHamper,
  autoPlayInterval = 4500,
  className = ''
}) {
  const navigate = useNavigate();

  // Curated list of showcase products combining the coffee product and the uploaded real artisan products
  const defaultShowcase = [
    {
      id: 'showcase-coffee-scrub',
      refId: 'prod-ccs',
      name: 'Coffee Cocoa Body Scrub',
      category: 'Bath and Body',
      badge: 'Energizing Polish',
      badgeBg: 'bg-[#556B52] text-white',
      price: 549,
      originalPrice: 650,
      rating: 4.9,
      imageUrl: '/coffee-cocoa-body-scrub.jpg',
      subtitle: 'Roasted Arabica Grounds • Pure Cocoa Butter • Brown Sugar • Energize & Detoxify',
      isHamper: false
    },
    {
      id: 'showcase-almond-saffron',
      refId: 'prod-ass',
      name: 'Royal Almond Saffron Soap',
      category: 'Bath and Body',
      badge: 'Royal Luxury',
      badgeBg: 'bg-[#EDE4F5] text-[#5B2C82]',
      price: 349,
      originalPrice: 420,
      rating: 4.9,
      imageUrl: '/almond-saffron-soap.jpg',
      subtitle: 'Kashmiri Saffron Threads • Sweet Almond Oil • Raw Farm Goat Milk • Nourishing Glow',
      isHamper: false
    },
    {
      id: 'showcase-aloe-gel',
      refId: 'prod-avg',
      name: 'Pure Soothing Aloe Vera Gel',
      category: 'Handmade Skincare',
      badge: 'Pure & Gentle',
      badgeBg: 'bg-[#E9EFE9] text-[#2F5233]',
      price: 349,
      originalPrice: 450,
      rating: 4.8,
      imageUrl: '/aloe-vera-gel.jpg',
      subtitle: '99% Cold-Stabilized Aloe Juice • Soothing Cucumber Hydrosol • Ultra-Light Hydration',
      isHamper: false
    },
    {
      id: 'showcase-apricot-scrub',
      refId: 'prod-aws',
      name: 'Apricot Walnut Glow Scrub',
      category: 'Handmade Skincare',
      badge: 'Artisan Crafted',
      badgeBg: 'bg-[#FDF0EC] text-[#9E3E28]',
      price: 499,
      originalPrice: 620,
      rating: 4.8,
      imageUrl: '/apricot-walnut-glow-scrub.jpg',
      subtitle: 'Crushed Walnut Granules • Apricot Kernel Oil • Deep Pore Cleansing & Smooth Glow',
      isHamper: false
    },
    {
      id: 'showcase-kajal-lipbalm',
      refId: 'prod-lb',
      name: 'Botanical Lip Balm & Herbal Kajal Duo',
      category: 'Handmade Skincare',
      badge: 'Handcrafted Duo',
      badgeBg: 'bg-[#F7EBE8] text-[#7A3E31]',
      price: 499,
      originalPrice: 648,
      rating: 4.9,
      imageUrl: '/kajal-lip-balm.jpg',
      subtitle: 'Organic Castor Soot Herbal Kajal • Raw Honey & Beeswax Lip Balm • Traditional Care',
      isHamper: false
    },
    {
      id: 'showcase-body-butter',
      refId: 'prod-bb',
      name: 'Whipped Shea Body Butter',
      category: 'Bath and Body',
      badge: 'Customer Favourite',
      badgeBg: 'bg-[#F5EFEB] text-[#4A3728]',
      price: 599,
      originalPrice: 750,
      rating: 4.9,
      imageUrl: '/body-butter.jpg',
      subtitle: 'Triple-Whipped Ghanaian Raw Shea • Sweet Almond & Golden Jojoba • 24hr Moisture',
      isHamper: false
    }
  ];

  // If products are passed, merge any matching real data or use default showcase
  const items = defaultShowcase.map((item) => {
    const realProd = products.find((p) => p.id === item.refId);
    if (!realProd) return item;
    return {
      ...item,
      name: item.name || realProd.name,
      price: realProd.price || item.price,
      originalPrice: realProd.originalPrice || item.originalPrice,
      imageUrl: item.imageUrl || realProd.imageUrl,
      rating: realProd.rating || item.rating,
      realProduct: realProd
    };
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const total = items.length;
  const currentItem = items[currentIndex];

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Autoplay effect
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goToNext, isPaused, autoPlayInterval]);

  // Handle Quick View
  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onSelectDetail) {
      const prodToView = currentItem.realProduct || {
        id: currentItem.refId,
        name: currentItem.name,
        price: currentItem.price,
        category: currentItem.category,
        imageUrl: currentItem.imageUrl,
        tagline: currentItem.subtitle,
        description: currentItem.subtitle,
        rating: currentItem.rating,
        badge: currentItem.badge,
        available: true
      };
      onSelectDetail(prodToView);
    }
  };

  // Handle Hamper Action / Builder Link
  const handlePrimaryAction = (e) => {
    e.stopPropagation();
    if (currentItem.isHamper) {
      if (onAddHamper) {
        onAddHamper({
          id: currentItem.refId,
          name: currentItem.name,
          packaging: { name: currentItem.packaging || 'Artisan Chest', price: 0 },
          products: [],
          totalPrice: currentItem.price
        });
      } else {
        navigate(`/builder?customize=${currentItem.refId}`);
      }
    } else {
      if (onSelectDetail) {
        handleQuickView(e);
      } else {
        navigate('/shop');
      }
    }
  };

  // Variants for slide animation
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.97
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.28 },
        scale: { duration: 0.28 }
      }
    },
    exit: (dir) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.22 },
        scale: { duration: 0.22 }
      }
    })
  };

  return (
    <div
      className={`relative mx-auto max-w-md lg:max-w-none select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Outer Card with pristine white border & deep shadow matching the reference */}
      <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white transition-all duration-300">
        {/* Animated Carousel Viewport */}
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentItem.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex flex-col"
            >
              {/* Product Image Area */}
              <div className="relative w-full h-[360px] sm:h-[400px] overflow-hidden bg-[#181818] group">
                <img
                  src={currentItem.imageUrl}
                  alt={currentItem.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />

                {/* Subtle gradient vignette at top for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />

                {/* Floating Quick View Eye Icon */}
                <button
                  type="button"
                  onClick={handleQuickView}
                  aria-label="Quick preview product"
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#4A3728] hover:bg-white hover:text-[#556B52] shadow-md transition-all active:scale-90"
                  title="Quick View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Slide Counter Overlay */}
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-mono tracking-wider">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </div>
              </div>

              {/* Card Content Matching Exact Reference Layout */}
              <div className="p-6 bg-white space-y-3">
                {/* Badge & Price Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide shadow-xs ${
                      currentItem.badgeBg || 'bg-[#E8C5B8] text-[#4A3728]'
                    }`}
                  >
                    {currentItem.badge}
                  </span>

                  <div className="flex items-baseline gap-2">
                    {currentItem.originalPrice && (
                      <span className="text-xs line-through text-[#9E8E7E]">
                        ₹{currentItem.originalPrice}
                      </span>
                    )}
                    <span className="font-serif text-2xl font-bold text-[#4A3728]">
                      ₹{currentItem.price}
                    </span>
                  </div>
                </div>

                {/* Product Title */}
                <h3
                  onClick={handleQuickView}
                  className="font-serif text-xl sm:text-2xl font-semibold text-[#342417] leading-snug cursor-pointer hover:text-[#556B52] transition-colors line-clamp-1"
                >
                  {currentItem.name}
                </h3>

                {/* Subtitle / Bullet Highlights */}
                <p className="text-xs text-[#7A6A5A] line-clamp-2 leading-relaxed">
                  {currentItem.subtitle}
                </p>

                {/* Card Action Row */}
                <div className="pt-2 flex items-center justify-between border-t border-[#F2ECE1]">
                  <div className="flex items-center gap-1.5 text-xs text-[#556B52] font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentItem.isHamper ? 'Pre-curated Hamper' : 'Handcrafted Botanical'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleQuickView}
                      className="text-xs font-semibold text-[#7A6A5A] hover:text-[#342417] px-3 py-1.5 rounded-lg hover:bg-[#F7F2EC] transition-colors"
                    >
                      Details
                    </button>

                    <button
                      type="button"
                      onClick={handlePrimaryAction}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95"
                    >
                      <span>{currentItem.isHamper ? 'Choose' : 'Explore'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating Left & Right Navigation Arrows */}
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous product"
            className="absolute top-[180px] -translate-y-1/2 left-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md text-[#4A3728] hover:bg-white hover:text-[#556B52] shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next product"
            className="absolute top-[180px] -translate-y-1/2 right-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md text-[#4A3728] hover:bg-white hover:text-[#556B52] shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Bottom Indicator Dots / Progress Bar */}
        <div className="bg-[#FAF6F0] px-6 py-2.5 border-t border-[#EFE7DC] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {items.map((it, idx) => (
              <button
                key={it.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${it.name}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-7 bg-[#556B52]'
                    : 'w-2 bg-[#D9CEC1] hover:bg-[#B0A192]'
                }`}
              />
            ))}
          </div>

          <div className="text-[11px] text-[#8C7A6A] font-medium flex items-center gap-1">
            <span>Swipe or click arrows to explore</span>
          </div>
        </div>
      </div>

      {/* Decorative Warm Ambient Glow Behind the Card */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-[#E8C5B8]/30 via-transparent to-[#556B52]/10 rounded-[34px] -z-10 blur-xl opacity-60 pointer-events-none" />
    </div>
  );
}
