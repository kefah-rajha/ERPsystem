"use client";

interface Supplier {
  name: string;
  contactPerson?: string;
  supplierEmail?: string;
  phone?: string;
  address?: string;
  taxId?: string;
}

interface SupplierInfoProps {
  supplier: Supplier;
}

export function SupplierInfo({ supplier }: SupplierInfoProps) {
  return (
    <div className="flex flex-col">
      <span className="font-medium">{supplier.name}</span>
      {supplier.contactPerson && (
        <span className="text-xs text-muted-foreground">
          Contact: {supplier.contactPerson}
        </span>
      )}
      {supplier.phone && (
        <span className="text-xs text-muted-foreground">
          Phone: {supplier.phone}
        </span>
      )}
    </div>
  );
}