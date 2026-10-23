import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelections } from '../context/SelectionContext';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Trash2,
  Gift,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
  PenTool,
  Clock,
  Phone,
  Mail,
  MapPin,
  Tag,
  AlertCircle
} from 'lucide-react';

export default function MySelections() {
  const navigate = useNavigate();
  const {
    standaloneItems,
    customHampers,
    updateStandaloneQuantity,
    removeStandaloneItem,
    removeHamperFromCart,
    clearAllSelections,
    totals,
    couponCode,
    discountPercent,
    applyCoupon,
    submitOrderEnquiry
  } = useSelections();

  // Coupon input
  const [inputCoupon, setInputCoupon] = useState('');

  // Enquiry Form state
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    preferredContact: 'WhatsApp',
    deliveryLocation: '',
    eventDate: '',
    customNotes: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState(null);

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.customerName.trim()) {
      errors.customerName = 'Please enter your full name';
    }
    if (!formData.email.trim()) {
      errors.email = 'Please provide a valid email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.deliveryLocation.trim()) {
      errors.deliveryLocation = 'Please provide your delivery city or location';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitEnquiry = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Save submitted details snapshot for confirmation screen
    const submittedSnapshot = {
      ...formData,
      itemsSummary: `${customHampers.length} Custom Hamper(s), ${standaloneItems.length} Standalone Item(s)`,
      estimatedTotal: totals.grandTotal,
      hampers: [...customHampers],
      standalone: [...standaloneItems]
    };

    setTimeout(() => {
      const refId = submitOrderEnquiry(formData);
      submittedSnapshot.id = refId;
      setSubmittedEnquiry(submittedSnapshot);
      setIsSubmitting(false);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }
    }, 600);
  };

  // SUCCESS CONFIRMATION SCREEN
  if (submittedEnquiry) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5DAC8] shadow-2xl space-y-8 text-center sm:text-left">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-[#EFE7DC] pb-8">
            <div className="w-16 h-16 rounded-3xl bg-[#556B52] text-white flex items-center justify-center shrink-0 shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EAE2D5] text-[11px] font-bold text-[#556B52] uppercase tracking-wider">
                <span>Custom Order Enquiry Submitted</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#342417]">
                Thank you, {submittedEnquiry.customerName}!
              </h1>
              <p className="text-xs text-[#7A6A5A]">
                Your enquiry reference is{' '}
                <strong className="text-[#4A3728] font-mono text-sm">{submittedEnquiry.id}</strong>
              </p>
            </div>
          </div>

          {/* Next Steps Artisan SLA notice */}
          <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#E7DCB8] flex items-start gap-3.5 text-xs text-[#6B5A4B] leading-relaxed">
            <Clock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#4A3728] block mb-0.5">
                What happens next?
              </span>
              Our master artisan studio will review your selected items, check batch cure dates, and contact you via{' '}
              <strong className="text-[#556B52]">{submittedEnquiry.preferredContact}</strong> within 2–4 hours with dispatch availability, custom calligraphy proof, and secure invoice details.
            </div>
          </div>

          {/* Itemized Order Snapshot */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold text-[#3D2C1F]">
              Enquiry Summary
            </h3>

            {/* Custom Hampers Breakdown */}
            {submittedEnquiry.hampers.length > 0 && (
              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-[#8C7A6A] uppercase tracking-wider block">
                  Curated Gift Hampers
                </span>
                {submittedEnquiry.hampers.map((hamper, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-[#4A3728]">
                      <span>{hamper.name}</span>
                      <span className="font-serif text-sm">₹{hamper.totalPrice}</span>
                    </div>
                    <div className="text-[11px] text-[#7A6A5A]">
                      Packaging: {hamper.packaging?.name}
                    </div>
                    {hamper.cardMessage && (
                      <div className="p-2.5 rounded-xl bg-white border border-[#EAE1D3] text-[11px] text-[#554637] italic">
                        "{hamper.cardMessage}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Standalone Products Breakdown */}
            {submittedEnquiry.standalone.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-[#8C7A6A] uppercase tracking-wider block">
                  Standalone Formulations
                </span>
                {submittedEnquiry.standalone.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] text-xs">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span className="font-serif font-bold text-[#4A3728]">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Final Total */}
            <div className="pt-3 border-t border-[#EFE7DC] flex items-baseline justify-between">
              <span className="font-medium text-sm text-[#4A3728]">Estimated Value</span>
              <span className="font-serif text-2xl font-bold text-[#556B52]">
                ₹{submittedEnquiry.estimatedTotal}
              </span>
            </div>
          </div>

          {/* Delivery & Customer details */}
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#8C7A6A] block text-[10px] uppercase font-semibold">Contact Email</span>
              <span className="font-medium text-[#4A3728]">{submittedEnquiry.email}</span>
            </div>
            <div>
              <span className="text-[#8C7A6A] block text-[10px] uppercase font-semibold">Phone / WhatsApp</span>
              <span className="font-medium text-[#4A3728]">{submittedEnquiry.phone}</span>
            </div>
            <div>
              <span className="text-[#8C7A6A] block text-[10px] uppercase font-semibold">Delivery City</span>
              <span className="font-medium text-[#4A3728]">{submittedEnquiry.deliveryLocation}</span>
            </div>
            <div>
              <span className="text-[#8C7A6A] block text-[10px] uppercase font-semibold">Target Event Date</span>
              <span className="font-medium text-[#4A3728]">{submittedEnquiry.eventDate || 'Flexible'}</span>
            </div>
          </div>

          {/* Back actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/shop"
              className="px-6 py-3 rounded-full border border-[#D5C7B4] text-xs font-semibold text-[#4A3728] hover:bg-[#FAF7F2]"
            >
              Continue Exploring Products
            </Link>
            <Link
              to="/admin"
              className="text-xs font-semibold text-[#556B52] hover:underline"
            >
              View in Admin Demonstration Desk →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY STATE IF NO ITEMS SELECTED
  if (standaloneItems.length === 0 && customHampers.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FAF3EA] text-[#C5A059] flex items-center justify-center shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-semibold text-[#3D2C1F]">
          Your Selections Tray is Empty
        </h2>
        <p className="text-sm text-[#7A6A5A] max-w-md mx-auto">
          You haven't added any products or designed a gift hamper yet. Build a custom hamper or explore our verified botanical skincare catalogue.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            to="/builder"
            className="px-7 py-3.5 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white text-xs font-semibold shadow-md"
          >
            Create a Gift Hamper
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3.5 rounded-full border border-[#D5C7B4] text-[#4A3728] text-xs font-semibold hover:bg-white"
          >
            Explore Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8DEC9] pb-6 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#556B52]">
            Digital Ordering Platform
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3D2C1F] mt-1">
            Review Selections & Order Enquiry
          </h1>
          <p className="text-xs text-[#7A6A5A] mt-1">
            Review your custom hampers, individual bottles, packaging, and submit an artisan enquiry.
          </p>
        </div>

        <button
          type="button"
          onClick={clearAllSelections}
          className="text-xs text-[#C86D51] hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Selections</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Items List */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Custom Gift Hampers Section */}
          {customHampers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#556B52]" />
                <h2 className="font-serif text-xl font-bold text-[#3D2C1F]">
                  Curated Gift Hampers ({customHampers.length})
                </h2>
              </div>

              <div className="space-y-4">
                {customHampers.map((hamper) => (
                  <div
                    key={hamper.id}
                    className="p-6 rounded-3xl bg-white border border-[#E5DAC9] shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#556B52] tracking-wider block">
                          {hamper.occasion} • {hamper.style}
                        </span>
                        <h3 className="font-serif text-xl font-bold text-[#3D2C1F]">
                          {hamper.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="font-serif text-2xl font-bold text-[#4A3728]">
                          ₹{hamper.totalPrice}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeHamperFromCart(hamper.id)}
                          className="text-[11px] text-[#C86D51] block hover:underline mt-1"
                        >
                          Remove Hamper
                        </button>
                      </div>
                    </div>

                    {/* Included items */}
                    <div className="pt-2 border-t border-[#F2ECE1]">
                      <span className="text-[10px] font-semibold text-[#8C7A6A] uppercase tracking-wider block mb-2">
                        Included Products:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {hamper.products.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF7F2] text-[#4A3728]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#556B52]"></span>
                            <span className="truncate">
                              {item.quantity}x {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Packaging */}
                    {hamper.packaging && (
                      <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#FAF4EB] border border-[#EFE4D4]">
                        <span className="font-medium text-[#4A3728]">
                          Packaging: {hamper.packaging.name}
                        </span>
                        <span className="font-serif font-bold text-[#556B52]">
                          ₹{hamper.packaging.price}
                        </span>
                      </div>
                    )}

                    {/* Calligraphed Card Preview */}
                    {hamper.cardMessage && (
                      <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#EAE1D3] space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-[#8C7A6A]">
                          <span className="font-semibold text-[#4A3728] flex items-center gap-1">
                            <PenTool className="w-3.5 h-3.5 text-[#D4AF37]" />
                            Calligraphed Note Preview
                          </span>
                          <span>Gold Wax Seal</span>
                        </div>
                        <p className="text-xs text-[#554637] italic">
                          "{hamper.cardMessage}"
                        </p>
                        {(hamper.recipientName || hamper.senderName) && (
                          <div className="text-[10px] text-[#8C7A6A] pt-1 flex justify-between">
                            <span>To: {hamper.recipientName || 'Recipient'}</span>
                            <span>From: {hamper.senderName || 'Sender'}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Standalone Products Section */}
          {standaloneItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#556B52]" />
                <h2 className="font-serif text-xl font-bold text-[#3D2C1F]">
                  Standalone Products ({standaloneItems.length})
                </h2>
              </div>

              <div className="space-y-3">
                {standaloneItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl bg-white border border-[#E5DAC9] shadow-sm flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <h4 className="font-serif font-semibold text-sm text-[#3D2C1F]">
                          {product.name}
                        </h4>
                        <span className="text-xs font-serif font-bold text-[#556B52]">
                          ₹{product.price} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Qty controller */}
                      <div className="flex items-center bg-[#FAF7F2] rounded-xl border border-[#DDD1C0] p-0.5">
                        <button
                          type="button"
                          onClick={() => updateStandaloneQuantity(product.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#4A3728]"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-[#4A3728]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateStandaloneQuantity(product.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#4A3728]"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <span className="font-serif font-bold text-base text-[#4A3728] block">
                          ₹{product.price * quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeStandaloneItem(product.id)}
                          className="text-[10px] text-[#C86D51] hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupon Code Section */}
          <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#E8DEC9] space-y-2">
            <span className="text-xs font-semibold text-[#4A3728] uppercase tracking-wider block">
              Have a Celebration Discount Code?
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter SURREAL10 or FESTIVE15"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-[#D5C7B4] bg-white text-xs uppercase"
              />
              <button
                type="button"
                onClick={() => applyCoupon(inputCoupon)}
                className="px-5 py-2.5 rounded-xl bg-[#4A3728] text-white text-xs font-semibold hover:bg-[#342417]"
              >
                Apply
              </button>
            </div>
            {discountPercent > 0 && (
              <span className="text-xs text-[#556B52] font-semibold flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Coupon '{couponCode}' applied: {discountPercent}% Off</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Price Summary & Enquiry Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order Value Summary */}
          <div className="bg-[#FAF6EE] p-6 rounded-3xl border border-[#E5DAC8] shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#3D2C1F]">
              Estimated Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-[#554637] border-y border-[#E8DEC9] py-3.5">
              <div className="flex justify-between">
                <span>Standalone Products</span>
                <span className="font-serif font-semibold">₹{totals.standaloneSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Curated Hampers & Trunks</span>
                <span className="font-serif font-semibold">₹{totals.hampersSubtotal}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-[#556B52] font-semibold">
                  <span>Celebration Discount ({discountPercent}%)</span>
                  <span className="font-serif">-₹{totals.discountAmount}</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#7A6A5A] block">Estimated Total</span>
                <span className="font-serif text-3xl font-bold text-[#4A3728]">
                  ₹{totals.grandTotal}
                </span>
              </div>
              <span className="text-xs text-[#556B52] font-semibold bg-[#E9EFE9] px-3 py-1 rounded-full">
                Custom Invoice Review
              </span>
            </div>
          </div>

          {/* Custom Order Enquiry Form */}
          <form
            onSubmit={handleSubmitEnquiry}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DAC9] shadow-md space-y-5"
          >
            <div>
              <h3 className="font-serif text-xl font-bold text-[#3D2C1F]">
                Submit Custom-Order Enquiry
              </h3>
              <p className="text-xs text-[#7A6A5A] mt-1">
                Provide your contact details. An official purchase invoice and dispatch confirmation will follow artisan review.
              </p>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                Full Name <span className="text-[#C86D51]">*</span>
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Ananya Deshmukh"
                className={`w-full p-3 rounded-xl border text-xs bg-[#FAF7F2] ${
                  formErrors.customerName ? 'border-[#C86D51]' : 'border-[#D5C7B4]'
                }`}
              />
              {formErrors.customerName && (
                <span className="text-[11px] text-[#C86D51] mt-0.5 block">
                  {formErrors.customerName}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                Email Address <span className="text-[#C86D51]">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. ananya@example.com"
                className={`w-full p-3 rounded-xl border text-xs bg-[#FAF7F2] ${
                  formErrors.email ? 'border-[#C86D51]' : 'border-[#D5C7B4]'
                }`}
              />
              {formErrors.email && (
                <span className="text-[11px] text-[#C86D51] mt-0.5 block">
                  {formErrors.email}
                </span>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                Phone / WhatsApp (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98201 44521"
                className="w-full p-3 rounded-xl border border-[#D5C7B4] text-xs bg-[#FAF7F2]"
              />
            </div>

            {/* Preferred contact channel & event date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                  Preferred Contact
                </label>
                <select
                  value={formData.preferredContact}
                  onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Phone Call">Phone Call</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                  Target Event Date
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs"
                />
              </div>
            </div>

            {/* Delivery city */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                Delivery City & Pin Code <span className="text-[#C86D51]">*</span>
              </label>
              <input
                type="text"
                value={formData.deliveryLocation}
                onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                placeholder="e.g. Bandra West, Mumbai 400050"
                className={`w-full p-3 rounded-xl border text-xs bg-[#FAF7F2] ${
                  formErrors.deliveryLocation ? 'border-[#C86D51]' : 'border-[#D5C7B4]'
                }`}
              />
              {formErrors.deliveryLocation && (
                <span className="text-[11px] text-[#C86D51] mt-0.5 block">
                  {formErrors.deliveryLocation}
                </span>
              )}
            </div>

            {/* Additional requirements */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                Special Instructions or Custom Engraving Notes
              </label>
              <textarea
                rows="2"
                value={formData.customNotes}
                onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                placeholder="Mention specific names to engrave on candle bamboo lids, allergen sensitivities, etc."
                className="w-full p-3 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-[#556B52] hover:bg-[#3E523B] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#556B52]/20 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registering Custom Enquiry...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Custom Enquiry (₹{totals.grandTotal})</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-[#8C7A6A] leading-relaxed">
              No immediate payment required. We will confirm dispatch availability and courier timeline prior to payment request.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
