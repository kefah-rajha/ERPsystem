interface TotalAmountProps {
    amount: number
  }
  
  export function TotalAmount({ amount }: TotalAmountProps) {
    return (
      <div className="flex justify-end pt-4 border-t">
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Total Amount</div>
          <div className="text-2xl font-bold">
            ${amount.toFixed(2)}
          </div>
        </div>
      </div>
    )
  }