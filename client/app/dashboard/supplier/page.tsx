"use client"

import SuppliersTable from "@/components/supplier/suppliersTable"
import CreateSupplierButton from "@/components/supplier/button/CreateSupplierButton"
import ImportUsers from "@/components/user/Button/ImportUsers"
import SupplierFilter from  "@/components/supplier/button/supplierFilter"
import { SupplierProvider } from "@/context/supplierContext"





function Page() {
  
  return (
    <div className='  heighWithOutBar pt-4'>
      <SupplierProvider>
        <div className='h-14 flex items-center container justify-end gap-2'>
        <CreateSupplierButton/>
           <SupplierFilter/>  
          
          {/* <ImportUsers/> */}
                 
          
         
        </div>
         <SuppliersTable/> 
        </SupplierProvider>
    </div>
  )
}

export default Page


