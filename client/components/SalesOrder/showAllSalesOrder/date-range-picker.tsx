"use client";

import { CalendarIcon } from "lucide-react";
import { addDays, addMonths, addWeeks, format, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

interface DateRangePickerProps {
  date: DateRange;
  onDateChange: (date: DateRange) => void;
  className?: string;
}

const presets = [
  {
    label: "All Time",
    value: "all-time",
    getDate: () => ({
      from: new Date(0), // Earliest possible date (Unix epoch start)
      to: new Date(),    // Current date
    }),
  },
  {
    label: "Today",
    value: "today",
    getDate: () => ({
      from: startOfDay(new Date()),
      to: new Date(),
    }),
  },
  {
    label: "Last 7 days",
    value: "7-days",
    getDate: () => ({
      from: addDays(new Date(), -7),
      to: new Date(),
    }),
  },
  {
    label: "Last 15 days",
    value: "15-days",
    getDate: () => ({
      from: addDays(new Date(), -15),
      to: new Date(),
    }),
  },
  {
    label: "Last 30 days",
    value: "30-days",
    getDate: () => ({
      from: addDays(new Date(), -30),
      to: new Date(),
    }),
  },
  {
    label: "Last 3 months",
    value: "3-months",
    getDate: () => ({
      from: addMonths(new Date(), -3),
      to: new Date(),
    }),
  },
  {
    label: "Last 6 months",
    value: "6-months",
    getDate: () => ({
      from: addMonths(new Date(), -6),
      to: new Date(),
    }),
  },
  {
    label: "Last 1 year",
    value: "1-year",
    getDate: () => ({
      from: addMonths(new Date(), -12),
      to: new Date(),
    }),
  },
];

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  useEffect(()=>{
    onDateChange(presets[0].getDate())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center">
        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Date Range:</span>
      </div>
      <Select
        onValueChange={(value) => {
          const preset = presets.find((p) => p.value === value);
          if (preset) {
            onDateChange(preset.getDate());
          }
        }}
        defaultValue={presets[0].value}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="text-sm text-muted-foreground">
        {date?.from && date?.to ? (
          <>
            {format(date.from, "MMM dd, yyyy")} - {format(date.to, "MMM dd, yyyy")}
          </>
        ) : (
          "Select a date range"
        )}
      </div>
    </div>
  );
}