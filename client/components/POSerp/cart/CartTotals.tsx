import { CartItem, CartSettings } from '@/types';
import { calculateItemTotal, calculateCartTotals, formatPrice } from '@/lib/price-utils';

interface CartTotalsProps {
  items: CartItem[];
  settings: CartSettings;
}

export default function CartTotals({ items, settings }: CartTotalsProps) {
  const itemTotals = items.map(item => 
    calculateItemTotal(
      item.price,
      item.quantity,
      item.hasVAT,
      item.vatRate || 0,
      settings.currency,
    )
  );

  const totals = calculateCartTotals(itemTotals, settings.customVatRate);

  return (
    <div className="space-y-3">
      <div className="space-y-2 border-b pb-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Subtotal:</span>
          <span>{formatPrice(totals.subtotal, settings.currency)}</span>
        </div>
        {totals.productVatTotal > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Product VAT:</span>
            <span>{formatPrice(totals.productVatTotal, settings.currency)}</span>
          </div>
        )}
        {settings.customVatRate !== null && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              General VAT ({settings.customVatRate}%):
            </span>
            <span>{formatPrice(totals.generalVatAmount, settings.currency)}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold">Total:</span>
        <span className="font-bold text-lg text-primary">
          {formatPrice(totals.total, settings.currency)}
        </span>
      </div>
    </div>
  );
}