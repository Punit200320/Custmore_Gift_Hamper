# Surreal Treasures — A-Powered Gifting & Skincare Discovery Platform
live : https://surreal-treasures-frontend.onrender.com/
A modern, boutique, interactive web application built for **Surreal Treasures**, a handmade skincare and personalised gifting brand.

The platform unites three core customer discovery experiences into one seamless digital experience:
1. **Personalised Gift Hamper Recommendation System** (Budget-aware, rule-based combinations with interactive customisation)
2. **Digital Ordering and Customisation Platform** (Shared product catalogue, itemised pricing, custom calligraphy, and formal order enquiries)
3. **Skincare Product Discovery Assistant** (Non-medical guided questionnaire matching verified botanical formulations)

---

## 1. Technology Stack

- **Frontend Framework**: React.js with Vite
- **Styling**: Tailwind CSS (with bespoke warm ivory, sage green, and soft gold design tokens)
- **Icons**: Lucide React
- **Routing**: React Router v7
- **State Management**: React Context API (`SelectionContext`) with localStorage persistence
- **Visual Delight**: Canvas Confetti celebratory effects, custom boutique animations
- **Backend Architecture**: Node.js & Express.js REST API
- **Database Schema**: PostgreSQL with relational data definitions for products, categories, hampers, and enquiries

---

## 2. Platform Architecture & Features

### A. Home Page
- **Hero Banner**: "Thoughtful Gifts. Meaningful Moments." with dual CTAs to launch the Hamper Builder or Skincare Discovery Assistant.
- **Occasion-Based Gifting**: Direct category shortcuts into Birthday, Wedding, Anniversary, Festival, Self-Care, and Corporate Gifting.
- **Featured Ready-to-Gift Hampers**: Pre-curated combinations showcasing transparent product inclusions.
- **Micro-Batch Skincare Showcase**: Cold-pressed botanical face oils, raw shea soufflés, and artisan goat-milk soaps.
- **How It Works**: 4-step transparent journey from budget setting to artisan dispatch.
- **Patron Testimonials**: Clearly labeled demonstration reviews from weddings, corporate orders, and daily rituals.

### B. Gift Hamper Recommendation System
- **Step 1**: Select Occasion (Birthday, Wedding, Anniversary, Festival, Thank You, Corporate, Self-Care).
- **Step 2**: Specify Recipient Details (Relationship, preferred product categories, aroma inclinations, aesthetic theme).
- **Step 3**: Budget Range Selector (₹500–₹1,000, ₹1,000–₹2,000, ₹2,000–₹3,000, ₹3,000+, or Custom Budget input).
- **Step 4**: Gifting Style (Minimal & Elegant, Luxury, Cute & Colourful, Natural & Handmade, Self-Care & Wellness).
- **Step 5**: Transparent Rule-Based Engine:
  - Selects only available, in-stock products.
  - Matches item scores to occasion, recipient, and style.
  - Generates tier options strictly respecting the budget ceiling.
  - Explains the exact artisan rationale for each combination.
- **Step 6**: Live Hamper Customization Studio:
  - Add or remove items from the catalog.
  - Modify item quantities in real time.
  - Select luxury packaging: Pine Wood Keepsake Chest, Recycled Eco Kraft Box, Woven Willow Basket, or Japanese Furoshiki Linen Wrap.
  - Personalise the calligraphed deckled wish card with custom message, recipient name, and signature.
  - Real-time price calculation updating instantaneously.

### C. Digital Product Catalogue
- Unified catalogue across Handmade Skincare, Bath & Body, Gift Hampers, Accessories, Personalised Gifts, and Gift Packaging.
- Real-time search by ingredient, product title, or scent.
- Filters by category, availability, and price sorting.
- Product Quick View modal with verified botanical ingredients, texture, aroma notes, ritual usage guides, and allergens disclosure.

### D. Skincare Product Discovery Assistant
- Non-medical, preference-based discovery questionnaire.
- Prominent non-medical disclaimer banner explaining recommendations are for sensory exploration and cosmetic discovery.
- Asks for desired texture, fragrance notes, botanical preferences, and ingredient avoidances (e.g. Nut-free, Vegan, Alcohol-free).
- Returns percentage match scores, verified ingredients, and "Why this matches your preferences" breakdown.

### E. My Selections & Order Enquiry Flow
- Combines standalone products and custom hampers in one unified basket.
- Real-time price breakdown (subtotal, discount codes like `SURREAL10`, packaging fees, grand total).
- Custom Order Enquiry form with full validation (Name, Email, WhatsApp number, Delivery City, Event Date, Custom Engraving Notes).
- Confirmation screen generating a unique reference number (e.g. `ST-2026-9284`) and artisan SLA timeline (2–4 hours response).

### F. Business Administration Dashboard
- Real-time metrics: Total products, in-stock count, enquiry volume, and estimated pipeline value.
- Customer Enquiry Inspector: View customer notes, hamper breakdown, and update enquiry lifecycle (`New`, `In Review`, `Responded`, `Closed`).
- Inventory Management: Instant live availability toggle for products (immediately reflected in the client shop and hamper builder).
- New Product Modal: Add new artisan creations directly to the system.

---

## 3. Setup and Execution Instructions

### Project Structure
- **`frontend/`**: Complete React + Vite boutique application, Tailwind CSS, Value Hamper Mode, Interactive Studio, and Skincare Discovery.
- **`backend/`**: Express.js REST API and PostgreSQL database schema definitions.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Running the Frontend
Navigate into the `frontend/` directory (or run from root):
```bash
cd frontend
npm install
npm run dev
```
Open your browser to `http://localhost:5173`.

Alternatively, from the project root:
```bash
npm run dev
```

### Running the Backend Server
To run the Express REST API:
```bash
cd backend
node server.js
```
The server will start on port `5000`.

---

## 4. Assumptions & Mock Data Notes

1. **Order Enquiry vs. Immediate Payment**: In accordance with the prompt guidelines, the digital ordering flow submits a formal custom enquiry rather than simulating a fake credit card checkout. This matches the bespoke nature of customized gifting where artisans review candle engraving and stock freshness prior to issuing invoices.
2. **Rule-Based Recommendation Engine**: Recommendations are computed transparently based on product prices, availability, occasion affinity, and styling weights. We do not pretend an external black-box AI is active.
3. **Data Persistence**: The prototype stores custom products, cart items, hampers, and submitted enquiries in browser `localStorage`. Changes made in the Admin Dashboard instantly persist and synchronize across the user-facing store.
4. **PostgreSQL Production Schema**: A production-ready relational database schema is provided in `server/schema.sql` for deployment with PostgreSQL on Supabase, AWS RDS, or Render.
