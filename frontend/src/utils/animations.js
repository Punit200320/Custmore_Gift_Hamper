/**
 * Shared Framer Motion animation variants and utilities.
 * Centralised to ensure consistency, reduce bundle overhead,
 * and respect the user's reduced-motion preference.
 */

// --- Page-Level Transition Variants ---
export const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const pageTransition = {
  duration: 0.35,
  ease: [0.25, 0.1, 0.25, 1], // cubic-bezier easeOut
};

// Reduced-motion safe version (opacity only)
export const pageVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// --- Section / Card Stagger Variants ---
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export const staggerItemReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
};

// --- Tier Card Animations (Budget / Balanced / Premium) ---
export const tierCardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.97 },
};

export const tierCardTransition = (index) => ({
  duration: 0.35,
  delay: index * 0.1,
  ease: 'easeOut',
});

// --- Navbar Mobile Menu ---
export const mobileMenuVariants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
};

export const mobileMenuTransition = {
  duration: 0.25,
  ease: 'easeInOut',
};

// --- Footer Reveal (scroll-triggered) ---
export const footerSectionVariants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.45, ease: 'easeOut' },
};

// --- Quiz / Wizard Step Transition ---
export const wizardStepVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export const wizardStepTransition = {
  duration: 0.3,
  ease: 'easeInOut',
};

export const wizardStepVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// --- List Item Add/Remove ---
export const listItemVariants = {
  initial: { opacity: 0, height: 0, scale: 0.95 },
  animate: { opacity: 1, height: 'auto', scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, height: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
};

// --- Button Tap Feedback ---
export const buttonTap = (shouldReduce) =>
  shouldReduce ? {} : { scale: 0.96 };

export const buttonHover = (shouldReduce) =>
  shouldReduce ? {} : { scale: 1.03 };

// --- Fade-in-up for sections ---
export const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.4, ease: 'easeOut' },
};

export const fadeInUpReduced = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.25 },
};
