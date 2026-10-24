import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/demoProducts';

const SelectionContext = createContext(null);

const rawApiUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim();
const API_BASE_URL = rawApiUrl
  ? (rawApiUrl.startsWith('http') ? rawApiUrl : `https://${rawApiUrl}`).replace(/\/$/, '')
  : '';

export const SelectionProvider = ({ children }) => {
  // Master product catalogue with localStorage persistence
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('surreal_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch (e) {
      return initialProducts;
    }
  });

  // Standalone products in cart
  const [standaloneItems, setStandaloneItems] = useState(() => {
    try {
      const saved = localStorage.getItem('surreal_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Curated & custom hampers in cart
  const [customHampers, setCustomHampers] = useState(() => {
    try {
      const saved = localStorage.getItem('surreal_cart_hampers');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Order enquiries (Admin + customer history)
  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('surreal_enquiries');
      if (saved) return JSON.parse(saved);
      // Pre-seed with realistic demo enquiries
      return [
        {
          id: 'ST-2026-9182',
          customerName: 'Ananya Deshmukh',
          email: 'ananya.deshmukh@example.com',
          phone: '+91 98201 44521',
          preferredContact: 'WhatsApp',
          deliveryLocation: 'Bandra West, Mumbai',
          eventDate: '2026-11-05',
          submittedAt: '2026-10-18T14:30:00Z',
          status: 'In Review',
          estimatedTotal: 3448,
          itemsSummary: '1x The Royal Bridal Radiance Hamper, 1x Damask Rose Mist',
          customNotes: 'Please ensure gift tag has bride’s name written in gold ink.',
          details: {
            hampers: [{ name: 'The Royal Bridal Radiance Hamper', price: 2849, packaging: 'Artisan Pine Wood Keepsake Chest' }],
            standalone: [{ name: 'Damask Rose & Hibiscus Botanical Mist', price: 499, quantity: 1 }]
          }
        },
        {
          id: 'ST-2026-8941',
          customerName: 'Vikramaditya Singhania',
          email: 'vikram.s@singhaniagroup.in',
          phone: '+91 99300 87112',
          preferredContact: 'Email',
          deliveryLocation: 'Cyber City, Gurugram',
          eventDate: '2026-10-28',
          submittedAt: '2026-10-19T09:15:00Z',
          status: 'Responded',
          estimatedTotal: 7745,
          itemsSummary: '5x Midnight Lavender Serenity Wellness Box (Corporate Diwali)',
          customNotes: 'Corporate festive gifting batch. Requested invoice with GSTIN.',
          details: {
            hampers: [{ name: 'Midnight Lavender Serenity Wellness Box', price: 1549, packaging: 'Eco Kraft Box', count: 5 }]
          }
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // Active coupon code
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Backend connectivity state
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    checked: false,
    message: 'Connecting to backend...'
  });

  // Check backend health & sync enquiries and products on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((res) => {
        if (!res.ok) throw new Error('Health check error');
        return res.json();
      })
      .then((health) => {
        setBackendStatus({
          connected: true,
          checked: true,
          profile: health.activeProfile || 'default',
          message: 'Spring Boot Backend Connected (Port 8081)'
        });

        // Sync enquiries from PostgreSQL backend
        fetch(`${API_BASE_URL}/api/enquiries`)
          .then((res) => (res && res.ok ? res.json() : null))
          .then((dbEnquiries) => {
            if (Array.isArray(dbEnquiries) && dbEnquiries.length > 0) {
              setEnquiries((prev) => {
                const map = new Map();
                dbEnquiries.forEach((item) => map.set(item.id, item));
                prev.forEach((item) => {
                  if (!map.has(item.id)) map.set(item.id, item);
                });
                return Array.from(map.values());
              });
            }
          })
          .catch(() => {});

        // Sync and enrich product catalogue from PostgreSQL backend
        fetch(`${API_BASE_URL}/api/products`)
          .then((res) => (res && res.ok ? res.json() : null))
          .then((dbProducts) => {
            if (Array.isArray(dbProducts) && dbProducts.length > 0) {
              setProducts((prev) => {
                const map = new Map();
                prev.forEach((p) => map.set(p.id, p));

                dbProducts.forEach((p) => {
                  const mapped = {
                    id: p.id,
                    name: p.name,
                    tagline: p.description ? p.description.slice(0, 110) + '...' : '',
                    category: p.category || 'Handmade Skincare',
                    subCategory: p.category || 'Skincare',
                    price: Number(p.retailPrice) || 450,
                    stock: p.availableStock ?? 25,
                    available: (p.availableStock ?? 0) > 0,
                    rating: 4.9,
                    reviewCount: 48,
                    badge: p.ingredientVerificationStatus === 'VERIFIED' ? 'Verified Formulation' : 'Artisan Crafted',
                    imageUrl: p.imageUrl || '/body-butter.jpg',
                    description: p.description || '',
                    ingredients: p.ingredients || [],
                    allergens: Array.isArray(p.declaredAllergens) && p.declaredAllergens.length > 0
                      ? `Declared allergens: ${p.declaredAllergens.join(', ')}`
                      : 'None declared',
                    suitability: Array.isArray(p.skinTypeSuitability)
                      ? p.skinTypeSuitability.join(', ') + ' skin'
                      : 'All skin types',
                    ingredientVerificationStatus: p.ingredientVerificationStatus,
                    lastVerificationDate: p.lastVerificationDate,
                    crossContaminationWarning: p.crossContaminationWarning,
                    packagingInfo: p.packagingInfo,
                    isSkincare: true
                  };

                  if (!map.has(p.id)) {
                    map.set(p.id, mapped);
                  } else {
                    const existing = map.get(p.id);
                    map.set(p.id, {
                      ...existing,
                      stock: mapped.stock,
                      available: mapped.available,
                      ingredientVerificationStatus: mapped.ingredientVerificationStatus,
                      lastVerificationDate: mapped.lastVerificationDate,
                      crossContaminationWarning: mapped.crossContaminationWarning
                    });
                  }
                });

                return Array.from(map.values());
              });
            }
          })
          .catch(() => {});
      })
      .catch(() => {
        setBackendStatus({
          connected: false,
          checked: true,
          message: 'Backend Offline (Using Local Fallback)'
        });
      });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('surreal_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('surreal_cart_items', JSON.stringify(standaloneItems));
  }, [standaloneItems]);

  useEffect(() => {
    localStorage.setItem('surreal_cart_hampers', JSON.stringify(customHampers));
  }, [customHampers]);

  useEffect(() => {
    localStorage.setItem('surreal_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  // Product actions (for Admin & shop)
  const toggleProductAvailability = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, available: !p.available } : p))
    );
    showToast('Product availability updated.');
  };

  const updateProductPriceOrStock = (productId, newPrice, newStock) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              price: newPrice !== undefined ? Number(newPrice) : p.price,
              stock: newStock !== undefined ? Number(newStock) : p.stock
            }
          : p
      )
    );
    showToast('Product details updated successfully.');
  };

  const addNewProduct = (productData) => {
    const newProd = {
      ...productData,
      id: `prod-custom-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      available: true
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Added "${newProd.name}" to product catalogue.`);
  };

  // Standalone Cart Actions
  const addStandaloneItem = (product, quantity = 1) => {
    if (!product.available) {
      showToast('Sorry, this product is currently out of stock.', 'error');
      return;
    }

    setStandaloneItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    showToast(`Added ${quantity}x "${product.name}" to your selections!`);
  };

  const updateStandaloneQuantity = (productId, delta) => {
    setStandaloneItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeStandaloneItem = (productId) => {
    setStandaloneItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from selections.', 'info');
  };

  // Custom Hamper Cart Actions
  const addHamperToCart = (hamper) => {
    const hamperItem = {
      id: hamper.id || `hamper-${Date.now()}`,
      name: hamper.name,
      occasion: hamper.occasion,
      style: hamper.style,
      packaging: hamper.packaging,
      products: hamper.products, // array of { id, name, price, quantity, imageUrl }
      cardMessage: hamper.cardMessage || '',
      recipientName: hamper.recipientName || '',
      senderName: hamper.senderName || '',
      cardTemplate: hamper.cardTemplate || 'gold-botanical',
      totalPrice: hamper.totalPrice
    };

    setCustomHampers((prev) => [...prev, hamperItem]);
    showToast(`Hamper "${hamper.name}" added to your selections! 🎁`);
  };

  const removeHamperFromCart = (hamperId) => {
    setCustomHampers((prev) => prev.filter((h) => h.id !== hamperId));
    showToast('Hamper removed from selections.', 'info');
  };

  const clearAllSelections = () => {
    setStandaloneItems([]);
    setCustomHampers([]);
    setCouponCode('');
    setDiscountPercent(0);
    showToast('Selections cleared.');
  };

  // Apply Coupon
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SURREAL10') {
      setCouponCode('SURREAL10');
      setDiscountPercent(10);
      showToast('10% Welcome Discount applied!', 'success');
      return true;
    } else if (clean === 'FESTIVE15') {
      setCouponCode('FESTIVE15');
      setDiscountPercent(15);
      showToast('15% Festive Celebration Discount applied!', 'success');
      return true;
    } else {
      showToast('Invalid or expired coupon code.', 'error');
      return false;
    }
  };

  // Submit Order Enquiry
  const submitOrderEnquiry = (enquiryForm) => {
    const refId = `ST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEnquiry = {
      id: refId,
      customerName: enquiryForm.customerName,
      email: enquiryForm.email,
      phone: enquiryForm.phone || 'Not provided',
      preferredContact: enquiryForm.preferredContact || 'WhatsApp',
      deliveryLocation: enquiryForm.deliveryLocation,
      eventDate: enquiryForm.eventDate || 'Flexible',
      customNotes: enquiryForm.customNotes || 'None',
      submittedAt: new Date().toISOString(),
      status: 'New',
      estimatedTotal: grandTotal,
      itemsSummary: `${customHampers.length} Hamper(s), ${standaloneItems.length} Standalone Item(s)`,
      details: {
        hampers: customHampers,
        standalone: standaloneItems
      }
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);

    // Send to backend (with graceful local fallback)
    fetch(`${API_BASE_URL}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEnquiry)
    }).catch(() => {
      // Offline/mock mode handles it gracefully in localStorage
    });

    // Clear cart upon enquiry submission
    setStandaloneItems([]);
    setCustomHampers([]);

    return refId;
  };

  // Admin Enquiry status updates
  const updateEnquiryStatus = (enquiryId, status, note = '') => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status, internalNote: note || e.internalNote } : e))
    );
    showToast(`Enquiry ${enquiryId} marked as ${status}.`);

    fetch(`${API_BASE_URL}/api/enquiries/${enquiryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, internalNote: note })
    }).catch((err) => {
      console.warn('Could not sync enquiry status with backend:', err);
    });
  };

  // Calculations
  const standaloneSubtotal = standaloneItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const hampersSubtotal = customHampers.reduce(
    (sum, hamper) => sum + hamper.totalPrice,
    0
  );

  const subtotal = standaloneSubtotal + hampersSubtotal;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const totalItemCount =
    standaloneItems.reduce((sum, item) => sum + item.quantity, 0) +
    customHampers.length;

  return (
    <SelectionContext.Provider
      value={{
        products,
        setProducts,
        toggleProductAvailability,
        updateProductPriceOrStock,
        addNewProduct,
        standaloneItems,
        addStandaloneItem,
        updateStandaloneQuantity,
        removeStandaloneItem,
        customHampers,
        addHamperToCart,
        removeHamperFromCart,
        clearAllSelections,
        enquiries,
        submitOrderEnquiry,
        updateEnquiryStatus,
        couponCode,
        discountPercent,
        applyCoupon,
        totals: {
          standaloneSubtotal,
          hampersSubtotal,
          subtotal,
          discountAmount,
          grandTotal,
          totalItemCount
        },
        toastMessage,
        showToast,
        backendStatus
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelections = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelections must be used within a SelectionProvider');
  }
  return context;
};
