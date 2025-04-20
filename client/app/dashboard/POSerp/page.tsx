"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { CartItem, Product, Order } from '@/dataType/posDataType';
import CategoryList from '@/components/POSerp/CategoryList';
import ProductGrid from '@/components/POSerp/ProductGrid';
import ShoppingCartSheet from '@/components/POSerp/ShoppingCartSheet';
import OrdersList from '@/components/POSerp/orders/OrdersList';
import { useFilteredProducts } from '@/hooks/useFilteredProducts';
import { currencies } from '@/lib/data/currencies';
import { CheckoutFormValues } from '@/lib/schemas/checkout';
import { categoriesResponseData } from "@/dataType/dataTypeCategory/dataTypeCategory";
import ProductFilter from "@/components/product/productFilter"
import FormInfoOrder from '@/components/POSerp/checkout/formInfoOrder';
import { calculateItemTotal, calculateCartTotals, formatPrice } from '@/lib/price-utils';
import { PaginationControls } from "@/components/SalesOrder/showAllSalesOrder/pagination-controls";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import getNumberProductsServer from "@/lib/ProductFetch/getNumberProducts";
import CollapsibleCard from "@/components/SalesOrder/showAllSalesOrder/CollapsibleCard";
import { cn } from '@/lib/utils';



export default function App() {
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<categoriesResponseData[]>([]);
  const [numberProducts, setNumberProducts] = useState<number>(0);
  const [countPages, setCountPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState({
    currency: currencies[0],
    customVatRate: null as number | null,
  });
   console.log(settings.currency)
  const [products, setProducts] = useState<
    [ProductAttribute] | undefined | ProductAttribute[]
  >([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSetProducts = useCallback((newProducts: ProductAttribute[]) => {
    setProducts(newProducts);
  }, [setProducts]);
useEffect(()=>{
},[])
  console.log(cartItems, "products")
  useEffect(() => {
    let ignore = false;
    fetch("/api/category/getAllCategories")
      .then((res) => {
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          console.log(jsonData, "getCategories");

          setCategories(jsonData.data);
        }
      })
      .catch((err: unknown) => {
        console.log(err);
      })
      .finally(() => {
        if (!ignore) {
          console.log("noLoding");
        }
      });
    return () => {
      ignore = true;
    };
  }, []);
    useEffect(() => {
      const getNumberProducts = async () => {
        const resNumberProduct = await getNumberProductsServer();
        console.log(resNumberProduct, "resproduct");
        if (resNumberProduct?.data) {
          setNumberProducts(resNumberProduct.data);
          console.log(resNumberProduct, "resNumberProduct.count")
          const totalPages = Math.ceil(resNumberProduct.data / pageSize);
          console.log(totalPages, pageSize, "totalPages1111");
          setCountPages(totalPages);
  
        }
      };
      getNumberProducts();
    }, [pageSize]);

console.log(cartItems,"cartItems")

const handlePageChange = (page: number) => {
  setCurrentPage(page);
};
const handlePageSizeChange = (size: number) => {
  setPageSize(size);
  setCurrentPage(1); // Reset to first page when changing page size
};

  // const filteredProducts = useFilteredProducts(selectedCategory);
  // console.log(filteredProducts,"filteredProducts")
  type CartItem = ProductAttribute & {
    quantity: number;
  };

  const handleAddToCart = (product: ProductAttribute, quantity: number) => {
    console.log(product, "product", quantity)
    setCartItems((prevItems: CartItem[]) => {
      console.log(prevItems, "prevItems")
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    console.log(itemId, quantity, "itemId");
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };
  const onCheckout = (data: CheckoutFormValues) => {
    // Implement invoice generation logic
    console.log('Generating invoice for order:', data);
  };
  const handleGenerateInvoice = (orderId: string) => {
    // Implement invoice generation logic
    console.log('Generating invoice for order:', orderId);
  };

  const handleProcessPayment = (orderId: string) => {
    // Implement payment processing logic
    console.log('Processing payment for order:', orderId);
    
  };
   const netAmount = cartItems.map(item => 
      calculateItemTotal(
        item.price,
        item.quantity,
       +item.vat > 0? true : false,
        +item.vat || 0,
        settings.currency,
      )
    );
  
    const totalAmount = calculateCartTotals(netAmount, settings.customVatRate);


  return (
    <div className=" container bg-gradient heighWithOutBar pt-2 overflow-auto ">
      <header className=" shadow-sm sticky top-0 z-50 bg-[#272727]  rounded-sm">
        <div className="  px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold  dark:text-white">
            POS System
          </h1>
          <div className="flex items-center gap-4">
            <span className='mr-10'>Total : { totalAmount.total.toFixed(2) +" "+settings.currency.code  }</span>
            <ProductFilter
              pageNumber={currentPage}
              pageSize={pageSize}
              setProducts={handleSetProducts}
              selectedCategory={selectedCategory}
            />
            <OrdersList
              orders={orders}
              onGenerateInvoice={handleGenerateInvoice}
              onProcessPayment={handleProcessPayment}
            />
            <ShoppingCartSheet
              items={cartItems}
              settings={settings}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onSettingsChange={setSettings}
              onCheckout={onCheckout}
            />

          </div>
        </div>
      </header>

      <main className=" px-4 py-6">

    <FormInfoOrder
                  items={cartItems}
                  subAmount={totalAmount.subtotal}
                  total={totalAmount.total}
                  currency={settings.currency.code}
                  vatGeneral={settings.customVatRate || 0}
                  

    />

        
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
        />
              <Card className={cn(!isExpanded ? "sticky bottom-0 w-fit" : "sticky bottom-0 w-full")} >
                       <CardContent className="pt-6 pb-6 px-6">
                         <CollapsibleCard
                           numberProducts={numberProducts}
                           currentPage={currentPage}
                           countPages={countPages}
                           isExpanded={isExpanded}
                           setIsExpanded={setIsExpanded}
             
                         >
                           <PaginationControls
                             numberProducts={numberProducts}
                             countPages={countPages}
                             pageSize={pageSize}
                             currentPage={currentPage}
                             onPageChange={handlePageChange}
                             onPageSizeChange={handlePageSizeChange}
                           // disabled={loading}
                           />
                         </CollapsibleCard>
                       </CardContent>
                     </Card>
      </main>
    </div>
  );
}