import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelections } from '../context/SelectionContext';
import { Gift, Sparkles, ShoppingBag, Menu, X, ShieldCheck, HeartHandshake, Compass } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totals } = useSelections();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gift Hamper Builder', path: '/builder', highlight: true },
    { name: 'Shop Catalogue', path: '/shop' },
    { name: 'Skincare Discovery', path: '/skincare-discovery', badge: 'Guided' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin', path: '/admin', isDim: true }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EBE4D8] transition-all">
      {/* Luxury Announcement Bar */}
      <div className="bg-[#4A3728] text-[#F5EFEB] py-1.5 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <span>Bespoke Artisan Hampers & Botanical Skincare • Handcrafted with love in small batches</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-xs text-[#E2D6C5]">
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-[#D4AF37]" />
              Complimentary Calligraphed Card
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6B8E68]" />
              100% Verified Pure Ingredients
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav Container */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group py-1" aria-label="Surreal Treasures Home">
          <img
            src="/logo.png"
            alt="Surreal Treasures - Beauty Treasure"
            className="h-11 sm:h-13 md:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#556B52] text-white shadow-sm'
                    : link.highlight
                    ? 'text-[#556B52] hover:bg-[#556B52]/10 font-semibold'
                    : link.isDim
                    ? 'text-[#8A7F73] hover:text-[#4A3728] hover:bg-[#EFE8DD]'
                    : 'text-[#4A3728] hover:text-[#556B52] hover:bg-[#F2ECE1]'
                }`}
              >
                {link.name}
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#E8C5B8] text-[#4A3728] rounded-full">
                    {link.badge}
                  </span>
                )}
                {link.highlight && !active && (
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Button: My Selections */}
        <div className="flex items-center gap-3">
          <Link
            to="/selections"
            className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#FAF0E6] hover:bg-[#F3E3D3] text-[#4A3728] border border-[#E4D0BD] font-medium text-sm shadow-sm transition-all hover:scale-105"
            title="View Selected Hampers & Products"
          >
            <ShoppingBag className="w-4 h-4 text-[#556B52]" />
            <span className="hidden sm:inline">My Selections</span>
            <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold rounded-full bg-[#556B52] text-white">
              {totals.totalItemCount}
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-[#4A3728] hover:bg-[#EDE5D8] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E6DDD0] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fade-in">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  active
                    ? 'bg-[#556B52] text-white'
                    : 'text-[#4A3728] hover:bg-[#EFE8DC]'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-[#E8C5B8] text-[#4A3728] rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#E6DDD0]">
            <Link
              to="/selections"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#556B52] text-white font-medium"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>View My Selections ({totals.totalItemCount})</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
