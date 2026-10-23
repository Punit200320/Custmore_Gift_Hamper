-- Surreal Treasures PostgreSQL Database Schema
-- Production Schema for Handcrafted Skincare & Personalised Gifting Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Product Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Master Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    retail_price NUMERIC(10, 2) NOT NULL CHECK (retail_price >= 0),
    unit_cost NUMERIC(10, 2) NOT NULL CHECK (unit_cost >= 0),
    packaging_cost_contribution NUMERIC(10, 2) DEFAULT 0.00,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    ingredient_verification_status VARCHAR(50) NOT NULL DEFAULT 'UNVERIFIED'
        CHECK (ingredient_verification_status IN ('VERIFIED', 'UNVERIFIED', 'PENDING_REVIEW')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    handmade BOOLEAN NOT NULL DEFAULT TRUE,
    image_url TEXT,
    last_verification_date DATE,
    packaging_info VARCHAR(255),
    cross_contamination_warning TEXT,
    length_cm NUMERIC(8, 2),
    width_cm NUMERIC(8, 2),
    height_cm NUMERIC(8, 2),
    volume_cm3 NUMERIC(10, 2),
    weight_grams NUMERIC(8, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Product Collection Tables for Relationships
CREATE TABLE IF NOT EXISTS product_skin_types (
    product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    skin_type VARCHAR(50) NOT NULL,
    PRIMARY KEY (product_id, skin_type)
);

CREATE TABLE IF NOT EXISTS product_ingredients (
    product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    ingredient VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS product_declared_allergens (
    product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    declared_allergen VARCHAR(100) NOT NULL
);

-- 4. Packaging Options Master Table
CREATE TABLE IF NOT EXISTS packaging_options (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    tagline VARCHAR(255),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT NOT NULL,
    description TEXT,
    material VARCHAR(100),
    capacity VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Customer Enquiries Table
CREATE TABLE IF NOT EXISTS customer_enquiries (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    preferred_contact VARCHAR(50) DEFAULT 'WhatsApp',
    delivery_location VARCHAR(255) NOT NULL,
    target_event_date DATE,
    custom_notes TEXT,
    status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'In Review', 'Responded', 'Closed')),
    estimated_total NUMERIC(10, 2) NOT NULL,
    items_summary TEXT,
    details_json JSONB NOT NULL,
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Corporate Quotations Table (Snapshot Persistence)
CREATE TABLE IF NOT EXISTS corporate_quotations (
    id VARCHAR(50) PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    requested_quantity INTEGER NOT NULL CHECK (requested_quantity > 0),
    occasion VARCHAR(100),
    recipient_profile VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    status_message TEXT,
    fulfillable BOOLEAN NOT NULL DEFAULT TRUE,
    budget_per_hamper NUMERIC(12, 2),
    total_budget NUMERIC(14, 2),
    selling_price_per_hamper NUMERIC(12, 2),
    product_cost_per_hamper NUMERIC(12, 2),
    packaging_cost_per_hamper NUMERIC(12, 2),
    other_costs_per_hamper NUMERIC(12, 2),
    estimated_cost_per_hamper NUMERIC(12, 2),
    gross_profit_per_hamper NUMERIC(12, 2),
    total_quote NUMERIC(14, 2),
    estimated_total_cost NUMERIC(14, 2),
    estimated_total_gross_profit NUMERIC(14, 2),
    gross_margin_percentage NUMERIC(6, 2),
    snapshot_json TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Orders Master Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    order_reference VARCHAR(100) NOT NULL UNIQUE,
    quotation_id VARCHAR(50) REFERENCES corporate_quotations(id),
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(200),
    delivery_address TEXT NOT NULL,
    box_size VARCHAR(50),
    packaging_option VARCHAR(200),
    status VARCHAR(50) NOT NULL,
    status_message TEXT,
    total_product_retail NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    packaging_retail_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_order_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_product_cost NUMERIC(12, 2),
    packaging_cost NUMERIC(10, 2),
    total_order_cost NUMERIC(12, 2),
    customer_budget NUMERIC(12, 2),
    fulfilment_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_allergens (
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    allergen VARCHAR(100) NOT NULL
);

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_sequence INTEGER NOT NULL,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_retail_price NUMERIC(10, 2) NOT NULL,
    total_retail_price NUMERIC(12, 2) NOT NULL,
    unit_cost NUMERIC(10, 2),
    total_cost NUMERIC(12, 2),
    length_cm NUMERIC(8, 2),
    width_cm NUMERIC(8, 2),
    height_cm NUMERIC(8, 2),
    volume_cm3 NUMERIC(10, 2),
    weight_grams NUMERIC(8, 2),
    packaging_info VARCHAR(255),
    cross_contamination_warning TEXT,
    ingredient_verification_status VARCHAR(50)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active_stock ON products(active, stock_quantity);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON customer_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON customer_enquiries(email);
CREATE INDEX IF NOT EXISTS idx_corporate_quotes_company ON corporate_quotations(company_name);
CREATE INDEX IF NOT EXISTS idx_corporate_quotes_status ON corporate_quotations(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_reference ON orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
