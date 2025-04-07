"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import {OrderItemType} from "@/dataType/dataTypeSalesOrder/dataTypeSalesOrder";

 interface OrderItemsProps {
   items: OrderItemType[]
 }
export function OrderItems({ items }: OrderItemsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Package className="mr-2 h-4 w-4" />
          {items.length} items
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold mb-2">Order Items</h4>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span>{item?.product?.name}</span>
                <div className="flex gap-4">
                  <span>x{item.quantity}</span>
                  <span className="font-medium">${(+item?.product?.price).toFixed(2)} </span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                $
                {items
                  ?.reduce((sum, item) => sum + +item?.product?.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}