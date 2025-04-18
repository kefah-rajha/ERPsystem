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
import { toast as hotToast, Toaster } from "react-hot-toast"; // Added react-hot-toast

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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import ProductSelected from "@/components/SalesOrder/ProductSelected";
import CurrencyAndVatAndAmount from "@/components/SalesOrder/CurrencyAndVatAndAmount";
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
  }),
  currency: z.string().min(1, "Please select a currency"),
  vatRate: z.string().min(1, "Please select a VAT rate"),
  includeVat: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function SalesOrderManagement() {
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openSupplier, setOpenSupplier] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [userNameCustomerSelected, setUserNameCustomerSelected] =
    useState<string>("");
  const [supplierNameSelected, setSupplierNameSelected] = useState<string>(""); // Added for supplier tracking
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
  const [confirmSelectedProduct, setConfirmSelectedProduct] = useState<
    ProductSalesOrder[] | []
  >([]);
  const [calculatedValues, setCalculatedValues] = useState({
    netAmount: 0,
    vatAmount: 0,
  });
  const [finishAmount, setFinishAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for submit button state

  const confirmSelectedProductFUN = (productSelected: ProductSalesOrder[]) => {
    setConfirmSelectedProduct(productSelected);
  };
  
  const [totalAmount, setTotalAmount] = useState<number>(0);
  
  const getTotalAmount = (amount: number) => {
    setTotalAmount(amount);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const searchCustomers = async () => {
      if (customerSearchQuery) {
        setIsSearching(true);
        try {
          const response = await fetch(
            `/api/searchCustomer?name=${customerSearchQuery}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch customers");
          }
          const customers = await response.json();
          setCustomerSearchResults(customers.data);
        } catch (error) {
          console.error("Error fetching customers:", error);
          hotToast.error("Failed to fetch customers. Please try again.");
          setCustomerSearchResults([]);
        } finally {
          setIsSearching(false);
        }
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

  const { watch } = form;

  const vatRate = watch('vatRate') ? watch('vatRate') : 0;
  const includeVat = watch('includeVat');

  useEffect(() => {
    const vat = +vatRate / 100;
    let netAmount: number, vatAmount: number;

    if (includeVat) {
      vatAmount = +(totalAmount * vat).toFixed(2);
      netAmount = totalAmount;
      setFinishAmount(totalAmount + +vatAmount);
    } else {
      netAmount = totalAmount;
      vatAmount = +(totalAmount * vat).toFixed(2);
      setFinishAmount(totalAmount);
    }

    setCalculatedValues({
      netAmount,
      vatAmount,
    });
  }, [totalAmount, vatRate, includeVat]);

  useEffect(() => {
    const searchSuppliers = async () => {
      if (supplierSearchQuery) {
        setIsSearchingSupplier(true);
        try {
          const response = await fetch(
            `/api/searchSupplier?name=${supplierSearchQuery}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch suppliers");
          }
          const suppliers = await response.json();
          setSupplierSearchResults(suppliers.data);
        } catch (error) {
          console.error("Error fetching suppliers:", error);
          hotToast.error("Failed to fetch suppliers. Please try again.");
          setSupplierSearchResults([]);
        } finally {
          setIsSearchingSupplier(false);
        }
      } else {
        setSupplierSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchSuppliers, 300);
    return () => clearTimeout(debounceTimer);
  }, [supplierSearchQuery]);

  interface itemsOrder {
    quantity: number;
    vat: number;
    vatAmount: number;
    totalAmount: number;
    _id: string;
    name: string;
    SKU: string;
    brandName: string;
    productTag: string;
    price: string;
    Discount: string;
    SupplierName: string;
    salesCode: string;
    purchaseCode: string;
    supplierCode: string;
    Description: string;
    stock: string;
  }

  const OrderProductsSelectToSendApi: itemsOrderSendToApiType[] = [];
  
  const handleOrderProductsSelected = (OrderProductsSelected: itemsOrder[]) => {
    // Clear previous selections
    OrderProductsSelectToSendApi.length = 0;
    
    const products = OrderProductsSelected?.map(product => ({
      product: product._id,
      quantity: product.quantity,
      vat: product.vat,
      vatAmount: product.vatAmount,
      totalAmount: product.totalAmount,
    }));
    
    OrderProductsSelectToSendApi.push(...products);
  };

  async function onSubmit(valuesForm: FormValues) {
    setIsSubmitting(true);
    
    try {
      const values = {
        ...valuesForm,
        netAmount: calculatedValues.netAmount,
        vatAmount: calculatedValues.vatAmount,
        totalAmount: finishAmount
      };

      const data = {
        values: values,
        items: OrderProductsSelectToSendApi
      };

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
      
      if (!FetchData.ok) {
        throw new Error("Failed to create sales order");
      }
      
      const res = await FetchData.json();
      
      // Show success notification
      hotToast.success("Sales order created successfully!");
      
      // Reset form or redirect if needed
      // You might want to reset the form here or redirect to another page
      
    } catch (error) {
      console.error("Error submitting form:", error);
      hotToast.error("Failed to create sales order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

 
  return (
    <SalesOrderProductsSelectedProvider>
      <div className="heighWithOutBar bg-background text-foreground bg-gradient overflow-auto">
        {/* Add React Hot Toast Container */}
        <Toaster position="top-right" />
        
        <div className="container mx-auto p-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Sales Order</CardTitle>
              <CardDescription>Create or edit a sales order</CardDescription>
            </CardHeader>
            <CardContent>
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
                        Saving...
                      </>
                    ) : (
                      "Save Sales Order"
                    )}
                  </Button>
                  
                  <div className="flex gap-4">
                    <div className="w-3/4 space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Order Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="customer"
                            render={({ field }) => (
                              <FormItem>
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
                                          "w-full justify-between pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]",
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
                                    className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
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
                              <FormItem>
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
                                          "w-full justify-between pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]",
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
                                          : "Select supplier"}
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                      <CommandInput
                                        placeholder="Search Supplier..."
                                        onValueChange={setSupplierSearchQuery}
                                      />
                                      {isSearchingSupplier ? (
                                        <div className="flex items-center justify-center p-4">
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                      ) : (
                                        <>
                                          <CommandEmpty>
                                            No supplier found.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            {supplierSearchResults.map(
                                              (supplier) => (
                                                <CommandItem
                                                  value={supplier.firstName}
                                                  key={supplier.firstName}
                                                  onSelect={() => {
                                                    setSupplierNameSelected(
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
                                                      supplier.firstName === field.value
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
                                    className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
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
                                    className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
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
                                    className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
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
                                  <FormControl className="w-full pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]">
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
                              <FormItem>
                                <FormLabel>Shipment Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525] ",
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

                    <div className="w-1/4 space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Order Date</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <FormField
                            control={form.control}
                            name="orderDate"
                            render={({ field }) => (
                              <FormItem>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525] ",
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
                                        date > new Date() ||
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
                      <CurrencyAndVatAndAmount
                        form={form}
                        totalAmount={totalAmount}
                        netAmount={calculatedValues.netAmount}
                        vatAmount={calculatedValues.vatAmount}
                        finishAmount={finishAmount} 
                      />
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <Card className="mt-2 py-5">
            <CardContent>
              <AddProductButton />
              <ProductSelected 
                getTotalAmount={getTotalAmount} 
                handleOrderProductsSelected={handleOrderProductsSelected} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </SalesOrderProductsSelectedProvider>
  );
}