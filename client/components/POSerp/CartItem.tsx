import React from 'react';
import { CartItem as CartItemType, CartSettings } from '@/dataType/posDataType';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import QuantityInput from './QuantityInput';
import { calculateItemTotal, formatPrice } from '@/lib/price-utils';

interface CartItemProps {
  item: CartItemType;
  settings: CartSettings;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export default function CartItem({ 
  item, 
  settings,
  onUpdateQuantity, 
  onRemoveItem 
}: CartItemProps) {
  const hasVAT =+item.vat > 0? true : false;
  const { total, productVatAmount } = calculateItemTotal(
    +item.price,
    item.quantity,
    hasVAT,  
    +item.vat || 0,
    settings.currency,
  );

  const basePrice = +item.price * settings.currency.rate;

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{item.name}</h3>
            {hasVAT && item.vat && (
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                VAT {item.vat}%
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatPrice(basePrice, settings.currency)} each
          </p>
        </div>
        <div className="flex items-center gap-2">
          <QuantityInput
            value={item.quantity}
            max={+item.stock}
            onChange={(quantity) => onUpdateQuantity(item._id, quantity)}
            compact
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveItem(item._id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Item total:</span>
        <div className="text-right">
          <div className="font-medium">{formatPrice(total, settings.currency)}</div>
          {productVatAmount > 0 && (
            <div className="text-xs text-muted-foreground">
              Includes VAT: {formatPrice(productVatAmount, settings.currency)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}