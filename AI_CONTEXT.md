# 🌿 Surreal Treasures — AI Context & Architecture Blueprint

> **CRITICAL INSTRUCTION FOR ALL AI ASSISTANTS & DEVELOPERS:**  
> This file is the single source of truth for understanding the **Surreal Treasures** web application.  
> Whenever you modify features, add components, change routes, alter data structures, or update styling, **you MUST update this file accordingly** to keep the project context synchronized.

---

## 1. Executive Summary & Brand Identity

- **Brand Name**: Surreal Treasures
- **Industry / Domain**: Handcrafted Botanical Skincare & Personalized Gifting Platform
- **Location & Origin**: Artisan Workshop, Lane 7, Koregaon Park, Pune, Maharashtra, India
- **Core Philosophy**:
  - Small-batch, cold-cured botanical formulations (pure virgin oils, unrefined butters, copper-distilled hydrosols).
  - High-touch bespoke gifting (laser-engraved lids, wax seals, calligraphed deckled cards, luxury keepsake boxes).
  - Zero-medical jargon: strictly cosmetic, sensory, and preference-based skincare discovery with prominent non-medical disclaimers.
  - Digital ordering via formal custom enquiry quotation instead of premature card payments, matching artisan batch-cure realities.

---

## 2. Technology Stack & Environment

| Layer | Technology | Details / Versions |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`react` 19.3.1, `react-dom` 19.3.1) | Function components, React Hooks, StrictMode |
| **Build Tool & Dev Server**| Vite 8 (`vite` 8.3.4, `@vitejs/plugin-react` 6.1.2) | Ultra-fast HMR, ES modules |
| **Routing** | React Router v7 (`react-router-dom` 7.18.4) | `BrowserRouter`, `Routes`, `Route`, `useLocation`, `useSearchParams`, `useNavigate` |
| **Styling Engine** | Tailwind CSS v4 (`@tailwindcss/vite` 4.3.3) | CSS-in-JS/PostCSS-free Vite plugin, `@import "tailwindcss";` |
| **State Management** | React Context API | `SelectionContext` with automatic `localStorage` synchronization |
| **Icons** | Lucide React (`lucide-react` 1.60.0) | Consistent botanical, gifting, and UI iconography |
| **Celebratory FX** | Canvas Confetti (`canvas-confetti` 1.9.4) | Triggered upon order enquiry submission |
| **Motion & Animation** | Framer Motion (`framer-motion` 14.4.0) | Smooth micro-interactions |
| **Linter** | Oxlint (`oxlint` 1.88.0) | Rust-based high speed linter (`npm run lint`) |
| **Backend (Optional API)** | Node.js + Express.js (`server/server.js`) | In-memory + JSON file-backed REST API on port 5000 |
| **Production Database** | PostgreSQL Schema (`server/schema.sql`) | Relational schema with UUIDs, JSONB, indexes |

---

## 3. Directory & File Structure

