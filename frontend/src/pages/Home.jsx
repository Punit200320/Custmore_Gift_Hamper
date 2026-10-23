import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelections } from '../context/SelectionContext';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { OCCASIONS } from '../data/demoProducts';
import {
  Sparkles,
  Gift,
  Compass,
  ArrowRight,
  ShieldCheck,
  Star,
  Leaf,
  HeartHandshake,
  PackageCheck,
  CheckCircle2,
  Clock,
  Quote
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { products, addHamperToCart } = useSelections();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter curated hampers and popular skincare for home showcase
  const featuredHampers = products.filter((p) => p.category === 'Gift Hampers');
  const popularSkincare = products.filter((p) => p.isSkincare && p.isPopular).slice(0, 4);

  const testimonials = [
    {
      id: 1,
      quote:
        'The Royal Bridal Hamper exceeded every expectation. The engraved keepsake wooden chest and raw saffron elixir were the talk of the wedding evening.',
      name: 'Pooja & Rohan Mehra',
      location: 'South Mumbai',
      occasion: 'Wedding Gift Hamper',
      rating: 5
    },
    {
      id: 2,
      quote:
        'Surreal Treasures’ guided skincare assistant helped me discover the Lavender & Goat Milk cold-process soap. It has become our household sacred ritual.',
      name: 'Dr. Devika Rao',
      location: 'Bengaluru, Karnataka',
      occasion: 'Self-Care Routine',
      rating: 5
    },
    {
      id: 3,
      quote:
        'We ordered 40 custom hampers for Diwali corporate gifting. The personalized wax-sealed cards and fragrant soy candles made our leadership clients feel truly valued.',
      name: 'Aditya Singhania',
      location: 'Gurugram, NCR',
      occasion: 'Corporate Gifting',
      rating: 5
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-28">
        {/* Soft botanical ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#E8C5B8]/30 via-[#556B52]/15 to-[#D4AF37]/20 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFE7DC] border border-[#DDD2C3] text-xs font-semibold text-[#556B52] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Handmade Botanicals & Personalised Gifting Platform</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#342417] leading-[1.15] font-semibold tracking-tight">
                Thoughtful Gifts.{' '}
                <span className="italic font-normal text-[#556B52] block sm:inline">
                  Meaningful Moments.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#6B5A4B] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover micro-batch botanical skincare formulations and design custom personalised gift hampers tailored to your exact budget, aesthetic style, and celebratory occasion.
              </p>

              {/* Dual CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/builder"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-base shadow-lg shadow-[#556B52]/20 hover:scale-105 transition-all flex items-center justify-center gap-2.5"
                >
                  <Gift className="w-5 h-5 text-[#E8C5B8]" />
                  <span>Create Your Gift Hamper</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/skincare-discovery"
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-[#FAF3EA] text-[#4A3728] border border-[#DDD1C0] font-medium text-base shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Compass className="w-5 h-5 text-[#C86D51]" />
                  <span>Discover Your Skincare</span>
                </Link>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#EAE1D3] text-center lg:text-left">
                <div>
                  <span className="font-serif text-2xl font-bold text-[#4A3728] block">100%</span>
                  <span className="text-xs text-[#7A6A5A]">Pure Botanical Oils</span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-[#4A3728] block">Bespoke</span>
                  <span className="text-xs text-[#7A6A5A]">Budget-Aware Hampers</span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-[#4A3728] block">Pan-India</span>
                  <span className="text-xs text-[#7A6A5A]">Artisan Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
                    alt="Artisan Gift Hamper by Surreal Treasures"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="p-6 bg-[#FAF7F2]">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#E8C5B8] text-[#4A3728]">
                        Featured Hamper
                      </span>
                      <span className="font-serif text-xl font-bold text-[#4A3728]">
                        ₹2,849
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-[#342417] mt-2">
                      The Royal Bridal Radiance Hamper
                    </h3>
                    <p className="text-xs text-[#7A6A5A] mt-1">
                      Kashmiri Saffron Nectar • Xiuyan Jade Roller • Pine Chest • Wax-Sealed Note
                    </p>
                  </div>
                </div>

                {/* Floating Micro-Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#E8DEC9] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#556B52] flex items-center justify-center text-white">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-sm text-[#4A3728] block">4.9 / 5.0 Rating</span>
                    <span className="text-[11px] text-[#7A6A5A]">From 650+ Handcrafted Hampers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OCCASION-BASED GIFTING CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#556B52]">
            Curated For Every Milestone
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3D2C1F] mt-2">
            Occasion-Based Gifting
          </h2>
          <p className="text-sm text-[#7A6A5A] mt-2">
            Select an occasion to immediately launch our interactive recommendation engine with tuned budget combinations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {OCCASIONS.map((occ) => (
            <div
              key={occ.id}
              onClick={() => navigate(`/builder?occasion=${encodeURIComponent(occ.id)}`)}
              className="group cursor-pointer p-6 rounded-3xl bg-[#FFFDF9] border border-[#EBE3D5] hover:border-[#556B52] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5EDE1] group-hover:bg-[#556B52] group-hover:text-white text-[#556B52] flex items-center justify-center transition-all duration-300">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#4A3728] group-hover:text-[#556B52] mt-4 transition-colors">
                {occ.label}
              </h3>
              <p className="text-xs text-[#8C7A6A] mt-1 line-clamp-2">
                {occ.desc}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#556B52] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Build Hamper</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED GIFT HAMPERS */}
      <section className="bg-[#FAF3EA] py-16 border-y border-[#E8DEC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#556B52]">
                Ready-To-Gift Collections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3D2C1F] mt-1">
                Featured Artisan Hampers
              </h2>
              <p className="text-sm text-[#7A6A5A] mt-1">
                Pre-curated with complementary formulations, luxury packaging, and custom keepsake cards.
              </p>
            </div>
            <Link
              to="/builder"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#556B52] hover:text-[#3E523B]"
            >
              <span>Explore All Combinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHampers.slice(0, 3).map((hamper) => (
              <div
                key={hamper.id}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E5DAC9] shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F0E6D8]">
                  <img
                    src={hamper.imageUrl}
                    alt={hamper.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-[#4A3728] text-white">
                    {hamper.badge || 'Signature Set'}
                  </div>
                  {hamper.originalPrice && (
                    <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#E8C5B8] text-[#4A3728]">
                      Save ₹{hamper.originalPrice - hamper.price}
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#8C7A6A] mb-1">
                      <span>{hamper.style}</span>
                      <div className="flex items-center text-[#D4AF37]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="ml-1 font-bold text-[#4A3728]">{hamper.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-semibold text-[#342417]">
                      {hamper.name}
                    </h3>

                    <p className="text-xs text-[#7A6A5A] mt-2 line-clamp-2">
                      {hamper.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#F2ECE1]">
                      <span className="text-[10px] font-semibold text-[#8C7A6A] uppercase tracking-wider block mb-1">
                        Includes:
                      </span>
                      <ul className="text-xs text-[#554637] space-y-1">
                        {hamper.itemNames?.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 truncate">
                            <CheckCircle2 className="w-3 h-3 text-[#556B52] shrink-0" />
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F2ECE1] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8C7A6A] block">Total Value</span>
                      <span className="font-serif text-2xl font-bold text-[#4A3728]">
                        ₹{hamper.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          addHamperToCart({
                            id: hamper.id,
                            name: hamper.name,
                            packaging: { name: hamper.packagingIncluded || 'Artisan Chest', price: 0 },
                            products: hamper.itemNames.map((name, i) => ({ id: `p-${i}`, name, price: 0, quantity: 1 })),
                            totalPrice: hamper.price
                          });
                        }}
                        className="px-4 py-2.5 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white text-xs font-semibold shadow-sm hover:scale-105 transition-all"
                      >
                        Choose Hamper
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/builder?customize=${hamper.id}`)}
                        className="px-3.5 py-2.5 rounded-full border border-[#D5C7B4] hover:bg-[#FAF4ED] text-[#4A3728] text-xs font-medium transition-colors"
                      >
                        Customise
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR ARTISAN SKINCARE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#556B52]">
              Micro-Batch Formulations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3D2C1F] mt-1">
              Popular Skincare Rituals
            </h2>
            <p className="text-sm text-[#7A6A5A] mt-1">
              Crafted with cold-pressed botanical seeds, steam-distilled hydrosols, and unrefined plant butters.
            </p>
          </div>
          <Link
            to="/shop"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#556B52] hover:text-[#3E523B]"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularSkincare.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectDetail={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF6EE] rounded-3xl p-8 sm:p-12 border border-[#E7DCB8] shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#556B52]">
              Transparent & Seamless
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3D2C1F] mt-2">
              How Surreal Treasures Works
            </h2>
            <p className="text-sm text-[#7A6A5A] mt-2">
              From personalizing combinations to handcrafting every bottle, our process guarantees delight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#556B52] text-white flex items-center justify-center font-serif text-xl font-bold shadow-md">
                1
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#4A3728]">
                Select Occasion & Budget
              </h3>
              <p className="text-xs text-[#7A6A5A] leading-relaxed">
                Tell us who you're celebrating and your budget cap (from ₹500 to ₹10,000+).
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#C5A059] text-white flex items-center justify-center font-serif text-xl font-bold shadow-md">
                2
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#4A3728]">
                Get Transparent Matches
              </h3>
              <p className="text-xs text-[#7A6A5A] leading-relaxed">
                Our rule-based engine generates real combinations with itemized product prices and zero guesswork.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#C86D51] text-white flex items-center justify-center font-serif text-xl font-bold shadow-md">
                3
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#4A3728]">
                Customise Packaging & Note
              </h3>
              <p className="text-xs text-[#7A6A5A] leading-relaxed">
                Swap items, pick pine trunks or velvet baskets, and compose your personalized calligraphed card.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#4A3728] text-white flex items-center justify-center font-serif text-xl font-bold shadow-md">
                4
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#4A3728]">
                Artisan Review & Delivery
              </h3>
              <p className="text-xs text-[#7A6A5A] leading-relaxed">
                Submit an order enquiry. Our studio reviews within hours and delivers across India with tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS (CLEARLY LABELED DEMO CONTENT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE2D5] text-[10px] uppercase font-bold text-[#6B5A4B] tracking-wider mb-2">
            <span>Verified Customer Stories (Demonstration Content)</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3D2C1F]">
            Loved for Heartfelt Details
          </h2>
          <p className="text-sm text-[#7A6A5A] mt-2">
            Read what patrons say about our sensory fragrances, packaging aesthetics, and custom gifting care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-3xl bg-[#FFFDF9] border border-[#E9DFCE] shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center text-[#D4AF37]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-[#E2D4C3]" />
                <p className="text-sm text-[#5C4B3D] italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2ECE1]">
                <h4 className="font-serif font-bold text-[#4A3728] text-base">{t.name}</h4>
                <div className="text-xs text-[#8C7A6A] flex items-center justify-between mt-0.5">
                  <span>{t.location}</span>
                  <span className="font-medium text-[#556B52]">{t.occasion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL INVITATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#4A3728] via-[#3E2F22] to-[#2B1F16] text-[#F7EFE6] p-8 sm:p-14 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              Bespoke Bulk & Individual Orders
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Ready to create something truly unforgettable?
            </h2>
            <p className="text-sm text-[#D5C6B5] leading-relaxed">
              Start building your personalized hamper today or explore our botanical skincare formulations tailored to your sensory preferences.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/builder"
                className="px-8 py-3.5 rounded-full bg-[#556B52] hover:bg-[#688264] text-white font-medium text-sm shadow-md transition-all hover:scale-105"
              >
                Launch Hamper Builder
              </Link>
              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all"
              >
                Enquire For Corporate / Bulk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
