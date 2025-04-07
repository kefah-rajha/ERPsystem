import * as z from "zod";

export const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  supplierName: z.string().min(2, "Supplier name must be at least 2 characters"),
  orderDate: z.date({
    required_error: "Order date is required",
  }),
  phoneNumber: z.string().regex(
    /^([+]?\d{1,2}[-\s]?|)\d{3}[-\s]?\d{3}[-\s]?\d{4}$/,
    "Invalid phone number format"
  ),
  email: z.string().email("Invalid email address"),
  address: z.string().min(10, "Address must be at least 10 characters"),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;