```
Prototype2/
├── AI_CONTEXT.md                  # <-- THIS FILE (AI & Developer Central Blueprint)
├── README.md                      # Human-facing project overview & quickstart
├── package.json                   # Dependencies, scripts, and project metadata
├── vite.config.js                 # Vite configuration with React & Tailwind v4 plugins
├── index.html                     # HTML root entry with Marcellus & Outfit fonts (plain white theme)
├── public/                        # Static assets (logo.png, logo-light.png, favicon.png, icons.svg)
├── server/
│   ├── server.js                  # Express REST API (Products & Enquiries endpoints)
│   └── schema.sql                 # Production-ready PostgreSQL schema
└── src/
    ├── main.jsx                   # React root render
    ├── App.jsx                    # Root layout with Router, Context Provider, Navbar, Routes, Footer, Toast
    ├── App.css                    # Component-level styling overrides
    ├── index.css                  # Design tokens, custom scrollbar, Marcellus & Outfit typography
    ├── assets/                    # Bundled imagery & vector assets
    ├── context/
    │   └── SelectionContext.jsx   # Master state store (Cart, Hampers, Products v3, Enquiries, Coupons, Toasts)
    ├── data/
    │   └── demoProducts.js        # Core products with user photoshoot imagery, hamper sizes, packaging, occasions, card styles
    ├── services/
    │   ├── recommendationService.js # Rule-based hamper recommendation engine
    │   └── skincareService.js     # Non-medical preference scoring engine
    ├── components/
    │   ├── Navbar.jsx             # Top bar, announcement bar, navigation links, selections counter badge
    │   ├── Footer.jsx             # Brand highlights, site directory, contact details, medical disclaimer
    │   ├── ProductCard.jsx        # Product grid card with stock state, quick-view trigger, add-to-cart
    │   ├── ProductCarousel.jsx    # Interactive product carousel with category filters, scroll snap & arrows
    │   ├── HeroProductCarousel.jsx# Hero showcase carousel with smooth slide transitions, autoplay, arrows, dots, and quick actions
    │   ├── Hamper2DVisualizer.jsx # Live 2D model of hamper box with wood shavings, placed items, and empty slots
    │   ├── CelebrationCard2DVisualizer.jsx # Live 2D deckled card with photo upload preview, calligraphy, wax seal
    │   ├── ProductDetailModal.jsx # Quick-view modal with verified botanical ingredients, usage, allergens
    │   ├── Toast.jsx              # Global notification toast popups (success, info, error)
    │   └── WhatsAppFloatingButton.jsx # Global floating WhatsApp button connecting directly to owner at +91 97260 02115
    ├── pages/
    │   ├── Home.jsx               # Landing page (Hero, Occasion shortcuts, Hampers, Carousel, Reviews)
    │   ├── About.jsx              # Brand heritage & small-batch cold-process story
    │   ├── GiftHamperBuilder.jsx  # Unified Hamper Studio: 1) Interactive 2D Studio, 2) Value Hamper Mode, 3) Occasion Wizard
    │   ├── ProductCatalogue.jsx   # Searchable, filterable 11-product shop with category tabs & stock filters
    │   ├── SkincareDiscovery.jsx  # 4-step non-medical preference questionnaire & percentage-matched results
    │   ├── MySelections.jsx       # Unified cart (Hampers + Standalone), photo preview, formal enquiry form
    │   ├── AdminDashboard.jsx     # Business back-office (Inventory toggles, product creation, backend hooks)
    │   └── Contact.jsx            # Studio information, corporate bulk gifting inquiry form, FAQs
    ├── services/
    │   └── recommendationService.js # Botanical allergen filtering, under-budget tier curation & Occasion Wizard engine
    └── utils/                     # Reserved for shared helper functions
```

---

## 4. Application Routes & Navigation

| Path | Component | Description & Key Responsibilities |
| :--- | :--- | :--- |
| `/` | `Home.jsx` | Landing page. Features Hero banner with dynamic HeroProductCarousel and dual CTAs, pre-curated hampers showcase, bestselling skincare carousel, 4-step "How It Works" builder guide, customer testimonials. |
| `/about` | `About.jsx` | Brand story & artisan heritage page. Details small-batch copper distillation in Pune, ethical sourcing, 6-week cold-process curing, and bespoke keepsake craft. |
| `/builder` | `GiftHamperBuilder.jsx` | Unified Hamper Studio offering 3 seamless creation modes: 1) **Interactive 2D Studio** (2D box visualizer with real item cutouts/wood shavings, size selector 3/5/7, 4 packaging choices, live product steppers, celebration card designer with photo upload & wax seal, and quotation review); 2) **Value Hamper Mode** (budget presets ₹1000–₹4000, botanical allergen screening, guaranteed under-budget 3-tier curation with 1-click add or customize in 2D Studio); 3) **Occasion Wizard** (4-step guidance across occasion, recipient, style & budget, with smart matching and 1-click handoff to 2D Studio). Zero emojis, clean typography, pure white canvas. |
| `/shop` | `ProductCatalogue.jsx` | Full digital product catalog of core artisan products + admin-added products. Supports real-time search, category pill filtering, in-stock toggle, price/rating/popularity sorting, and quick-view modals. |
| `/skincare-discovery` | `SkincareDiscovery.jsx`| Non-medical preference questionnaire. Takes category, texture, aroma, ingredient preferences, avoidances, container format, and max budget. Computes match percentage and displays matching reasons. |
| `/selections` | `MySelections.jsx` | Unified basket for both standalone items and custom hampers with celebration photo thumbnail. Provides quantity adjustments, coupon application (`SURREAL10`, `FESTIVE15`), and a formal Order Enquiry form. |
| `/contact` | `Contact.jsx` | Artisan concierge page. Shows studio address, email, telephone, corporate/bulk gifting inquiry form, and interactive accordion FAQs. |
| `/admin` | `AdminDashboard.jsx` | Demonstration back-office dashboard. Allows adding new products (which immediately reflect across the store and hamper builder), toggling stock, and reviewing enquiries with clear backend database integration hooks. |
| `*` | Fallback | Re-routes unknown paths to `Home.jsx`. |

