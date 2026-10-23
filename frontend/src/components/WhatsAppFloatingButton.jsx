import React, { useState } from 'react';

export default function WhatsAppFloatingButton({
  phoneNumber = '919726002115',
  defaultMessage = "Hi Surreal Treasures! I'd love to know more about your bespoke hampers and handcrafted products."
}) {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside
      aria-label="Direct WhatsApp Concierge"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 select-none"
    >
      {/* Floating Tooltip Pill */}
      <span
        role="status"
        className={`hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#2D231B] text-[#F7EFE6] text-xs font-medium shadow-lg transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] mr-2 animate-pulse" />
        Direct Message to Owner
      </span>

      {/* Circular WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Owner directly on WhatsApp at +91 97260 02115"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {/* Pulsing ring around button */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none opacity-75" />

        {/* WhatsApp Icon */}
        <svg
          className="w-7 h-7 fill-current transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.768.46 3.494 1.332 5.01L2 22l5.097-1.336a10.007 10.007 0 004.934 1.288h.005c5.535 0 10.03-4.496 10.03-10.031 0-2.68-1.043-5.2-2.936-7.094A9.96 9.96 0 0012.031 2zm0 18.358h-.004a8.31 8.31 0 01-4.237-1.157l-.304-.18-3.148.825.84-3.07-.197-.314a8.318 8.318 0 01-1.272-4.43c0-4.606 3.748-8.354 8.356-8.354 2.23 0 4.327.87 5.904 2.447a8.297 8.297 0 012.446 5.903c0 4.607-3.748 8.355-8.344 8.355zm4.577-6.248c-.25-.125-1.482-.731-1.712-.815-.23-.084-.397-.125-.564.125-.167.25-.646.815-.792.982-.146.167-.292.188-.542.063-.25-.125-1.055-.389-2.01-1.24-.743-.663-1.246-1.482-1.392-1.732-.146-.25-.016-.385.109-.51.113-.112.25-.292.375-.438.125-.146.167-.25.25-.417.084-.167.042-.313-.02-.438-.063-.125-.564-1.358-.773-1.86-.203-.49-.408-.423-.564-.431-.146-.008-.313-.01-.48-.01s-.438.063-.667.313c-.23.25-.876.856-.876 2.087 0 1.231.897 2.42 1.022 2.587.125.167 1.764 2.694 4.274 3.778.597.258 1.063.412 1.427.528.6.19 1.146.163 1.578.099.48-.072 1.482-.605 1.69-1.189.209-.584.209-1.085.146-1.189-.062-.104-.229-.167-.479-.292z" />
        </svg>

        {/* Small Active Badge Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
      </a>
    </aside>
  );
}
