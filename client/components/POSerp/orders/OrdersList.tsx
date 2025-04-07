import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { ClipboardList } from 'lucide-react';
import { Order } from '@/types';
import OrderItem from './OrderItem';
import { motion, AnimatePresence } from 'framer-motion';

interface OrdersListProps {
  orders: Order[];
  onGenerateInvoice: (orderId: string) => void;
  onProcessPayment: (orderId: string) => void;
}

export default function OrdersList({ 
  orders, 
  onGenerateInvoice, 
  onProcessPayment 
}: OrdersListProps) {
  const pendingOrders = orders.filter(order => order.status === 'pending');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative orders-icon"
        >
          <ClipboardList className="h-5 w-5" />
          {pendingOrders.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {pendingOrders.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Pending Orders
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <AnimatePresence>
            {pendingOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <ClipboardList className="h-12 w-12 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">No pending orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <OrderItem
                      order={order}
                      onGenerateInvoice={onGenerateInvoice}
                      onProcessPayment={onProcessPayment}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}