---

## 5. Global State Architecture (`SelectionContext.jsx`)

The entire client application state is managed centrally via `SelectionContext.jsx` and backed by `localStorage`:

```
┌────────────────────────────────────────────────────────┐
│                   SelectionContext                     │
├────────────────────────────────────────────────────────┤
│ • products: Product[]            (surreal_products)    │
│ • standaloneItems: CartItem[]    (surreal_cart_items)  │
│ • customHampers: HamperItem[]    (surreal_cart_hampers)│
│ • enquiries: Enquiry[]           (surreal_enquiries)   │
│ • couponCode: string                                   │
│ • discountPercent: number                              │
│ • toastMessage: ToastObject | null                     │
│ • totals: ComputedTotalsObject                         │
└────────────────────────────────────────────────────────┘
```

### Key Context Methods & Actions:
1. **Product Management**:
   - `toggleProductAvailability(productId)`: Instantly inverts in-stock status (reflected across Shop, Builder, and Admin).
   - `updateProductPriceOrStock(productId, newPrice, newStock)`: Updates price/stock count.
   - `addNewProduct(productData)`: Prepends a newly created artisan product with a unique `prod-custom-<timestamp>` ID.
2. **Standalone Cart**:
   - `addStandaloneItem(product, quantity = 1)`: Checks `product.available` before adding or incrementing.
   - `updateStandaloneQuantity(productId, delta)`: Adjusts quantity; removes item if quantity reaches 0.
   - `removeStandaloneItem(productId)`: Deletes item from standalone selections.
3. **Custom Hamper Cart**:
   - `addHamperToCart(hamper)`: Adds fully configured hamper (items, luxury packaging, personalized calligraphed card, recipient/sender details).
   - `removeHamperFromCart(hamperId)`: Removes hamper from selections.
   - `clearAllSelections()`: Clears both standalone items and hampers.
4. **Coupons & Financial Calculations**:
   - `applyCoupon(code)`: Supports `SURREAL10` (10% off) and `FESTIVE15` (15% off).
   - `totals`: Automatically computes:
     - `standaloneSubtotal = Σ(item.price * item.quantity)`
     - `hampersSubtotal = Σ(hamper.totalPrice)`
     - `subtotal = standaloneSubtotal + hampersSubtotal`
     - `discountAmount = round((subtotal * discountPercent) / 100)`
     - `grandTotal = max(0, subtotal - discountAmount)`
     - `totalItemCount = Σ(standalone quantities) + hampers.length`
5. **Order Enquiry**:
   - `submitOrderEnquiry(formData)`: Generates reference ID `ST-YYYY-XXXX`, stores enquiry in state/localStorage, attempts POST to Express API if reachable, clears cart, and returns the reference ID.
   - `updateEnquiryStatus(enquiryId, status, note)`: Updates status in Admin (`New`, `In Review`, `Responded`, `Closed`).
6. **Toast System**:
   - `showToast(message, type = 'success' | 'info' | 'error')`: Automatically dismisses after 4,000ms.

---

### A. The 11 Brand Products
The catalog is seeded with the exact 11 handcrafted brand formulations:
1. `prod-wsc` — **Whipped Soap Cleanser** (₹449, Bath and Body)
2. `prod-aws` — **Apricot Walnut Glow Scrub** (₹499, Handmade Skincare)
3. `prod-bb` — **Whipped Shea Body Butter** (₹599, Bath and Body)
4. `prod-avg` — **Pure Soothing Aloe Vera Gel** (₹349, Handmade Skincare)
5. `prod-ccs` — **Coffee Cocoa Body Scrub** (₹549, Bath and Body)
6. `prod-us` — **Traditional Artisan Ubtan Soap** (₹299, Bath and Body)
7. `prod-avl` — **Hydrating Aloe Vera Lotion** (₹429, Bath and Body)
8. `prod-ass` — **Royal Almond Saffron Soap** (₹349, Bath and Body)
9. `prod-lb` — **Nourishing Botanical Lip Balm** (₹249, Handmade Skincare)
10. `prod-kj` — **Organic Ayurvedic Herbal Kajal** (₹399, Accessories)
11. `prod-fs` — **Glow Restorative Botanical Face Serum** (₹799, Handmade Skincare)

