import React from 'react';
import { Order } from '@/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { FileText, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/price-utils';

interface OrderItemProps {
  order: Order;
  onGenerateInvoice: (orderId: string) => void;
  onProcessPayment: (orderId: string) => void;
}

export default function OrderItem({ 
  order, 
  onGenerateInvoice, 
  onProcessPayment 
}: OrderItemProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Order #{order.id}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <span className="text-lg font-bold">
              ${order.total.toFixed(2)}
            </span>
          </div>
          
          <div className="space-y-1">
            {order.customerName && (
              <p className="text-sm">
                <span className="text-muted-foreground">Customer:</span>{' '}
                {order.customerName}
              </p>
            )}
            {order.customerEmail && (
              <p className="text-sm">
                <span className="text-muted-foreground">Email:</span>{' '}
                {order.customerEmail}
              </p>
            )}
          </div>

          <div className="text-sm">
            <p className="font-medium mb-1">Items:</p>
            <ul className="space-y-1 text-muted-foreground">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity, { code: 'USD', symbol: '$', rate: 1 })}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 border-t bg-muted/50">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => onProcessPayment(order.id)}
        >
          <CreditCard className="w-4 h-4" />
          Process Payment
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => onGenerateInvoice(order.id)}
          disabled={!order.invoiceGenerated}
        >
          <FileText className="w-4 h-4" />
          Generate Invoice
        </Button>
      </CardFooter>
    </Card>
  );
}