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
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CartSettingsPanelProps {
  settings: CartSettings;
  onSettingsChange: (settings: CartSettings) => void;
}

export default function CartSettingsPanel({ settings, onSettingsChange }: CartSettingsPanelProps) {
  const handleCurrencyChange = (currencyCode: string) => {
    const newCurrency = currencies.find(c => c.code === currencyCode) as Currency;
    onSettingsChange({ ...settings, currency: newCurrency });
  };

  const handleVatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : Math.min(Math.max(0, Number(e.target.value)), 100);
    onSettingsChange({ ...settings, customVatRate: value });
  };

  const clearVatRate = () => {
    onSettingsChange({ ...settings, customVatRate: null });
  };

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="currency" className="text-sm font-medium">
          Currency
        </Label>
        <Select
          value={settings.currency.code}
          onValueChange={handleCurrencyChange}
        >
          <SelectTrigger id="currency" className="w-full">
            <SelectValue placeholder="Select currency">
              <span className="flex items-center gap-2">
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
                className="flex items-center gap-2"
              >
                <span className="font-medium">{currency.symbol}</span>
                <span>{currency.code}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vat" className="text-sm font-medium">
          Custom VAT Rate (%)
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="vat"
              type="number"
              min="0"
              max="100"
              value={settings.customVatRate ?? ''}
              onChange={handleVatChange}
              placeholder="Use product's default VAT"
              className="pr-8"
            />
            {settings.customVatRate !== null && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={clearVatRate}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Leave empty to use product-specific VAT rates
        </p>
      </div>
    </div>
  );
}