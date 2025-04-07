import { Currency } from '@/types';

export function calculateItemTotal(
  price: number,
  quantity: number,
  hasVAT: boolean = false,
  productVatRate: number = 0,
  currency: Currency,
) {
  const basePrice = price * currency.rate;
  const baseTotal = basePrice * quantity;
  const productVatAmount = hasVAT ? baseTotal * (productVatRate / 100) : 0;
  const total = baseTotal + productVatAmount;

  return {
    baseTotal,
    productVatAmount,
    total,
  };
}

export function calculateCartTotals(
  items: Array<{ total: number; productVatAmount: number }>,
  generalVatRate: number | null
) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const productVatTotal = items.reduce((sum, item) => sum + item.productVatAmount, 0);
  const generalVatAmount = generalVatRate ? (subtotal * generalVatRate / 100) : 0;
  
  return {
    subtotal,
    productVatTotal,
    generalVatAmount,
    total: subtotal + generalVatAmount
  };
}

export function formatPrice(amount: number, currency: Currency): string {
  return `${currency.symbol}${amount.toFixed(2)}`;
}