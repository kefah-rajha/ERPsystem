import React from 'react'

interface HeaderContentType{
    content:string
}
function Headersignup({content}:HeaderContentType) {
  return (
    <h2 className='sm:text-[56px] text-[36px] font-bold text-foreground flex items-center justify-center mb-[16px] mt-[8px]'>
        {content}
    </h2>
  )

}

export default Headersignup