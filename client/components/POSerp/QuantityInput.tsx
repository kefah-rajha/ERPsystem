import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps {
  value: number;
  max: number;
  onChange: (quantity: number) => void;
  compact?: boolean;
}

export default function QuantityInput({ 
  value, 
  max, 
  onChange, 
  compact = false 
}: QuantityInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    onChange(Math.min(Math.max(1, newValue), max));
  };

  const decreaseQuantity = () => onChange(Math.max(1, value - 1));
  const increaseQuantity = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center gap-1 mt-2">
      <Button
        variant="outline"
        size={compact ? "sm" : "default"}
        onClick={decreaseQuantity}
        disabled={value <= 1}
        className='card-gradient hover:bg-orange-500'
      >
        <Minus className={compact ? "h-3 w-3" : "h-4 w-4"} />
      </Button>
      <Input
        type="number"
        min="1"
        max={max}
        value={value}
        onChange={handleInputChange}
        className={`w-16 text-center  bg-gray-950/20 ${compact ? "h-8 px-2" : ""}`}
      />
      <Button
        variant="outline"
        size={compact ? "sm" : "default"}
        onClick={increaseQuantity}
        disabled={value >= max}
        className='card-gradient hover:bg-orange-500'

      >
        <Plus className={compact ? "h-3 w-3" : "h-4 w-4"} />
      </Button>
    </div>
  );
}