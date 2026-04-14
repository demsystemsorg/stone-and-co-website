"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Hint text */
  hint?: string;
  /** Left icon/addon */
  leftAddon?: React.ReactNode;
  /** Right icon/addon */
  rightAddon?: React.ReactNode;
  /** Full width input */
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      hint,
      leftAddon,
      rightAddon,
      fullWidth = true,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
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
          {leftAddon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftAddon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              [hintId, errorId].filter(Boolean).join(" ") || undefined
            }
            className={cn(
              "flex h-11 w-full border bg-white px-4 py-2",
              "text-base text-neutral-900 placeholder:text-neutral-400",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-0 focus:border-gold-600",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100",
              error
                ? "border-error focus:ring-error focus:border-error"
                : "border-neutral-300 hover:border-neutral-400",
              leftAddon && "pl-10",
              rightAddon && "pr-10",
              className
            )}
            {...props}
          />

          {rightAddon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {rightAddon}
            </div>
          )}
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

Input.displayName = "Input";

export { Input };
