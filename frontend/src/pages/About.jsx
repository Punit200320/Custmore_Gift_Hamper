import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Package, ArrowRight, Gift } from 'lucide-react';

export default function About() {
  const pillars = [
    {
      title: 'Ethical Botanical Sourcing',
      desc: 'We partner directly with generational growers—harvesting certified Kashmiri Mogra saffron, copper-distilled Damask roses from Kannauj, and raw fair-trade nilotica shea butter.',
      icon: Leaf
    },
    {
      title: '6-Week Slow Cure Tradition',
      desc: 'Our artisan soaps undergo a strict 6-week cold-process curing cycle to preserve natural glycerin, skin barrier lipids, and raw aromatherapeutic terpenes without synthetic hardeners.',
      icon: ShieldCheck
    },
    {
      title: 'Artisan Keepsake Craft',
      desc: 'Every gift hamper is housed in reusable heirloom vessels: sustainably harvested pine wood chests, hand-woven willow baskets, and cotton deckled wish cards stamped with hot wax seals.',
      icon: Package
    }
  ];

  const standards = [
    { label: 'Cold-Pressed Oils', detail: 'Zero chemical hexane extraction; virgin golden jojoba and sweet almond oils.' },
    { label: 'Transparent Disclosures', detail: 'Every ingredient is fully printed on our jars; zero hidden fragrance compounds.' },
    { label: 'Cruelty-Free & Vegetarian', detail: 'Never tested on animals; free from parabens, phthalates, and harsh sulfates.' },
    { label: 'Zero-Waste Packaging', detail: 'Compostable excelsior wood shavings, natural jute twine, and reusable furoshiki wraps.' }
  ];

  return (
    <div className="space-y-20 pb-24">
      {/* Editorial Hero Header */}
      <section className="border-b border-[#EBE4D8] pt-12 md:pt-16 pb-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#342417] leading-tight">
            Crafted with intention. Guided by pure botanicals.
          </h1>
          <p className="text-sm sm:text-base text-[#6B5A4B] leading-relaxed max-w-2xl mx-auto pt-2">
            Surreal Treasures was born from a quiet rebellion against mass-produced cosmetics and generic gifting. We craft micro-batch skincare and bespoke celebration hampers designed to make life’s milestones truly unforgettable.
          </p>
        </div>
      </section>

      {/* Brand Manifesto & Heritage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-[#342417] leading-snug">
              Every creation begins with pure raw botanicals, not commercial bases.
            </h2>
            <div className="space-y-4 text-sm text-[#6B5A4B] leading-relaxed">
              <p>
                In our Pune workshop, we reject pre-made melt-and-pour bases, chemical foaming agents, and artificial fragrance oils. Instead, we begin with whole ingredients: raw unrefined shea from small cooperatives, cold-pressed golden jojoba, and steam-distilled Kannauj floral waters.
              </p>
              <p>
                Our skincare is formulated for mindful rituals. Whether smoothing our whipped vanilla body soufflé post-bath or pressing warm drops of saffron nectar into tired evening skin, each formula is crafted to nourish both barrier and spirit.
              </p>
              <p>
                When it comes to gifting, we believe a gift should be a keepsake, not packaging destined for a landfill. Solid pine chests with vintage brass latches, Japanese stone-washed linen furoshiki wraps, and custom calligraphy deckled cards are created to be cherished for years.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#E8DEC9] bg-white shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1608248597359-0a6a9ef1c9b4?auto=format&fit=crop&w=900&q=80"
                alt="Botanical Formulation Workshop"
                className="w-full h-[460px] object-cover"
              />
              <div className="p-6 bg-white border-t border-[#EBE4D8] space-y-1">
                <span className="font-serif text-lg font-semibold text-[#342417] block">
                  The Artisan Workshop
                </span>
                <p className="text-xs text-[#7A6A5A]">
                  Small-batch copper alembic distillation and 6-week cold-process curing in Koregaon Park, Pune.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#342417]">
            The Three Principles of Our Craft
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-[#EBE4D8] shadow-sm space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FAF3EA] text-[#556B52] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#342417]">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5A4B] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Transparency Standards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#FAF7F2] border border-[#EBE4D8]">
          <div className="max-w-2xl mb-8 space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#342417]">
              Honest Formulations. Zero Compromises.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((s, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="font-serif font-semibold text-sm text-[#342417] block">
                  {s.label}
                </span>
                <p className="text-xs text-[#6B5A4B] leading-relaxed">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#342417]">
          Experience Surreal Treasures
        </h2>
        <p className="text-xs sm:text-sm text-[#6B5A4B] max-w-xl mx-auto">
          Whether you are looking for a gentle daily skincare ritual or curating thoughtful personalized hampers for your closest family and friends, we welcome you to our collection.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/builder"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4 text-[#E8C5B8]" />
            <span>Build a Personalized Hamper</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#4A3728] border border-[#DDD1C0] font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Standalone Products</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