Plus 3 curated gift hampers composed of these items:
- `hamper-1` — **The Royal Bridal Radiance Hamper** (₹2,499)
- `hamper-2` — **Botanical Glow & Revive Box** (₹1,399)
- `hamper-3` — **Artisan Coffee & Cocoa Indulgence** (₹1,699)

### B. Hamper Size Model (`HamperSize`)
Controls item capacity ($N$ items):
- `size-petite`: 3 Items max (₹0 extra, compact)
- `size-classic`: 5 Items max (most popular)
- `size-deluxe`: 8 Items max (deluxe keepsake)
- `size-bespoke`: 12 Items max (full grand trunk)

### C. Product Object (`Product`)
```typescript
interface Product {
  id: string;                    // e.g. "prod-wsc", "prod-fs", "pkg-1", "hamper-1"
  name: string;                  // e.g. "Whipped Soap Cleanser"
  tagline: string;               // Short artisanal summary
  category: string;              // "Handmade Skincare" | "Bath and Body" | "Accessories" | "Personalised Gifts" | "Gift Packaging" | "Gift Hampers"
  subCategory: string;           // e.g. "Whipped Soaps", "Face Serums", "Artisan Soaps"
  price: number;                 // Price in INR (₹)
  rating: number;                // e.g. 4.9
  reviewCount: number;           // e.g. 142
  available: boolean;            // In-stock flag
  stock: number;                 // Units in stock
  badge?: string;                // e.g. "Bestseller", "Artisan Crafted", "Pocket Essential"
  imageUrl: string;              // High-resolution Unsplash/artisan image
  description: string;           // Full sensory description
  ingredients: string[];         // Verified botanical ingredient list
  fragrance: string;             // Aromatherapy notes
  texture: string;               // Physical texture
  productFormat: string;         // Packaging container type
  volume: string;                // Net volume or unit count (e.g. "30 ml", "150 g")
  suitability: string;           // Recommended usage context
  howToUse: string;              // Application ritual steps
  allergens?: string;            // Allergen and purity disclosures
  isSkincare: boolean;           // Flag for inclusion in Skincare Discovery pool
  isPopular: boolean;            // Flag for featured home showcase
  includedProductIds?: string[]; // Hampers only: list of child product IDs
  itemNames?: string[];          // Hampers only: display names of contents
  packagingIncluded?: string;    // Hampers only: packaging name
  occasionFit?: string[];        // Hampers only: matching occasion tags
  style?: string;                // Hampers only: styling aesthetic
}
```

### B. Custom Hamper Object (`HamperItem`)
```typescript
interface HamperItem {
  id: string;                    // Unique identifier
  name: string;                  // Hamper title
  occasion: string;              // "Birthday" | "Wedding" | "Anniversary" | "Festival" | etc.
  style: string;                 // "Minimal and Elegant" | "Luxury" | "Cute and Colourful" | "Natural and Handmade" | "Self-Care and Wellness"
  packaging: PackagingOption;    // Selected packaging object
  products: Array<{              // List of contained items
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    quantity: number;
  }>;
  cardMessage: string;           // Bespoke message on calligraphed card
  recipientName: string;         // Name on wish card
  senderName: string;            // Sender signature
  cardTemplate: string;          // "gold-botanical" | "blush-romance" | "sage-serenity" | "classic-ivory"
  totalPrice: number;            // Combined price (items + packaging + card fee ₹199)
}
```

### C. Order Enquiry Object (`Enquiry`)
```typescript
interface Enquiry {
  id: string;                    // "ST-YYYY-XXXX"
  customerName: string;
  email: string;
  phone: string;
  preferredContact: 'WhatsApp' | 'Email' | 'Phone';
  deliveryLocation: string;
  eventDate: string;
  customNotes: string;
  submittedAt: string;           // ISO timestamp
  status: 'New' | 'In Review' | 'Responded' | 'Closed';
  estimatedTotal: number;
  itemsSummary: string;
  details: {
    hampers: HamperItem[];
    standalone: Array<{ product: Product; quantity: number }>;
  };
  internalNote?: string;
}
```

---

## 7. Business Logic Engines

### A. Hamper Recommendation Engine (`services/recommendationService.js`)
- **Inputs**: `occasion`, `recipientRelationship`, `preferredCategories`, `style`, `budgetMin`, `budgetMax`, `products`.
- **Filtering**:
  - Excludes pre-made hampers and raw packaging from the candidate pool.
  - Retains only `available: true` items.
