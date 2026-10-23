import React, { useState } from 'react';
import { useSelections } from '../context/SelectionContext';
import {
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Clock,
  Send,
  CheckCircle2,
  Package
} from 'lucide-react';

export default function Contact() {
  const { showToast } = useSelections();
  const [formSent, setFormSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    eventType: 'Corporate Gifting',
    quantity: '25-50 Hampers',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    showToast('Your bulk gifting enquiry has been registered with our studio!');
  };

  const faqs = [
    {
      q: 'Can we laser-engrave corporate logos or bride & groom monograms?',
      a: 'Yes, absolutely. Our solid bamboo lids, pine wood keepsake chests, and wooden trinket trays can be customized with high-precision pyrographed initials, names, or corporate crests.'
    },
    {
      q: 'How long do your cold-processed soaps and body butters stay fresh?',
      a: 'Because our formulations are crafted from pure cold-pressed botanical oils and unrefined plant butters without harsh synthetic preservatives, our soaps maintain optimal aromatherapy for 12 months, and body soufflés are best enjoyed within 9 months of opening.'
    },
    {
      q: 'What is the delivery timeline for custom hampers across India?',
      a: 'Standard individual hampers are assembled and dispatched within 24–48 hours and typically arrive within 3–5 business days nationwide. For bulk wedding or corporate batches (20+ hampers), we recommend reserving 10–14 days in advance.'
    },
    {
      q: 'Are your botanical skincare formulations safe for sensitive skin?',
      a: 'Yes, our formulations focus on minimal, restorative, edible-grade ingredients like cold-pressed sweet almond, raw Ghanaian shea, and pure herbal distillates. All ingredients are clearly disclosed on each product page and packaging label.'
    },
    {
      q: 'How does payment and order confirmation work?',
      a: 'After you submit an enquiry through our platform, our master artisan confirms your exact customisation, verifies cure dates, and sends a formal quote and secure digital payment link via WhatsApp or email.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE2D5] text-xs font-semibold text-[#556B52]">
          <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Artisan Concierge</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3D2C1F]">
          Get in Touch with Our Studio
        </h1>
        <p className="text-sm text-[#7A6A5A]">
          Whether you're planning bulk wedding favors, corporate employee appreciation, or looking for product guidance, we'd love to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Studio Info & Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DAC9] shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#3D2C1F]">
              Artisan Workshop & Concierge
            </h3>

            <div className="space-y-4 text-xs text-[#554637]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0E4] text-[#8C6D37] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#3D2C1F] block text-sm">
                    Surreal Treasures Studio
                  </span>
                  <span className="text-[#7A6A5A] leading-relaxed block mt-0.5">
                    Artisan Workshop, Lane 7, Koregaon Park, Pune, Maharashtra 411001, India
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0E4] text-[#8C6D37] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#3D2C1F] block text-sm">
                    Email Correspondence
                  </span>
                  <span className="text-[#7A6A5A] block mt-0.5">
                    concierge@surrealtreasures.in
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0E4] text-[#8C6D37] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#3D2C1F] block text-sm">
                    WhatsApp & Phone Concierge
                  </span>
                  <span className="text-[#7A6A5A] block mt-0.5">
                    +91 98230 76543 (Mon–Sat, 10:00 AM – 7:00 PM IST)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Connect Button */}
            <div className="pt-2">
              <a
                href="https://wa.me/919823076543?text=Hi%20Surreal%20Treasures!%20I'd%20love%20to%20enquire%20about%20a%20custom%20gift%20hamper."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick FAQ Box */}
          <div className="bg-[#FAF6EE] p-6 rounded-3xl border border-[#E7DCB8] space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#3D2C1F]">
              Frequently Asked Questions
            </h4>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#E8DEC9] bg-white overflow-hidden text-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full p-3 text-left font-semibold text-[#4A3728] flex items-center justify-between gap-2"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8C7A6A] transition-transform ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="p-3 pt-0 text-[#6B5A4B] leading-relaxed border-t border-[#F2ECE1]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Corporate / Bulk Gifting Consultation Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5DAC9] shadow-md space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#556B52] tracking-wider block">
                Bulk Orders & Special Events
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#3D2C1F] mt-1">
                Corporate & Wedding Consultation
              </h3>
              <p className="text-xs text-[#7A6A5A] mt-1">
                Planning 10 or more bespoke hampers? Let us tailor a private tasting session or presentation deck.
              </p>
            </div>

            {formSent ? (
              <div className="p-8 text-center space-y-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DAC9]">
                <CheckCircle2 className="w-12 h-12 text-[#556B52] mx-auto" />
                <h4 className="font-serif text-xl font-bold text-[#3D2C1F]">
                  Consultation Request Received
                </h4>
                <p className="text-xs text-[#7A6A5A] max-w-sm mx-auto">
                  Thank you! Our studio concierge will contact you with volume discount tiers and sample kit options.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSent(false)}
                  className="mt-2 px-5 py-2 rounded-full border border-[#D5C7B4] text-xs font-semibold text-[#4A3728]"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Shalini Kapoor"
                      className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                      Organization / Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Acme Ventures / Private Wedding"
                      className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. shalini@example.com"
                      className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98200 12345"
                      className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                      Event / Occasion Type
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2]"
                    >
                      <option value="Corporate Gifting">Corporate Festive / Rewards</option>
                      <option value="Wedding Favors">Wedding & Bridal Trousseau</option>
                      <option value="Milestone Anniversary">Milestone Celebration</option>
                      <option value="PR & Influencer Kits">Brand PR & Influencer Box</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                      Estimated Hamper Quantity
                    </label>
                    <select
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2]"
                    >
                      <option value="10-25 Hampers">10–25 Hampers</option>
                      <option value="25-50 Hampers">25–50 Hampers</option>
                      <option value="50-100 Hampers">50–100 Hampers</option>
                      <option value="100+ Hampers">100+ Hampers (Custom Sourcing)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                    Event Notes & Customization Requirements
                  </label>
                  <textarea
                    rows="3"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Mention delivery deadlines, budget targets, preferred botanical aromas, or branding requirements..."
                    className="w-full p-3 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Bulk Consultation Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
