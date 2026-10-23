import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { pageVariants, pageVariantsReduced, pageTransition } from '../utils/animations';

/**
 * Wraps any page in a fade + slide-up entry animation.
 * Automatically uses opacity-only when the user prefers reduced motion.
 * Use inside <AnimatePresence> at the route level for exit animations.
 */
export default function AnimatedPage({ children, className = '' }) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={shouldReduce ? pageVariantsReduced : pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
