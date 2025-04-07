import React, { useState } from 'react';
import { CartItem as CartItemType, CartSettings } from '../types';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import CartItem from './CartItem';
import CartTotals from './cart/CartTotals';
import CartOptions from './cart/CartOptions';
import { currencies } from '@/data/currencies';

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export default function Cart({ items, onUpdateQuantity, onRemoveItem }: CartProps) {
  const [settings, setSettings] = useState<CartSettings>({
    currency: currencies[0],
    customVatRate: null,
  });

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b py-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <CardTitle>Shopping Cart</CardTitle>
          </div>
          <CartOptions settings={settings} onSettingsChange={setSettings} />
        </div>
      </CardHeader>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <CardContent className="p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4 divide-y">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    settings={settings}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </div>
      
      {items.length > 0 && (
        <CardFooter className="flex-col gap-4 border-t p-4 mt-auto bg-background">
          <CartTotals items={items} settings={settings} />
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}