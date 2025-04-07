import React from 'react';
import { Currency, CartSettings } from '@/types';
import { currencies } from '@/data/currencies';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CartSettingsProps {
  settings: CartSettings;
  onSettingsChange: (settings: CartSettings) => void;
}

export default function CartSettings({ settings, onSettingsChange }: CartSettingsProps) {
  const handleCurrencyChange = (currencyCode: string) => {
    const newCurrency = currencies.find(c => c.code === currencyCode) as Currency;
    onSettingsChange({ ...settings, currency: newCurrency });
  };

  const handleVatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : Number(e.target.value);
    onSettingsChange({ ...settings, customVatRate: value });
  };

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Select
          value={settings.currency.code}
          onValueChange={handleCurrencyChange}
        >
          <SelectTrigger id="currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.symbol} {currency.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vat">Custom VAT Rate (%)</Label>
        <Input
          id="vat"
          type="number"
          min="0"
          max="100"
          value={settings.customVatRate ?? ''}
          onChange={handleVatChange}
          placeholder="Use product's default VAT"
        />
      </div>
    </div>
  );
}