import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, MapPin, Mail, Phone, Shield, Leaf, PackageCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2D231B] text-[#EDE4DA] pt-16 pb-12 border-t border-[#3E3228]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Highlights Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#433529]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#556B52]/40 text-[#A2C29E] flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-[#F7EFE6] text-base">Pure Botanicals</h4>
              <p className="text-xs text-[#B5A595] mt-1 leading-relaxed">
                Handcrafted using cold-pressed virgin oils, raw butters, and therapeutic floral distillates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/30 text-[#E7C789] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-[#F7EFE6] text-base">Bespoke Customisation</h4>
              <p className="text-xs text-[#B5A595] mt-1 leading-relaxed">
                Personalized engraved bamboo lids, handmade wax seals, and calligraphed wish cards.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C86D51]/30 text-[#EBB19E] flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-[#F7EFE6] text-base">Eco Keepsake Boxes</h4>
              <p className="text-xs text-[#B5A595] mt-1 leading-relaxed">
                Sturdy pine wood chests, hand-woven willow baskets, and zero-waste Japanese furoshiki wraps.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#556B52]/40 text-[#A2C29E] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-[#F7EFE6] text-base">Transparent Formulations</h4>
              <p className="text-xs text-[#B5A595] mt-1 leading-relaxed">
                100% verified ingredient disclosures. Free from parabens, synthetic fillers, and harsh sulfates.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pt-12 pb-12">
          {/* Brand Intro */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block group" aria-label="Surreal Treasures Home">
              <div className="bg-[#FAF7F2] px-3.5 py-1.5 rounded-2xl inline-flex items-center shadow-md transition-transform group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Surreal Treasures - Beauty Treasure"
                  className="h-12 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-[#B5A595] leading-relaxed max-w-sm">
              Crafting sensory joy through micro-batch artisan skincare and bespoke gift hampers designed to elevate birthdays, weddings, celebrations, and peaceful everyday rituals.
            </p>
            <div className="pt-2 text-xs text-[#8C7B6C] flex items-center gap-2">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-[#C86D51] fill-current" />
              <span>for thoughtful moments across India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-[#F5EFEB] text-sm uppercase tracking-wider">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-sm text-[#B5A595]">
              <li>
                <Link to="/builder" className="hover:text-[#E7C789] transition-colors">
                  Hamper Builder
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#E7C789] transition-colors">
                  Full Catalogue
                </Link>
              </li>
              <li>
                <Link to="/skincare-discovery" className="hover:text-[#E7C789] transition-colors">
                  Skincare Discovery
                </Link>
              </li>
              <li>
                <Link to="/selections" className="hover:text-[#E7C789] transition-colors">
                  My Selections & Enquiry
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#E7C789] transition-colors">
                  Admin Demonstration Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-[#F5EFEB] text-sm uppercase tracking-wider">
              Product Categories
            </h4>
            <ul className="space-y-2 text-sm text-[#B5A595]">
              <li>
                <Link to="/shop" className="hover:text-[#E7C789] transition-colors">
                  Handmade Skincare
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#E7C789] transition-colors">
                  Artisan Cold-Process Soaps
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#E7C789] transition-colors">
                  Whipped Body Soufflés
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#E7C789] transition-colors">
                  Xiuyan Jade Tools
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#E7C789] transition-colors">
                  Personalised Engraved Candles
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Contact */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-[#F5EFEB] text-sm uppercase tracking-wider">
              Studio & Enquiries
            </h4>
            <div className="space-y-2.5 text-xs text-[#B5A595]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Artisan Studio, Koregaon Park, Pune, Maharashtra 411001</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>concierge@surrealtreasures.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+91 98230 76543 (Mon–Sat, 10am–7pm)</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] bg-[#3E3228] text-[#D4AF37] border border-[#524133]">
                Pan-India Express Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Disclaimer */}
        <div className="pt-8 border-t border-[#433529] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A7969] gap-4">
          <p>© {new Date().getFullYear()} Surreal Treasures. All rights reserved. Handcrafted boutique gifting.</p>
          <p className="text-[11px] text-[#A69585] text-center sm:text-right">
            Non-medical platform disclaimer: All skincare information is provided for personal care and ingredient transparency.
          </p>
        </div>
      </div>
    </footer>
  );
}
