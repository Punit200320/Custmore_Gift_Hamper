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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active_stock ON products(active, stock_quantity);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON customer_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON customer_enquiries(email);
