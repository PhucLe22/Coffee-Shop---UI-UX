"use client";

import * as React from "react";
import { format as dateFnsFormat } from "date-fns";
import { DayPicker } from "react-day-picker";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

const CALENDAR_CLASSES = {
  root: "p-3",
  months: "flex flex-col gap-1",
  month: "flex flex-col gap-2",
  month_caption: "flex justify-center gap-2 items-center h-8",
  caption_label: "text-sm font-medium",
  nav: "flex items-center justify-between px-1",
  button_previous: "inline-flex items-center justify-center rounded-md text-sm font-medium h-7 w-7 bg-transparent p-0 hover:bg-accent",
  button_next: "inline-flex items-center justify-center rounded-md text-sm font-medium h-7 w-7 bg-transparent p-0 hover:bg-accent",
  chevron: "h-4 w-4",
  weekday: "text-muted-foreground rounded-md w-8 font-normal text-xs text-center",
  day: "flex p-0",
  day_button: "mx-auto inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors",
  selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
  today: "bg-accent text-accent-foreground",
  outside: "text-muted-foreground opacity-50",
  disabled: "text-muted-foreground opacity-50",
  hidden: "invisible",
  dropdowns: "flex gap-1",
  dropdown: "bg-transparent text-sm font-medium border-0 outline-none focus:ring-2 focus:ring-ring rounded",
  dropdown_root: "flex items-center",
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

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formatted = dateFnsFormat(selectedDate, "yyyy-MM-dd");
      onChange?.(formatted);
      setOpen(false);
    }
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
        <DayPicker
          mode="single"
          selected={date}
          onSelect={handleSelect as any}
          classNames={CALENDAR_CLASSES as any}
          startMonth={new Date(2020, 0)}
          endMonth={new Date(2030, 11)}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
};
