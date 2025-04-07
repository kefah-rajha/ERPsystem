"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CartItem } from "@/dataType/posDataType";
import { checkoutFormSchema, type CheckoutFormValues } from "@/lib/schemas/checkout";
import { ScrollArea } from "@/components/ui/scroll-area"

import {
  CalendarIcon,
  CarIcon as CaretSortIcon,
  Check,
  CheckIcon,
  ChevronsUpDown,
  Loader2,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
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

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onSubmit: (data: CheckoutFormValues) => void;
  form: any
}



export default function CheckoutDialog({
  open,
  onOpenChange,
  items,
  onSubmit,
  form
}: CheckoutDialogProps) {


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






  const handleSubmit = (data: CheckoutFormValues) => {
    onSubmit(data);
    onOpenChange(false);
    form.reset();
  };
  const paymentTermOptions = [
    "Cash",
    "Card",
    "Bank Transfers",
    "Checks",
    "Electronic Payments",
    "Deferred Payments",
  ];


  return (
    <Dialog open={false} onOpenChange={onOpenChange} >
    <DialogContent className="w-[70%] h-[90vh] bg-gradient overflow-auto" >
      <Form {...form} >
        <form onSubmit={form.handleSubmit(handleSubmit)} >
          <div className="gap-4">
            <div className="space-y-4">
            <FormField
      control={form.control}
      name="customer"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Customer</FormLabel>
          <Popover open={openCustomer} onOpenChange={setOpenCustomer} >
            <PopoverTrigger asChild>
              <FormControl>
                <div>
                  <Input
                    placeholder="Select customer"
                    className={cn(
                      "w-full pl-3 pr-10 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]",
                      !field.value && "text-muted-foreground"
                    )}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setCustomerSearchQuery(e.target.value);
                      if (!openCustomer) setOpenCustomer(true);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-9 h-8 w-8 p-0"
                    onClick={() => setOpenCustomer(!openCustomer)}
                  >
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </div>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" style={{ zIndex: 9999 }} align="start">
              <div className="flex flex-col"   style={{ zIndex: 9999 }}              
              >
                {isSearching ? (
                  <div className="flex justify-center items-center p-4" style={{ zIndex: 9999 }}>
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  </div>
                ) : setCustomerSearchResults.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">No customers found</p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-80 "style={{ zIndex: 9999 }}>
                    {customerSearchResults?.map((customer:any) => (
                      <div
                        key={customer._id}
                        style={{ zIndex: 9999 }}
                        className={cn(
                          "flex items-center p-2 cursor-pointer hover:bg-accent",
                          field.value === customer.userName && "bg-accent"
                        )}
                        onClick={() => {
                          field.onChange(customer.userName);
                          setOpenCustomer(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === customer.userName ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span>{customer.userName}</span>
                      </div>
                    ))}
                  </ScrollArea>
                )}
              </div>
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
                    <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSupplier}
                            className={cn(
                              "w-full justify-between pl-3 pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? supplierSearchResults.find((supplier) => supplier.firstName === field.value)
                                  ?.firstName
                              : "Select supplier"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        {/* Key fix: Make Command a controlled component with proper event handling */}
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Search supplier..."
                            value={supplierSearchQuery}
                            onValueChange={(value) => {
                              setSupplierSearchQuery(value)
                            }}
                            className="h-9"
                            autoFocus
                          />
                          {isSearchingSupplier ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            <>
                              <CommandEmpty>No supplier found.</CommandEmpty>
                              <CommandGroup>
                                {supplierSearchResults.map((supplier) => (
                                  <CommandItem
                                    value={supplier.firstName}
                                    key={supplier.firstName}
                                    onSelect={() => {
                                      setUserNameCustomerSelected(supplier.firstName)
                                      form.setValue("supplier", supplier.firstName)
                                      setOpenSupplier(false)
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        supplier.firstName === field.value ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {supplier.firstName}
                                  </CommandItem>
                                ))}
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

              {/* Remaining form fields */}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              "w-full pl-3 text-left font-normal pr-4 py-2 h-14 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Save Sales Order</Button>
            </div>
          </div>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
  );
}