"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, Trash2 } from "lucide-react";

interface SalesOrderActionsProps {
  orderId: string;
  orderNumber: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function SalesOrderActions({
  orderId,
  orderNumber,
  onDelete,
  onEdit,
}: SalesOrderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(orderId)}
        className="h-8 w-8"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sales Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete sales order {orderNumber}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {}}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => onDelete(orderId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}