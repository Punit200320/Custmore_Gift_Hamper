// Express.js Backend Server for Surreal Treasures
// Digital Ordering, Product Catalogue, and Hamper Management REST API

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory store with initial seed data fallback
let products = [];
let enquiries = [];

// Load mock database from seed or json
const seedPath = path.join(__dirname, 'seed.json');
if (fs.existsSync(seedPath)) {
  try {
    const raw = fs.readFileSync(seedPath, 'utf8');
    const data = JSON.parse(raw);
    products = data.products || [];
    enquiries = data.enquiries || [];
  } catch (err) {
    console.warn('Seed data load warning:', err.message);
  }
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Surreal Treasures API',
    timestamp: new Date().toISOString()
  });
});

// 2. Products API
app.get('/api/products', (req, res) => {
  const { category, search, available } = req.query;
  let filtered = [...products];

  if (category && category !== 'All Products') {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (available === 'true') {
    filtered = filtered.filter((p) => p.available);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.ingredients?.some((ing) => ing.toLowerCase().includes(q))
    );
  }

  res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.patch('/api/products/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = { ...products[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(products[index]);
});

// 3. Enquiries API
app.get('/api/enquiries', (req, res) => {
  const { status } = req.query;
  if (status && status !== 'All') {
    return res.json(enquiries.filter((e) => e.status === status));
  }
  res.json(enquiries);
});

app.post('/api/enquiries', (req, res) => {
  const { customerName, email, deliveryLocation, details } = req.body;

  if (!customerName || !email || !deliveryLocation) {
    return res.status(400).json({ error: 'Missing required enquiry parameters' });
  }

  const refId = `ST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newEnquiry = {
    ...req.body,
    id: refId,
    status: 'New',
    submittedAt: new Date().toISOString()
  };

  enquiries.unshift(newEnquiry);
  res.status(201).json(newEnquiry);
});

app.patch('/api/enquiries/:id', (req, res) => {
  const index = enquiries.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  enquiries[index] = { ...enquiries[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(enquiries[index]);
});

app.listen(PORT, () => {
  console.log(`🌿 Surreal Treasures API running on port ${PORT}`);
});
