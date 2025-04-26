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
import { toast, Toaster } from "react-hot-toast";

import { cn } from "@/lib/utils";
import AddProductButton from "@/components/puchaseOrder/addProductButton";
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
import { usePathname } from "next/navigation";
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
import ProductSelected from "@/components/puchaseOrder/ProductSelected";
import CurrencyAndVatAndAmount from "@/components/SalesOrder/CurrencyAndVatAndAmount";
import { Textarea } from "@/components/ui/textarea";
import { PurchaseOrderProductsSelectedProvider } from "@/context/pucahseOrderProducts";

interface ContactInfoSupplierSearchResultsDataType {
    _id: string;
    phone: string;
    address: string;
    supplierEmail: string;
    contactPerson: string;
    taxId: string;
}

interface supplierSearchResultsDataType {
    createdAt: Date,
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    website: string;
    companyName: string;
    defaultTax: string;
    phone: string;
    mailingAddress: string;
    postCodeMiling: string;
    cityMiling: string;
    streetMiling: string;
    mailingCountry: string;
    address: string;
    postCode: string;
    city: string;
    street: string;
    country: string
}

type supplierSearchResultsDataTypeArray = supplierSearchResultsDataType[];

interface itemsOrderSendToApiType {
    quantity: number;
    unitPrice: number;
    vat: number;
    vatAmount: number;
    totalAmount: number;
    product: string;
}

interface PurchaseOrderItemType {
    product: {
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
        allowOutOfStock: boolean;
        trackInventory: boolean;
        __v: number;
    };
    quantity: number;
    unitPrice: number;
    vat: number;
    vatAmount: number;
    totalAmount: number;
    _id: string;
}

interface PurchaseOrderType {
    _id: string;
    purchaseOrderNumber: string;
    orderDate: string;
    expectedDeliveryDate: string;
    requestedBy: string;
    supplier: {
        name: string;
        contactPerson: string;
        supplierEmail: string;
        phone: string;
        address: string;
        taxId: string;
    };
    shippingAddress: string;
    items: PurchaseOrderItemType[];
    netTotal: number;
    totalVat: number;
    totalAmount: number;
    status: string;
    notes: string;
    currency: string;
    paymentTerm: string;
    vatRate: number;
    createdAt: string;
    updatedAt: string;
}

interface itemsOrder {
    quantity: number;
    unitPrice: number;
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
    allowOutOfStock: boolean;
    trackInventory: boolean;
    __v: number;
}

const paymentTermOptions = [
    "Net 30",
    "Net 60",
    "Due on Receipt",
    "Cash On Delivery",
] as const;

const statusOptions = [
    "draft",
    "pending_approval",
    "approved",
    "ordered",
    "partially_received",
    "received",
    "cancelled",
] as const;

