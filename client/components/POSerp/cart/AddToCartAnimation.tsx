import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface AddToCartAnimationProps {
  startPosition: { x: number; y: number };
  onComplete: () => void;
}

export default function AddToCartAnimation({ startPosition, onComplete }: AddToCartAnimationProps) {
  const cartIconElement = document.querySelector('.cart-icon');
  const cartRect = cartIconElement?.getBoundingClientRect();
  
  return (
    <motion.div
      initial={{ 
        scale: 1,
        opacity: 1,
        x: startPosition.x,
        y: startPosition.y,
      }}
      animate={{
        scale: 0.5,
        opacity: 0,
        x: cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 50,
        y: cartRect ? cartRect.top + cartRect.height / 2 : 20,
      }}
      transition={{ 
        duration: 0.5, 
        ease: "easeOut" 
      }}
      onAnimationComplete={onComplete}
      className="fixed top-0 left-0 z-50"
    >
      <div className="bg-primary text-primary-foreground p-2 rounded-full">
        <ShoppingCart className="w-6 h-6" />
      </div>
    </motion.div>
  );
}