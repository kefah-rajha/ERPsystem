"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

import {CustomerSalesOrder} from "@/dataType/dataTypeSalesOrder/dataTypeSalesOrder"
interface CustomerInfoType{
  customer:CustomerSalesOrder
}

export function CustomerInfo({ customer }: CustomerInfoType) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="p-0">
          {customer.userName}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{customer.userName}</h4>
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4" />
            {customer.customerEmail}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4" />
            {customer.phone}
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4" />
            {customer.shipmentAddress}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}