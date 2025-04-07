"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  CarIcon as CaretSortIcon,
  CheckIcon,
  Loader2,
} from "lucide-react";
import { Button } from './ui/button';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import CartItem from './CartItem';
import CartOptions from './cart/CartOptions';
import CartTotals from './cart/CartTotals';
import AnimatedCartIcon from './cart/AnimatedCartIcon';
import CheckoutDialog from './checkout/CheckoutDialog';
import { CartItem as CartItemType, CartSettings } from '@/dataType/posDataType';
import { CheckoutFormValues } from '@/lib/schemas/checkout';
import { toast } from "@/components/ui/use-toast";
interface ContactInfoCustomerSearchResultsDataType {
  _id: string;
  phone: string;
  postCode: string;
  city: string;
  street: string;
  email: string;
}

interface customerSearchResultsDataType {
  _id: string;
  userName: string;
  contactID: ContactInfoCustomerSearchResultsDataType;
}

type customerSearchResultsDataTypeArray = customerSearchResultsDataType[];
interface itemsOrderSendToApiType {

  quantity: number;
  vat: number;
  vatAmount: number;
  totalAmount: number;
  product: string;

}

const formSchema = z.object({
  customer: z.string().min(1, { message: "Customer is required" }),
  shipmentAddress: z
    .string()
    .min(1, { message: "Shipment address is required" }),
  supplier: z.string().min(1, { message: "Supplier is required" }),
  salesManager: z.string().min(1, { message: "Sales manager is required" }),
  customerEmail: z.string().min(1, { message: "Customer contact is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  paymentTerm: z
    .string({
      required_error: "Please select a payment term.",
    })
    .min(1, "Payment term is required"),
  shipmentDate: z.date({
    required_error: "Shipment date is required",
  }),
  orderDate: z.date({
    required_error: "Order date is required",
  }),
  currency: z.string().min(1, "Please select a currency"),
  vatRate: z.string().min(1, "Please select a VAT rate"),
  includeVat: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface ShoppingCartSheetProps {
  items: CartItemType[];
  settings: CartSettings;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onSettingsChange: (settings: CartSettings) => void;
  onCheckout: (formData: CheckoutFormValues) => void;
}

export default function ShoppingCartSheet({
  items,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onSettingsChange,
  onCheckout,
}: ShoppingCartSheetProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openSupplier, setOpenSupplier] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [userNameCustomerSelected, setUserNameCustomerSelected] =
    useState<string>("");
  const [supplierSearchResults, setSupplierSearchResults] = useState<
    {
      firstName: string;
      lastName: string;
    }[]
  >([]);
  const [customerSearchResults, setCustomerSearchResults] =
    useState<customerSearchResultsDataTypeArray>([]);
  const [customer, setCustomer] = useState<customerSearchResultsDataType>();
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingSupplier, setIsSearchingSupplier] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const searchCustomers = async () => {
      console.log(customerSearchQuery);
      if (customerSearchQuery) {
        setIsSearching(true);
        const searchCustomers = async () => {
          try {
            const response = await fetch(
              `/api/searchCustomer?name=${customerSearchQuery}`
            );
            const customers = await response.json();
            setCustomerSearchResults(customers.data);
            console.log(customers);
            setIsSearching(false);
          } catch (error) {
            console.error("Error fetching customers:", error);
            return [];
          }
        };
        searchCustomers();
      } else {
        setCustomerSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchCustomers, 300);

    return () => clearTimeout(debounceTimer);
  }, [customerSearchQuery]);
  useEffect(() => {
    if (customerSearchResults?.length > 0) {
      const selectedCustomer = customerSearchResults?.find(
        (customer) => customer?.userName === userNameCustomerSelected
      );
      console.log(selectedCustomer, "selectedCustomer");
      if (selectedCustomer !== undefined) {
        form.setValue(
          "shipmentAddress",
          `${selectedCustomer?.contactID?.city} ${selectedCustomer?.contactID?.street} /${selectedCustomer?.contactID?.postCode}`
        );
        form.setValue("phone", selectedCustomer?.contactID?.phone);
        form.setValue("customerEmail", selectedCustomer?.contactID?.email);

        setCustomer(selectedCustomer);
      }
    }
  }, [customerSearchResults, form, userNameCustomerSelected]);

  useEffect(() => {
    const searchSuppliers = async () => {
      console.log(supplierSearchQuery);
      if (supplierSearchQuery) {
        setIsSearchingSupplier(true);
        const searchSupplier = async () => {
          try {
            const response = await fetch(
              `/api/searchSupplier?name=${supplierSearchQuery}`
            );
            const suppliers = await response.json();
            setSupplierSearchResults(suppliers.data);
            console.log(suppliers, "suppliers");
            setIsSearchingSupplier(false);
          } catch (error) {
            console.error("Error fetching customers:", error);
            return [];
          }
        };
        searchSupplier();
      } else {
        setSupplierSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchSuppliers, 300);

    return () => clearTimeout(debounceTimer);
  }, [supplierSearchQuery]);



  async function onSubmit(valuesForm: FormValues) {
    const values = {
      ...valuesForm,
      // netAmount: calculatedValues.netAmount,
      // vatAmount: calculatedValues.vatAmount,
      // totalAmount: finishAmount
    }

    const data = {
      values: values,
      // items: OrderProductsSelectToSendApi
    }

    const FetchData = await fetch("/api/createSaleOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    });
    const res = await FetchData.json();

    console.log(res, "data");
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <p>Create New Sale Order Is Done</p>
        </pre>
      ),
    });

  }



  return (
    <>
      <Sheet >
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative cart-icon">
            <AnimatedCartIcon itemCount={itemCount} />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col w-full sm:max-w-lg bg-gradient" >
          <SheetHeader className="space-y-4 pb-4 border-b">
            <SheetTitle>Shopping Cart</SheetTitle>
            <CartOptions settings={settings} onSettingsChange={onSettingsChange} />
          </SheetHeader>

          <ScrollArea className="flex-1 -mx-6">
            <div className="px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <AnimatedCartIcon itemCount={0} className="w-12 h-12 text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4 divide-y">
                  {items.map((item) => (
                    <CartItem
                      key={item._id}
                      item={item}
                      settings={settings}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemoveItem={onRemoveItem}
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {items.length > 0 && (
            <div className="border-t pt-4 mt-auto">
              <CartTotals items={items} settings={settings} />
              <Button
                className="w-full mt-4"
                size="lg"
                onClick={() => setIsCheckoutOpen(true)}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <CheckoutDialog
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        items={items}
        onSubmit={onCheckout}
        form={form}
      />

    </>
  );
}