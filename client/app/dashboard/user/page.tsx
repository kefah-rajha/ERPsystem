"use client"

import TableUser from "@/components/user/tableUser"
import CreateUserButton from "@/components/user/Button/CreateUserButton"
import ImportUsers from "@/components/user/Button/ImportUsers"
import UserFilter from  "@/components/user/Button/userFilter"
import { UserProvider } from "@/context/userContext"





function Page() {
  
  return (
    <div className='  heighWithOutBar pt-4'>
      <UserProvider>
        <div className='h-14 flex items-center container justify-end gap-2'>
          <UserFilter/>  
          <CreateUserButton/>
          <ImportUsers/>
                
          
         
        </div>
        <TableUser/>
        </UserProvider>
    </div>
  )
}

export default Page


