'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const currencies = [
  { value: 'USD', label: 'US Dollar' },
  { value: 'EUR', label: 'Euro' },
  { value: 'GBP', label: 'British Pound' },
]

const vatOptions = [
  { value: '0', label: '0%' },
  { value: '5', label: '5%' },
  { value: '10', label: '10%' },
  { value: '15', label: '15%' },
  { value: '20', label: '20%' },
]
interface CurrencyAndVatAndAmountType{
  form:any;
  totalAmount:number;
  netAmount :number ;
  vatAmount :number;
  finishAmount :number;
}
export default function CurrencyAndVatAndAmount({form,totalAmount,netAmount,vatAmount,finishAmount}:CurrencyAndVatAndAmountType) {

  

  const { watch, control } = form


 

  const currency = watch('currency')
  const vatRate = watch('vatRate') ? watch('vatRate') : 0
  const includeVat = watch('includeVat')
  

  

  return (
    <Card>
        <div className='p-4'>
          <div className="space-y-2">
            <FormField
              control={control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount {includeVat ? '(inc. VAT)' : '(exc. VAT)'}</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                    <div className="w-full pl-3 pr-4 py-2text-2xl font-bold flex items-center  h-14 rounded-md  border  border-foreground/10">{finishAmount} {currency}</div>
                      <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger   className="w-[120px] pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]" >
                              <SelectValue placeholder="Currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 mt-2">
            <FormField
              control={control}
              name="vatRate"
              render={({ field }) => (
                <FormItem >
                  <FormLabel>VAT Rate</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={"0"}>
                    <FormControl                          className="w-full pl-3 pr-4 py-2   h-14 rounded-md  inputCustom focus:outline-none focus:ring-1 focus:bg-[#262525]"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select VAT rate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vatOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 mt-2">
            <Label>Net Amount</Label>
            <div  className="w-full pl-3 pr-4 py-2text-2xl font-bold flex items-center  h-14 rounded-md border  border-foreground/10">{netAmount} {currency}</div>
          </div>

          <div className="space-y-2 mt-2">
            <Label>VAT Amount</Label>
            <div className="w-full pl-3 pr-4 py-2text-2xl font-bold flex items-center  h-14 rounded-md  border  border-foreground/10">{vatAmount} {currency}</div>
          </div>
        </div>

        <FormField
          control={control}
          name="includeVat"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md  p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Price includes VAT
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
     </Card>
  )
}

