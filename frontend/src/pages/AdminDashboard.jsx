import React, { useState } from 'react';
import { useSelections } from '../context/SelectionContext';
import {
  Package,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Eye,
  Sliders,
  ShieldCheck,
  TrendingUp,
  Tag,
  DollarSign,
  UserCheck,
  Check,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    products,
    toggleProductAvailability,
    updateProductPriceOrStock,
    addNewProduct,
    enquiries,
    updateEnquiryStatus,
    backendStatus
  } = useSelections();

  // Active view tab: 'enquiries' or 'inventory'
  const [activeTab, setActiveTab] = useState('enquiries');
  const [enquiryFilter, setEnquiryFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Inventory search
  const [inventorySearch, setInventorySearch] = useState('');

  // Add Product Modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Handmade Skincare',
    subCategory: 'Face Oils & Serums',
    price: 649,
    stock: 20,
    tagline: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-0a6a9ef1c9b4?auto=format&fit=crop&w=800&q=80',
    ingredients: 'Pure Cold-Pressed Jojoba, Vitamin E, Damask Rose Extract',
    fragrance: 'Rose & Sandalwood',
    texture: 'Silky Lightweight Oil',
    isSkincare: true
  });

  // Calculate metrics
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.available).length;
  const totalEnquiries = enquiries.length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const estimatedPipeline = enquiries.reduce((sum, e) => sum + (e.estimatedTotal || 0), 0);

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter((e) => {
    if (enquiryFilter === 'All') return true;
    return e.status === enquiryFilter;
  });

  // Filtered inventory
  const filteredInventory = products.filter((p) =>
    p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) return;

    addNewProduct({
      ...newProductForm,
      price: Number(newProductForm.price),
      stock: Number(newProductForm.stock),
      ingredients: newProductForm.ingredients.split(',').map((s) => s.trim())
    });

    setShowAddProductModal(false);
    setNewProductForm({
      name: '',
      category: 'Handmade Skincare',
      subCategory: 'Face Oils & Serums',
      price: 649,
      stock: 20,
      tagline: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-0a6a9ef1c9b4?auto=format&fit=crop&w=800&q=80',
      ingredients: 'Pure Cold-Pressed Jojoba, Vitamin E',
      fragrance: 'Rose & Sandalwood',
      texture: 'Silky Lightweight Oil',
      isSkincare: true
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Header & Demo Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8DEC9] pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#8C6D37] bg-[#FAF3E1] px-3 py-0.5 rounded-full border border-[#E8D6B7]">
              Internal Demonstration Desk
            </span>
            <span className={`text-[11px] px-3 py-0.5 rounded-full border flex items-center gap-1.5 font-medium ${
              backendStatus?.connected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${backendStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              {backendStatus?.connected ? 'Backend: Spring Boot 3 & PostgreSQL Connected' : 'Backend: Local Fallback'}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3D2C1F] mt-2">
            Business Administration
          </h1>
          <p className="text-xs text-[#7A6A5A] mt-1">
            Real-time management for custom gift hamper orders, product availability toggles, and enquiry reviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddProductModal(true)}
            className="px-5 py-2.5 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border border-[#E8DEC9] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#8C7A6A] uppercase tracking-wider block">
            Total Catalogue Items
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-[#4A3728]">
              {totalProducts}
            </span>
            <span className="text-xs text-[#556B52] font-semibold">
              {availableProducts} In Stock
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8DEC9] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#8C7A6A] uppercase tracking-wider block">
            Total Enquiries
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-[#4A3728]">
              {totalEnquiries}
            </span>
            {newEnquiriesCount > 0 ? (
              <span className="text-xs text-[#C86D51] font-semibold bg-[#FDF0EC] px-2 py-0.5 rounded-full">
                {newEnquiriesCount} New
              </span>
            ) : (
              <span className="text-xs text-[#556B52]">Up to date</span>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8DEC9] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#8C7A6A] uppercase tracking-wider block">
            Pipeline Order Value
          </span>
          <span className="font-serif text-3xl font-bold text-[#556B52] block">
            ₹{estimatedPipeline}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8DEC9] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#8C7A6A] uppercase tracking-wider block">
            Average Order Estimate
          </span>
          <span className="font-serif text-3xl font-bold text-[#4A3728] block">
            ₹{totalEnquiries > 0 ? Math.round(estimatedPipeline / totalEnquiries) : 0}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DEC9] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('enquiries')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
            activeTab === 'enquiries'
              ? 'bg-[#556B52] text-white shadow-sm'
              : 'text-[#4A3728] hover:bg-[#FAF7F2]'
          }`}
        >
          Customer Enquiries ({enquiries.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
            activeTab === 'inventory'
              ? 'bg-[#556B52] text-white shadow-sm'
              : 'text-[#4A3728] hover:bg-[#FAF7F2]'
          }`}
        >
          Product Inventory & Stock ({products.length})
        </button>
      </div>

      {/* TAB 1: CUSTOMER ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          {/* Status filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'New', 'In Review', 'Responded', 'Closed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setEnquiryFilter(st)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  enquiryFilter === st
                    ? 'bg-[#4A3728] text-white'
                    : 'bg-white border border-[#E5DAC9] text-[#7A6A5A] hover:bg-[#FAF7F2]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Enquiries Table */}
          <div className="bg-white rounded-3xl border border-[#E5DAC9] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#8C7A6A] uppercase text-[10px] tracking-wider border-b border-[#E8DEC9]">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Reference</th>
                    <th className="py-3.5 px-4 font-semibold">Customer</th>
                    <th className="py-3.5 px-4 font-semibold">Channel</th>
                    <th className="py-3.5 px-4 font-semibold">Items Summary</th>
                    <th className="py-3.5 px-4 font-semibold">Total</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1]">
                  {filteredEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#4A3728]">
                        {enq.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#3D2C1F] block">{enq.customerName}</span>
                        <span className="text-[10px] text-[#8C7A6A]">{enq.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF4EB] border border-[#EFE5D5] text-[#5C4A3A]">
                          {enq.preferredContact || 'WhatsApp'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-[240px] truncate text-[#554637]">
                        {enq.itemsSummary}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-[#556B52]">
                        ₹{enq.estimatedTotal}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            enq.status === 'New'
                              ? 'bg-[#FDF0EC] text-[#9E3E28]'
                              : enq.status === 'In Review'
                              ? 'bg-[#FAF3E1] text-[#8C6D37]'
                              : enq.status === 'Responded'
                              ? 'bg-[#E9EFE9] text-[#345E36]'
                              : 'bg-[#F2F2F2] text-[#6E6E6E]'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enq)}
                          className="px-3 py-1 rounded-xl bg-[#FAF6EE] hover:bg-[#F2EADB] text-[#4A3728] font-medium text-xs border border-[#E5DAC9]"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & STOCK MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Search box */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#8C7A6A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search catalogue items to adjust stock or prices..."
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#D5C7B4] bg-white text-xs text-[#3D2C1F]"
            />
          </div>

          <div className="bg-white rounded-3xl border border-[#E5DAC9] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#8C7A6A] uppercase text-[10px] tracking-wider border-b border-[#E8DEC9]">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Product</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">Artisan Price</th>
                    <th className="py-3.5 px-4 font-semibold">Stock</th>
                    <th className="py-3.5 px-4 font-semibold">Availability Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1]">
                  {filteredInventory.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <span className="font-semibold text-[#3D2C1F] block">{prod.name}</span>
                            <span className="text-[10px] text-[#8C7A6A]">{prod.volume || '1 Unit'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#554637]">
                        {prod.category}
                      </td>
                      <td className="py-3 px-4 font-serif font-bold text-[#4A3728]">
                        ₹{prod.price}
                      </td>
                      <td className="py-3 px-4 text-[#554637]">
                        {prod.stock || 25} units
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => toggleProductAvailability(prod.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            prod.available
                              ? 'bg-[#E9EFE9] text-[#2F5233] hover:bg-[#D7E3D7]'
                              : 'bg-[#FDF0EC] text-[#9E3E28] hover:bg-[#FCE2DB]'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              prod.available ? 'bg-[#556B52]' : 'bg-[#C86D51]'
                            }`}
                          />
                          <span>{prod.available ? 'Available' : 'Marked Unavailable'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ENQUIRY DETAIL MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E5DAC8] shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC9]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#556B52] tracking-wider block">
                  Enquiry Record
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#3D2C1F]">
                  Reference: {selectedEnquiry.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#8C7A6A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#8C7A6A] block text-[10px] uppercase font-semibold">Customer</span>
                <span className="font-medium text-[#4A3728]">{selectedEnquiry.customerName}</span>
              </div>
              <div>
                <span className="text-[#8C7A6A] block text-[10px] uppercase font-semibold">Contact Email</span>
                <span className="font-medium text-[#4A3728]">{selectedEnquiry.email}</span>
              </div>
              <div>
                <span className="text-[#8C7A6A] block text-[10px] uppercase font-semibold">Phone</span>
                <span className="font-medium text-[#4A3728]">{selectedEnquiry.phone}</span>
              </div>
              <div>
                <span className="text-[#8C7A6A] block text-[10px] uppercase font-semibold">Channel</span>
                <span className="font-medium text-[#4A3728]">{selectedEnquiry.preferredContact}</span>
              </div>
              <div>
                <span className="text-[#8C7A6A] block text-[10px] uppercase font-semibold">City</span>
                <span className="font-medium text-[#4A3728]">{selectedEnquiry.deliveryLocation}</span>
              </div>
              <div>
                <span className="text-[#8C7A6A] block text-[10px] uppercase font-semibold">Target Date</span>
                <span className="font-medium text-[#4A3728]">{selectedEnquiry.eventDate || 'Flexible'}</span>
              </div>
            </div>

            {/* Custom Notes */}
            {selectedEnquiry.customNotes && (
              <div className="p-3.5 rounded-xl bg-[#FAF4EB] border border-[#EFE4D4] text-xs">
                <span className="font-semibold text-[#4A3728] block mb-1">Customer Special Notes:</span>
                <p className="text-[#6B5A4B]">{selectedEnquiry.customNotes}</p>
              </div>
            )}

            {/* Status Selector */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                Update Enquiry Status
              </label>
              <div className="flex gap-2">
                {['New', 'In Review', 'Responded', 'Closed'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      updateEnquiryStatus(selectedEnquiry.id, status);
                      setSelectedEnquiry({ ...selectedEnquiry, status });
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedEnquiry.status === status
                        ? 'bg-[#556B52] text-white border-[#556B52]'
                        : 'bg-[#FAF7F2] text-[#4A3728] border-[#E5DAC9] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8DEC9] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-6 py-2.5 rounded-full bg-[#4A3728] text-white text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleCreateProduct}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#E5DAC8] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC9]">
              <h3 className="font-serif text-xl font-bold text-[#3D2C1F]">
                Add New Artisan Product
              </h3>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="p-1 rounded-full text-[#8C7A6A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                value={newProductForm.name}
                onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                placeholder="e.g. Blue Lotus Night Nectar"
                className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                  Category
                </label>
                <select
                  value={newProductForm.category}
                  onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs"
                >
                  <option value="Handmade Skincare">Handmade Skincare</option>
                  <option value="Bath and Body">Bath and Body</option>
                  <option value="Personalised Gifts">Personalised Gifts</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Gift Packaging">Gift Packaging</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                  Price (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  value={newProductForm.price}
                  onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                Verified Ingredients (Comma Separated)
              </label>
              <input
                type="text"
                value={newProductForm.ingredients}
                onChange={(e) => setNewProductForm({ ...newProductForm, ingredients: e.target.value })}
                placeholder="e.g. Saffron Oil, Almond Extract, Tocopherol"
                className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3728] uppercase mb-1">
                Short Description
              </label>
              <textarea
                rows="2"
                value={newProductForm.description}
                onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                placeholder="Crafted in micro-batches with organic botanicals..."
                className="w-full p-2.5 rounded-xl border border-[#D5C7B4] bg-[#FAF7F2] text-xs"
              />
            </div>

            <div className="pt-3 border-t border-[#E8DEC9] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="px-5 py-2.5 rounded-full border border-[#D5C7B4] text-xs font-semibold text-[#4A3728]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#556B52] hover:bg-[#3E523B] text-white text-xs font-semibold"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
