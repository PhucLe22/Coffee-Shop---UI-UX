"use client";

import * as React from "react";
import { format as dateFnsFormat } from "date-fns";
import { DayPicker } from "react-day-picker";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CALENDAR_CLASSES = {
  root: "p-3",
  months: "flex flex-col",
  month: "flex flex-col",
  month_caption: "hidden",
  caption_label: "hidden",
  nav: "hidden",
  button_previous: "hidden",
  button_next: "hidden",
  chevron: "hidden",
  weekday: "text-text-muted font-normal text-xs text-center pb-1 w-[36px]",
  day: "p-0 text-center",
  day_button:
    "mx-auto h-8 w-8 text-sm rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors",
  selected: "bg-brand-primary text-white hover:bg-brand-primary hover:text-white",
  today: "font-bold",
  outside: "text-text-muted opacity-50",
  disabled: "text-text-muted opacity-50",
  hidden: "invisible",
  dropdowns: "hidden",
  dropdown: "hidden",
  dropdown_root: "hidden",
  months_dropdown: "hidden",
  years_dropdown: "hidden",
  month_grid: "w-full border-collapse",
  weeks: "",
  week: "",
} as const;

interface DatePickerProps {
  value?: string | null;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
}

export const DatePicker = ({
  value,
  onChange,
  className,
  placeholder = "Pick a date",
  id,
  disabled,
}: DatePickerProps) => {
  const [open, setOpen] = React.useState(false);

  const date = value ? new Date(value + "T00:00:00") : undefined;

  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    date ?? new Date(),
  );

  const years = React.useMemo(() => {
    const start = new Date(2020, 0).getFullYear();
    const end = new Date(2030, 11).getFullYear();
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, []);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formatted = dateFnsFormat(selectedDate, "yyyy-MM-dd");
      onChange?.(formatted);
      setCurrentMonth(selectedDate);
      setOpen(false);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), Number(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(new Date(Number(e.target.value), currentMonth.getMonth(), 1));
  };

  const displayValue = value
    ? dateFnsFormat(new Date(value + "T00:00:00"), "MMM dd, yyyy")
    : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          className={cn(
            "flex h-14 w-full items-center justify-between rounded-md bg-surface-muted px-md py-sm text-body-md-reg",
            "border-0 hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
            !displayValue && "text-muted-foreground",
            className,
          )}
        >
          <span className={cn(value ? "text-text-primary" : "text-text-muted")}>
            {displayValue || placeholder}
          </span>
          <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="max-h-[300px] overflow-y-auto">
          <div className="flex items-center gap-1 border-b border-border p-3 pb-2">
            <select
              value={currentMonth.getMonth()}
              onChange={handleMonthChange}
              className="flex-1 rounded-md border-0 bg-surface-muted px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              {MONTHS.map((month, i) => (
                <option key={month} value={i}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={currentMonth.getFullYear()}
              onChange={handleYearChange}
              className="w-[88px] rounded-md border-0 bg-surface-muted px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <DayPicker
            mode="single"
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            selected={date}
            onSelect={handleSelect as any}
            classNames={CALENDAR_CLASSES as any}
            disableNavigation
            startMonth={new Date(2020, 0)}
            endMonth={new Date(2030, 11)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