- **Packaging Selection**:
  - Automatically picks default packaging tailored to style:
    - *Luxury* -> Artisan Pine Wood Keepsake Chest (`pkg-1`, ₹399)
    - *Cute & Colourful* / *Self-Care* -> Sage Velvet Woven Hamper Basket (`pkg-3`, ₹349)
    - *Minimal & Elegant* -> Japanese Furoshiki Botanical Linen Wrap (`pkg-4`, ₹249)
    - *Default* -> Eco Kraft Keepsake Box (`pkg-2`, ₹199)
- **Product Scoring System**:
  - Category affinity matches: `+25` points.
  - Occasion affinity matches (e.g. Saffron/Rose for Wedding, Lavender for Self-Care): `+15 to +20` points.
  - Style affinity matches (e.g. higher-priced luxury items, natural kraft/organic): `+10 to +15` points.
- **Tier Composition**:
  - Greedily generates 3 distinct tiers:
    1. *Signature Ritual* (3 items)
    2. *Harmony Collection* (2 items)
    3. *Grand Indulgence* (4 items)
  - Formula: `Total = Σ(product.price) + packaging.price + cardFee (₹199) <= budgetMax`.

### B. Skincare Discovery Engine (`services/skincareService.js`)
- **Inputs**: `category`, `texture`, `fragrance`, `ingredientPreferences`, `avoidIngredients`, `productFormat`, `maxPrice`, `products`.
- **Catalogue Pool**: Evaluates individual artisan formulations (automatically filters out `Gift Hampers` and `Gift Packaging`).
- **Safety Standard**: Strictly non-medical, cosmetic, and preference matching with prominent safety disclaimers.
- **Category Match Engine**:
  - `All Formulations`: Evaluates all 11 artisan products in the laboratory.
  - Category groups (`Artisan Soaps & Cleansers`, `Face & Body Scrubs`, `Body Butters & Lotions`, `Soothing Gels`, `Face Serums & Elixirs`, `Lip Care & Herbal Kohl`): Strictly confines evaluation to products within that formulation family.
- **Deep Multi-Field & Synonym Avoidance Engine**:
  - Searches across `ingredients`, `allergens`, `fragrance`, `name`, `tagline`, and `description`.
  - Strips claim declarations (e.g. `nut-free`, `alcohol-free`) to prevent false-positive rejections.
  - Token-boundary regex for short words (e.g. `nut`, `bee`) to prevent false hits inside `coconut`.
  - Built-in allergen synonym dictionary (e.g. `honey` -> `honey`, `beeswax`, `cera alba`, `bee`, `propolis`, `royal jelly`).
  - Strict exclusion: If a product violates any avoided term or sensitivity preference (`nut-free`, `bee-free`, `dairy-free`, `caffeine-free`), score is 0 and it is completely omitted.
- **Scoring & Match Explanations**:
  - Baseline score: `70`.
  - Category affinity: `+15`.
  - Texture match: `+10`.
  - Fragrance notes match: `+10`.
  - Packaging format match: `+5`.
  - Within budget: `+5`.
  - Returns qualifying items sorted descending with detailed match reason explanations.
- **Storage & State Key**: `surreal_products_v4` in `SelectionContext.jsx`.

---

## 8. Design System & Style Tokens

### Color Palette
- **Background**: `#FFFFFF` (Plain White Canvas)
- **Primary Text**: `#2D2A26` / `#342417` / `#3D2C1F` (Espresso / Deep Walnut)
- **Secondary Text / Muted**: `#6B5A4B` / `#7A6A5A` / `#8C7A6A` (Earthy Taupe)
- **Botanical Accent**: `#556B52` (Deep Sage Green), Hover `#3E523B`, Light `#E9EFE9`
- **Luxury Gold Accent**: `#D4AF37`, `#C5A059`, `#8C6D37` (Antique Brushed Gold)
- **Warm Blush / Coral Accent**: `#C86D51`, `#E8C5B8` (Terracotta Rose)
- **Borders & Dividers**: `#EBE4D8`, `#E8DEC9`, `#E5DAC9` (Warm Sand)
- **Card Surfaces**: `#FFFDF9`, `#FAF0E6`, `#F4EDE2`

### Typography
- **Headings & Luxury Accents**: `'Marcellus'`, `'Italiana'`, `'Tenor Sans'`, Georgia, serif
- **Body, Controls, Navigation**: `'Outfit'`, `'Inter'`, system-ui, -apple-system, sans-serif

