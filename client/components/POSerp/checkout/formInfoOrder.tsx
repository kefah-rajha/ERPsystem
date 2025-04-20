"use client";

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
import { SalesOrderProductsSelectedProvider } from "@/context/saleOrderSelectedProducts";
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast

import { cn } from "@/lib/utils";
import AddProductButton from "@/components/SalesOrder/addProductButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductSalesOrder } from "@/dataType/dataTypeSalesOrder/dataTypeSalesOrder";
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
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import ProductSelected from "@/components/SalesOrder/ProductSelected";
import CurrencyAndVatAndAmount from "@/components/SalesOrder/CurrencyAndVatAndAmount";
import { stringify } from "querystring";

interface ProductAttribute {
  _id: string;
  name: string;
  SKU: string;
  brandName: string;
  productTag: string;
  price: number;
  Discount: string;
  stock: string,
  SupplierName: string;
  salesCode: string;
  purchaseCode: string;
  supplierCode: string;
  trackInventory: boolean;
  allowOutOfStock: boolean;
  Description: string;
  vat: string;
  categories: string;
  subCategories: string[];
  photos: string[]
}
type CartItem = ProductAttribute & {
  quantity: number;
};
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
const paymentTermOptions = [
  "Cash",
  "Card",
  "Bank Transfers",
  "Checks",
  "Electronic Payments",
  "Deferred Payments",
] as const; 
const statusOptions = [
  'pending',
  'processed',
  'completed',
  'cancelled',
] as const; 

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
      .z.enum(paymentTermOptions, ({
        required_error: "Please select a payment term.",
      })),
      status: z.enum(statusOptions, {
        required_error: "Please select a status.",
      }),
  shipmentDate: z.date({
    required_error: "Shipment date is required",
  }),
  orderDate: z.date({
    required_error: "Order date is required",
  }).default(new Date()),
  currency: z.string().min(1, "Please select a currency").default('USD'),
  vatRate: z.string().min(1, "Please select a VAT rate").default('0'),
  includeVat: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

