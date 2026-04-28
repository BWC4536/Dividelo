"use client";

import * as React from "react";
import { cn, getCurrencySymbol } from "@/lib/utils/cn";

interface CurrencyInputProps {
  value: number | string;
  onChange: (value: number) => void;
  currency?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function CurrencyInput({
  value,
  onChange,
  currency = "EUR",
  placeholder = "0,00",
  className,
  disabled,
  id,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState(
    value ? String(value).replace(".", ",") : ""
  );

  React.useEffect(() => {
    if (value !== undefined && value !== null && value !== "") {
      setDisplayValue(String(value).replace(".", ","));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d,]/g, "");
    setDisplayValue(raw);
    const numeric = parseFloat(raw.replace(",", "."));
    if (!isNaN(numeric)) {
      onChange(numeric);
    } else if (raw === "" || raw === ",") {
      onChange(0);
    }
  };

  const symbol = getCurrencySymbol(currency);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
        {symbol}
      </span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex h-9 w-full rounded-lg border border-input bg-background py-1 pr-3 pl-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono",
          className
        )}
      />
    </div>
  );
}