### Reusable CSS Classes (defined in `src/index.css`)
- `.boutique-panel`: Crisp solid white surface with subtle 1px `#EBE4D8` border (zero gradients).
- `.boutique-badge`: Understated solid `#FAF3EA` badge with `#E8D6B7` border.
- `.shadow-subtle`: Gentle, clean, natural ambient drop shadow without artificial blur.

---

## 9. Conventions & Rules for Future AI Code Modifications

1. **Always Sync `AI_CONTEXT.md`**: Whenever you add, modify, or remove components, pages, data fields, or routes, immediately update the corresponding section in this file.
2. **Background & Aesthetics**: Always preserve the crisp plain white background (`#FFFFFF` / `bg-white`). Do NOT introduce emojis or sparkle/sparkling icons (`Sparkles`) anywhere in UI components, headings, buttons, or toasts.
3. **Preserve Non-Medical Skincare Positioning**: Never introduce medical claims (e.g. "cures eczema", "treats acne"). Always maintain the cosmetic, sensory, and ingredient-transparency terminology.
4. **Preserve the Two-Tier Ordering Flow**:
   - Do NOT replace the enquiry form with a generic Stripe/PayPal direct charge unless explicitly instructed by the user. The platform intentionally uses a bespoke custom order enquiry flow to accommodate custom engraving, calligraphy proofing, and fresh batch curing.
5. **Maintain LocalStorage Persistence**: Any changes to `products`, `standaloneItems`, `customHampers`, or `enquiries` must remain persisted in `localStorage` so that admin edits, cart changes, and enquiry submissions persist across browser reloads.
6. **Always Verify Builds**: Before concluding any code changes, execute `npm run build` and ensure clean compilation.
7. **Code Style & Icons**: Always use `lucide-react` for clean iconography and Tailwind CSS classes for styling to preserve visual harmony.
8. **Minimalist Headings**: Do NOT place small highlighted pill badges, decorative dots, or uppercase tracking subtitle lines directly above page or section headings (`<h1>`, `<h2>`). Let the editorial `Marcellus` headings lead cleanly without clutter.

---

## 10. Spring Boot Backend: Order & Warehouse Packing Slip Engine (Step 4)

### A. Endpoints & REST Architecture
- `POST /api/orders`: Creates and confirms an order from a valid hamper selection or accepted corporate quotation (`quotationId`). Revalidates catalogue inventory stock, allergen restrictions, and budget constraints before confirmation. Deducts stock from inventory.
- `GET /api/orders/{id}`: Retrieves confirmed order snapshot and item details by ID.
- `GET /api/orders/{id}/packing-slip`: Exports warehouse-ready structured JSON packing slip payload with deterministic item sequence numbers (1, 2, 3...), 2D planar dimension & volume capacity verification, grounded container packing instructions, allergen warnings, and cost breakdowns.

### B. Database Schema Additions (`backend/schema.sql`)
- `orders`: Relational table storing order reference, customer details, box size, packaging option, status (`WAREHOUSE_READY`), financial totals, budget, and fulfilment notes.
- `order_allergens`: Collection table storing recorded customer allergen restrictions.
- `order_items`: Relational table storing sequential line items with product ID, snapshot unit prices, unit costs, dimensions (`length_cm`, `width_cm`, `height_cm`, `volume_cm3`, `weight_grams`), recorded packaging info, and cross-contamination warnings.
- `products`: Added physical dimension and weight columns (`length_cm`, `width_cm`, `height_cm`, `volume_cm3`, `weight_grams`).

### C. Physical Fit & Safety Rules
- **Physical Fit Validation**: Evaluates 2D planar dimensions (with 90° planar rotation) and total volume against configured box capacities (`Petite`, `Classic`, `Deluxe`, `Grand`). If dimensions are unrecorded for any item or box, returns explicit `NOT_VALIDATED_MISSING_DIMENSIONS` status with `fitVerified: false`. Never claims physical fit without recorded data.
- **Grounded Packing Instructions**: Strictly generated from recorded product `packagingInfo` (fragile glass bottles, paper-wrapped artisan soap, metal tins, etc.) without fabricating physics or unsupported requirements.
- **Strict Pre-Order Revalidation**: Blocks invalid orders (insufficient inventory, allergen conflicts with customer restrictions, or budget exceeded) from reaching warehouse-ready status.

---

*Last Updated: Step 4 — Warehouse Order Slip and Structured JSON Export*