// Simulated database of customers
type FormInfoOrderDataType = {
  items: CartItem[]
  subAmount: number
  total: number
  currency: string
  vatGeneral: number
}
export default function FormInfoOrder({ items, subAmount, total, currency, vatGeneral }: FormInfoOrderDataType) {
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openSupplier, setOpenSupplier] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [userNameCustomerSelected, setUserNameCustomerSelected] = useState<string>("");
  const [supplierSearchResults, setSupplierSearchResults] = useState<
    {
      firstName: string;
      lastName: string;
    }[]
  >([]);
  const [customerSearchResults, setCustomerSearchResults] = useState<customerSearchResultsDataTypeArray>([]);
  const [customer, setCustomer] = useState<customerSearchResultsDataType>();
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingSupplier, setIsSearchingSupplier] = useState(false);
  const [confirmSelectedProduct, setConfirmSelectedProduct] = useState<ProductSalesOrder[] | []>([]);
  const [calculatedValues, setCalculatedValues] = useState({
    netAmount: 0,
    vatAmount: 0,
  });
  const [finishAmount, setFinishAmount] = useState<number>(0);
  const confirmSelectedProductFUN = (productSelected: ProductSalesOrder[]) => {
    setConfirmSelectedProduct(productSelected);
  };
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const getTotalAmount = (amount: number) => {
    setTotalAmount(amount);
  };

  // Store OrderProductsSelectToSendApi in a state variable to prevent it from becoming empty
  const [orderProductsData, setOrderProductsData] = useState<itemsOrderSendToApiType[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = form;
  console.log(errors, "errors");

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

  const handleOrderProductsSelected = () => {
    if (items && items.length > 0) {
      const itemsProducts = items.map(item => ({
        product: item._id,
        quantity: +item.quantity,
        vat: +item.vat,
        vatAmount: (+item.price * +item.quantity) * (+item.vat / 100),
        totalAmount: (+item.price * +item.quantity) + (+item.price * +item.quantity) * (+item.vat / 100),
      }));
      setOrderProductsData(itemsProducts);
      console.log("Updated orderProductsData:", itemsProducts);
    }
  };

  useEffect(() => {
    handleOrderProductsSelected();
  }, [items]);

  async function onSubmit(valuesForm: FormValues) {
    setIsSubmitting(true);
    
    // Show loading toast
    const loadingToast = toast.loading('Processing your order...');
    
    try {
      valuesForm.currency = currency;
      valuesForm.vatRate = String(vatGeneral);
      valuesForm.includeVat = true;

      const values = {
        ...valuesForm,
        netAmount: subAmount,
        vatAmount: total - subAmount,
        totalAmount: total
      };

      // Make sure we're using the state value, not an empty array
      if (orderProductsData.length === 0) {
        toast.error('No products selected!', { id: loadingToast });
        setIsSubmitting(false);
        return;
      }

      const data = {
        values: values,
        items: orderProductsData
      };
      
      console.log(data, "data");

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

      // Show success toast
      toast.success('Sales order created successfully!', { id: loadingToast });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error('Something went wrong. Please try again.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  
  return (
    <div className="text-foreground mb-6">
      {/* Add the Toaster component for rendering toast notifications */}
      <Toaster position="top-right" />
      
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Save Sales Order'
              )}
            </Button>

            <div className="flex gap-4">
              <div className="w-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customer"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Customer</FormLabel>
                          <Popover
                            open={openCustomer}
                            onOpenChange={setOpenCustomer}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openCustomer}
                                  className={cn(
                                    "w-full justify-between  pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]",
                                    !field.value &&
                                    "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? customerSearchResults.find(
                                      (customer) =>
                                        customer.userName ===
                                        field.value
                                    )?.userName
                                    : "Select customer"}
                                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search customer..."
                                  onValueChange={setCustomerSearchQuery}
                                />
                                {isSearching ? (
                                  <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  </div>
                                ) : (
                                  <>
                                    <CommandEmpty>
                                      No customer found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {customerSearchResults?.map(
                                        (customer) => (
                                          <CommandItem
                                            value={customer.userName}
                                            key={customer.userName}
                                            onSelect={() => {
                                              setUserNameCustomerSelected(
                                                customer.userName
                                              );
                                              form.setValue(
                                                "customer",
                                                customer.userName
                                              );
                                              setOpenCustomer(false);
                                            }}
                                          >
                                            <CheckIcon
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                customer.userName ===
                                                  field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {customer.userName}
                                          </CommandItem>
                                        )
                                      )}
                                    </CommandGroup>
                                  </>
                                )}
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shipmentAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipment Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter shipment address"
                              {...field}
                              className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="supplier"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Supplier</FormLabel>
                          <Popover
                            open={openSupplier}
                            onOpenChange={setOpenSupplier}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openSupplier}
                                  className={cn(
                                    "w-full justify-between  pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]",
                                    !field.value &&
                                    "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? supplierSearchResults.find(
                                      (supplier) =>
                                        supplier.firstName ===
                                        field.value
                                    )?.firstName
                                    : "Select customer"}
                                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search customer..."
                                  onValueChange={setSupplierSearchQuery}
                                />
                                {isSearchingSupplier ? (
                                  <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  </div>
                                ) : (
                                  <>
                                    <CommandEmpty>
                                      No customer found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {supplierSearchResults.map(
                                        (supplier) => (
                                          <CommandItem
                                            value={supplier.firstName}
                                            key={supplier.firstName}
                                            onSelect={() => {
                                              setUserNameCustomerSelected(
                                                supplier.firstName
                                              );
                                              form.setValue(
                                                "supplier",
                                                supplier.firstName
                                              );
                                              setOpenSupplier(false);
                                            }}
                                          >
                                            <CheckIcon
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                customer?.userName ===
                                                  field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {supplier.firstName}
                                          </CommandItem>
                                        )
                                      )}
                                    </CommandGroup>
                                  </>
                                )}
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salesManager"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sales Manager</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter sales manager"
                              {...field}
                              className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter customer contact"
                              {...field}
                              className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Enter phone number"
                              {...field}
                              className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Term</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]">
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment term" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {paymentTermOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]">
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {/* Map over statusOptions directly */}
                              {statusOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {/* You can display the option as is, or format it (e.g., capitalize first letter) */}
                                  {option.charAt(0).toUpperCase() + option.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shipmentDate"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Shipment Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal  pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525] ",
                                    !field.value &&
                                    "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}