const formSchema = z.object({
    purchaseOrderNumber: z.string().min(1, { message: "PO number is required" }),
    supplier: z.string().min(1, { message: "Supplier is required" }),
    shippingAddress: z.string().min(1, { message: "Shipping address is required" }),
    requestedBy: z.string().min(1, { message: "Requester is required" }),
    supplierEmail: z.string().min(1, { message: "Supplier email is required" }),
    phone: z.string().min(1, { message: "Phone is required" }),
    paymentTerm: z.enum(paymentTermOptions, {
        required_error: "Please select a payment term.",
    }),
    status: z.enum(statusOptions, {
        required_error: "Please select a status.",
    }),
    expectedDeliveryDate: z.date({
        required_error: "Expected delivery date is required",
    }),
    orderDate: z.date({
        required_error: "Order date is required",
    }),
    currency: z.string().min(1, "Please select a currency"),
    vatRate: z.string().min(1, "Please select a VAT rate"),
    notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PurchaseOrderUpdate() {
    const [openSupplier, setOpenSupplier] = useState(false);
    const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
    const [supplierNameSelected, setSupplierNameSelected] = useState<string>("");
    const [supplierSearchResults, setSupplierSearchResults] = useState<
        supplierSearchResultsDataTypeArray
    >([]);
    const [supplier, setSupplier] = useState<supplierSearchResultsDataType>();
    const [isSearching, setIsSearching] = useState(false);
    const [confirmSelectedProduct, setConfirmSelectedProduct] = useState<
        ProductSalesOrder[] | []
    >([]);
    const [calculatedValues, setCalculatedValues] = useState({
        netTotal: 0,
        totalVat: 0,
    });
    const [finishAmount, setFinishAmount] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [purchaseOrderFetch, setPurchaseOrderFetch] = useState<PurchaseOrderType>({} as PurchaseOrderType);
    const [itemsProduct, setItemsProduct] = useState<itemsOrder[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    console.log(itemsProduct, "itemsProduct")

    const pathname = usePathname();
    const id = pathname?.split("/").pop();

    const confirmSelectedProductFUN = (productSelected: ProductSalesOrder[]) => {
        setConfirmSelectedProduct(productSelected);
    };

    const getTotalAmount = (amount: number) => {
        setTotalAmount(amount);
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "draft",

        }
    });

    // Fetch the purchase order data
    useEffect(() => {
        let ignore = false;
        
        setIsLoading(true);

        fetch(`/api/getPurchaseOrder/${id}`)
            .then((res) => {
                return res.json();
            })
            .then((jsonData) => {
                if (!ignore) {
                  

                    if (jsonData.success === false) {
                        toast.error(jsonData.error || 'Failed to load purchase order');
                        return;
                    }

                    console.log(jsonData.purchaseOrder, "purchase order details");
                    setPurchaseOrderFetch(jsonData.purchaseOrder);

                    // Map purchase order items to the format needed for ProductSelected component
                    setItemsProduct(jsonData.purchaseOrder.items.map((item: PurchaseOrderItemType) => ({
                        Description: item.product.Description,
                        Discount: item.product.Discount,
                        SKU: item.product.SKU,
                        SupplierName: item.product.SupplierName,
                        allowOutOfStock: item.product.allowOutOfStock,
                        brandName: item.product.brandName,
                        name: item.product.name,
                        price: item.product.price,
                        productTag: item.product.productTag,
                        purchaseCode: item.product.purchaseCode,
                        salesCode: item.product.salesCode,
                        stock: item.product.stock,
                        supplierCode: item.product.supplierCode,
                        trackInventory: item.product.trackInventory,
                        __v: item.product.__v,
                        _id: item.product._id,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalAmount: item.totalAmount,
                        vat: item.vat,
                        vatAmount: item.vatAmount,
                    })));
                    console.log(jsonData.purchaseOrder.supplier.name, "jsonData.purchaseOrder.supplier.firstName +''+jsonData.purchaseOrder.supplier.lastName")
                    // Set supplier name from fetched data
                    setSupplierNameSelected(jsonData.purchaseOrder.supplier.firstName + '' + jsonData.purchaseOrder.supplier.lastName);

                    // Set form values from fetched purchase order
                    form.reset({
                        purchaseOrderNumber: jsonData.purchaseOrder.purchaseOrderNumber,
                        supplier: jsonData.purchaseOrder.supplier.name,
                        shippingAddress: jsonData.purchaseOrder.shippingAddress,
                        requestedBy: jsonData.purchaseOrder.requestedBy || '',
                        supplierEmail: jsonData.purchaseOrder.supplier.supplierEmail || '',
                        phone: jsonData.purchaseOrder.supplier.phone || '',
                        paymentTerm: jsonData.purchaseOrder.paymentTerm as any,
                        status: jsonData.purchaseOrder.status as any,
                        expectedDeliveryDate: new Date(jsonData.purchaseOrder.expectedDeliveryDate),
                        orderDate: new Date(jsonData.purchaseOrder.orderDate),
                        currency: jsonData.purchaseOrder.currency || '',
                        vatRate: "0",
                        notes: jsonData.purchaseOrder.notes || '',
                    });

                    // Update calculated values and total amount
                    setCalculatedValues({
                        netTotal: jsonData.purchaseOrder.netTotal,
                        totalVat: jsonData.purchaseOrder.totalVat,
                    });
                    setFinishAmount(jsonData.purchaseOrder.totalAmount);
                    setTotalAmount(jsonData.purchaseOrder.netTotal);
                    toast.success('Purchase order loaded successfully');
                }
            })
            .catch((err: unknown) => {
                console.error(err);
                toast.error('Failed to load purchase order details');
            })
            .finally(() => {
                if (!ignore) {
                    setIsLoading(false);
                }
            });
        return () => {
            ignore = true;
        };
    }, [id, form]);

    useEffect(() => {
        const searchSuppliers = async () => {
            if (supplierSearchQuery) {
                setIsSearching(true);
                try {
                    const response = await fetch(
                        `/api/purchaseOrder/searchSupplier?name=${supplierSearchQuery}`
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch suppliers");
                    }
                    const suppliers = await response.json();
                    console.log(suppliers, "suppliers");
                    setSupplierSearchResults(suppliers.data);
                } catch (error) {
                    console.error("Error fetching suppliers:", error);
                    toast.error("Failed to fetch suppliers. Please try again.");
                    setSupplierSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSupplierSearchResults([]);
            }
        };

        const debounceTimer = setTimeout(searchSuppliers, 300);
        return () => clearTimeout(debounceTimer);
    }, [supplierSearchQuery]);

    useEffect(() => {
        if (supplierSearchResults?.length > 0) {
            const selectedSupplier = supplierSearchResults?.find(
                (supplier) => supplier?.firstName + '' + supplier?.lastName === supplierNameSelected
            );
            if (selectedSupplier !== undefined) {
                form.setValue(
                    "shippingAddress",
                    selectedSupplier?.address || ""
                );
                form.setValue("phone", selectedSupplier?.phone || "");
                form.setValue("supplierEmail", selectedSupplier?.email || "");
                setSupplier(selectedSupplier);
            }
        }
    }, [supplierSearchResults, form, supplierNameSelected]);

    const { watch } = form;


    const vatRate = watch('vatRate') ? watch('vatRate') : 0

    useEffect(() => {
        const vat = +vatRate / 100
        console.log(vat, "vat")
        let netAmount: number, vatAmount: number

        vatAmount = +(totalAmount * vat).toFixed(2)
        netAmount = totalAmount;
        setFinishAmount(totalAmount + +vatAmount)

        setCalculatedValues({
            netTotal: netAmount,
            totalVat: vatAmount,

        })
    }, [totalAmount, vatRate])


    const OrderProductsSelectToSendApi: itemsOrderSendToApiType[] = [];

    const handleOrderProductsSelected = (OrderProductsSelected: any[]) => {
        console.log(OrderProductsSelected,"OrderProductsSelected")
        // Clear previous selections
        OrderProductsSelectToSendApi.length = 0;

        const products = OrderProductsSelected?.map(product => ({
            product: product._id,
            quantity: product.quantity,
            unitPrice: parseFloat(product.price), // Add unit price for purchase orders
            vat: product.vat,
            vatAmount: product.vatAmount,
            totalAmount: product.totalAmount,
        }));
        console.log(products,"productsproducts")

        OrderProductsSelectToSendApi.push(...products);
    };

    async function onSubmit(valuesForm: FormValues) {
        setIsSubmitting(true);
        const loadingToast = toast.loading('Updating purchase order...');
        console.log(valuesForm, "valuesForm")
        try {
            const values = {
                ...valuesForm,
                netTotal: calculatedValues.netTotal,
                totalVat: calculatedValues.totalVat,
                totalAmount: finishAmount,
                supplier: {
                    name: supplierNameSelected,
                    contactPerson: supplier?.phone || purchaseOrderFetch.supplier?.contactPerson || "",
                    supplierEmail: supplier?.email || purchaseOrderFetch.supplier?.supplierEmail || "",
                    phone: supplier?.phone || purchaseOrderFetch.supplier?.phone || "",
                    address: supplier?.address || purchaseOrderFetch.supplier?.address || "",
                    taxId: purchaseOrderFetch.supplier?.taxId || "",
                }
            };

            const data = {
                values: values,
                items: OrderProductsSelectToSendApi
            };

            const FetchData = await fetch(`/api/purchaseOrder/updatePurchaseOrder/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(data),
            });

            toast.dismiss(loadingToast);

            if (!FetchData.ok) {
                const errorData = await FetchData.json();
                throw new Error(errorData.message || "Failed to update purchase order");
            }

            const res = await FetchData.json();

            if (res.success) {
                toast.success("Purchase order updated successfully!");
            } else {
                toast.error(res.message || "Failed to update purchase order");
            }

        } catch (error) {
            console.error("Error submitting form:", error);
            toast.dismiss(loadingToast);
            toast.error("Failed to update purchase order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading purchase order...</span>
            </div>
        );
    }

    return (
        <PurchaseOrderProductsSelectedProvider>
            <div className="heighWithOutBar bg-background text-foreground bg-gradient overflow-auto">
                <Toaster position="top-right" />

                <div className="container mx-auto p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Purchase Order</CardTitle>
                            <CardDescription>Create or edit a purchase order</CardDescription>
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
                                            "Save Purchase Order"
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
                                                        name="purchaseOrderNumber"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Purchase Order Number</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="PO Number"
                                                                        {...field}
                                                                        disabled
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
                                                                                {
                                                                                    field.value
                                                                                        ? (() => {
                                                                                            const foundSupplier = supplierSearchResults.find(
                                                                                                (supplier) =>
                                                                                                    supplier.firstName + '' + supplier.lastName === field.value
                                                                                            );

                                                                                            return foundSupplier
                                                                                                ? `${foundSupplier.firstName} ${foundSupplier.lastName}`
                                                                                                : field.value;
                                                                                        })()
                                                                                        :
                                                                                        "Select supplier"
                                                                                }
                                                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-[300px] p-0">
                                                                        <Command>
                                                                            <CommandInput
                                                                                placeholder="Search supplier..."
                                                                                onValueChange={setSupplierSearchQuery}
                                                                            />
                                                                            {isSearching ? (
                                                                                <div className="flex items-center justify-center p-4">
                                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                                </div>
                                                                            ) : (
                                                                                <>
                                                                                    <CommandEmpty>
                                                                                        No supplier found.
                                                                                    </CommandEmpty>
                                                                                    <CommandGroup>
                                                                                        {supplierSearchResults?.map(
                                                                                            (supplier) => (
                                                                                                <CommandItem
                                                                                                    value={supplier.firstName + '' + supplier.lastName}
                                                                                                    key={supplier._id}
                                                                                                    onSelect={() => {
                                                                                                        setSupplierNameSelected(
                                                                                                            supplier.firstName + '' + supplier.lastName
                                                                                                        );
                                                                                                        form.setValue(
                                                                                                            "supplier",
                                                                                                            supplier.firstName + '' + supplier.lastName
                                                                                                        );
                                                                                                        setOpenSupplier(false);
                                                                                                    }}
                                                                                                >
                                                                                                    <CheckIcon
                                                                                                        className={cn(
                                                                                                            "mr-2 h-4 w-4",
                                                                                                            supplier.firstName + '' + supplier.lastName ===
                                                                                                                field.value
                                                                                                                ? "opacity-100"
                                                                                                                : "opacity-0"
                                                                                                        )}
                                                                                                    />
                                                                                                    {supplier.firstName + '' + supplier.lastName}
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
                                                        name="shippingAddress"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Shipping Address</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Enter shipping address"
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
                                                        name="requestedBy"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Requested By</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Enter requester name"
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
                                                        name="supplierEmail"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Supplier Email</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Enter supplier email"
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
                                                                        {statusOptions.map((option) => (
                                                                            <SelectItem key={option} value={option}>
                                                                                {option.replace(/_/g, ' ').split(' ').map(word =>
                                                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                                                                ).join(' ')}
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
                                                        name="expectedDeliveryDate"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Expected Delivery Date</FormLabel>
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

                                                    <FormField
                                                        control={form.control}
                                                        name="notes"
                                                        render={({ field }) => (
                                                            <FormItem className="col-span-2">
                                                                <FormLabel>Notes</FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        placeholder="Add notes about this purchase order..."
                                                                        {...field}
                                                                        className="w-full pl-3 pr-4 py-2 rounded-md inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                                                                    />
                                                                </FormControl>
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
                                                netAmount={calculatedValues.netTotal}
                                                vatAmount={calculatedValues.totalVat}
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
                                itemsProduct={itemsProduct}
                                getTotalAmount={getTotalAmount}
                                handleOrderProductsSelected={handleOrderProductsSelected}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PurchaseOrderProductsSelectedProvider>

    );
}