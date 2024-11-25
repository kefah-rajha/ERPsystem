export interface Product {
    id: number
    name: string
    category: string
    price: number
    stock: number
    image: string
    sku?: string
  }
  

  
  export type VATOption = {
    value: string
    label: string
    rate: number
  }