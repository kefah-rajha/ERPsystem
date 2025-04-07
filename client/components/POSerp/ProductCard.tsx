import React, { useState } from 'react';
import { Product } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import QuantityInput from './QuantityInput';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import AddToCartAnimation from './cart/AddToCartAnimation';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [animationConfig, setAnimationConfig] = useState<{
    isAnimating: boolean;
    position: { x: number; y: number };
  }>({
    isAnimating: false,
    position: { x: 0, y: 0 },
  });

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    setAnimationConfig({
      isAnimating: true,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      },
    });
    
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <>
      {animationConfig.isAnimating && createPortal(
        <AddToCartAnimation
          startPosition={animationConfig.position}
          onComplete={() => setAnimationConfig(prev => ({ ...prev, isAnimating: false }))}
        />,
        document.body
      )}

      <Card className="flex flex-col h-full hover:shadow-lg transition-all  card-gradient">
        {product.image && (
          <motion.div 
            className="relative h-48 overflow-hidden rounded-t-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
        <CardHeader className="flex-grow">
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <motion.span 
                className="text-xl font-bold text-primary"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                ${product.price.toFixed(2)}
              </motion.span>
            </div>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium flex justify-between">
              <span>Stock:</span>
              <span className="text-muted-foreground">{product.stock}</span>
            </p>
            {product.hasVAT && product.vatRate && (
              <p className="text-sm font-medium flex justify-between">
                <span>VAT ({product.vatRate}%):</span>
                <span className="text-muted-foreground">
                  ${(product.price * product.vatRate / 100).toFixed(2)}
                </span>
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 border-t bg-muted/50 rounded-b-xl">
          <div className="flex items-center justify-center w-full">
            <QuantityInput
              value={quantity}
              max={product.stock}
              onChange={setQuantity}
            />
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Button 
              onClick={handleAddToCart}
              className="w-full gap-2 "
            >
              <ShoppingCart className="w-4 h-4 " />
              Add to Cart
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </>
  );
}