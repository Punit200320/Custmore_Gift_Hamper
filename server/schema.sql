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
    tagline VARCHAR(255),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    sub_category VARCHAR(100),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    available BOOLEAN DEFAULT TRUE,
    stock INTEGER DEFAULT 0,
    badge VARCHAR(50),
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    ingredients JSONB DEFAULT '[]'::jsonb,
    fragrance VARCHAR(150),
    texture VARCHAR(150),
    product_format VARCHAR(100),
    volume VARCHAR(50),
    suitability TEXT,
    how_to_use TEXT,
    allergens TEXT,
    is_skincare BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Packaging Options Master Table
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

-- 4. Pre-Curated Hampers Table
CREATE TABLE IF NOT EXISTS curated_hampers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    style VARCHAR(100) NOT NULL,
    occasions JSONB DEFAULT '[]'::jsonb,
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    packaging_id VARCHAR(50) REFERENCES packaging_options(id),
    included_product_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Customer Enquiries Table
CREATE TABLE IF NOT EXISTS customer_enquiries (
    id VARCHAR(50) PRIMARY KEY, -- Reference code e.g. ST-2026-9284
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
CREATE INDEX IF NOT EXISTS idx_products_category ON products(sub_category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON customer_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON customer_enquiries(email);
