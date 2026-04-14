"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Hint text */
  hint?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Options to display */
  options: SelectOption[];
  /** Full width select */
  fullWidth?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      placeholder = "Select an option",
      options,
      fullWidth = true,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || React.useId();
    const hintId = hint ? `${selectId}-hint` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
            {props.required && (
              <span className="text-error ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              [hintId, errorId].filter(Boolean).join(" ") || undefined
            }
            className={cn(
              "flex h-11 w-full appearance-none border bg-white px-4 py-2 pr-10",
              "text-base text-neutral-900",
              "transition-colors duration-200 cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-0 focus:border-gold-600",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100",
              error
                ? "border-error focus:ring-error focus:border-error"
                : "border-neutral-300 hover:border-neutral-400",
              className
            )}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {hint && !error && (
          <p id={hintId} className="text-xs text-neutral-500">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-xs text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
