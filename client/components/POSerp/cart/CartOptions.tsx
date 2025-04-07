import React from 'react';
import { Currency, CartSettings } from '@/dataType/posDataType';
import { currencies } from '@/lib/data/currencies';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CartOptionsProps {
  settings: CartSettings;
  onSettingsChange: (settings: CartSettings) => void;
}

export default function CartOptions({ settings, onSettingsChange }: CartOptionsProps) {
  const handleCurrencyChange = (currencyCode: string) => {
    const newCurrency = currencies.find(c => c.code === currencyCode) as Currency;
    onSettingsChange({ ...settings, currency: newCurrency });
  };

  const handleVatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : Math.min(Math.max(0, Number(e.target.value)), 100);
    onSettingsChange({ ...settings, customVatRate: value });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="currency" className="text-xs font-medium mb-1.5 block">
          Currency
        </Label>
        <Select
          value={settings.currency.code}
          onValueChange={handleCurrencyChange}
        >
          <SelectTrigger id="currency" className="h-8">
            <SelectValue>
              <span className="flex items-center gap-1 text-sm">
                <span className="font-medium">{settings.currency.symbol}</span>
                <span>{settings.currency.code}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem 
                key={currency.code} 
                value={currency.code}
                className="text-sm"
              >
                <span className="flex items-center gap-1">
                  <span className="font-medium">{currency.symbol}</span>
                  <span>{currency.code}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="vat" className="text-xs font-medium mb-1.5 block">
          VAT Rate (%)
        </Label>
        <Input
          id="vat"
          type="number"
          min="0"
          max="100"
          value={settings.customVatRate ?? ''}
          onChange={handleVatChange}
          placeholder="Default"
          className="h-8 text-sm "
        />
      </div>
    </div>
  );
}