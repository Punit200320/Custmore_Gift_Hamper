import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SelectionProvider } from './context/SelectionContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';

import Home from './pages/Home';
import About from './pages/About';
import GiftHamperBuilder from './pages/GiftHamperBuilder';
import ProductCatalogue from './pages/ProductCatalogue';
import SkincareDiscovery from './pages/SkincareDiscovery';
import MySelections from './pages/MySelections';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';

// Automatically scroll to top on page navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/builder" element={<GiftHamperBuilder />} />
        <Route path="/shop" element={<ProductCatalogue />} />
        <Route path="/skincare-discovery" element={<SkincareDiscovery />} />
        <Route path="/selections" element={<MySelections />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Fallback to Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <SelectionProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2A26]">
          <Navbar />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />
          <Toast />
          <WhatsAppFloatingButton />
        </div>
      </Router>
    </SelectionProvider>
  );
}
