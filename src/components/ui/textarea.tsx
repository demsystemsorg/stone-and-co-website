"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Hint text */
  hint?: string;
  /** Full width textarea */
  fullWidth?: boolean;
  /** Show character count */
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      fullWidth = true,
      showCharCount = false,
      maxLength,
      disabled,
      id,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId();
    const hintId = hint ? `${textareaId}-hint` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;

    // Track character count
    const [charCount, setCharCount] = React.useState(
      String(value || defaultValue || "").length
    );

    // Extract onChange from props so we can chain with charCount tracking
    const { onChange: propsOnChange, ...restProps } = props;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      propsOnChange?.(e);
    };

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
            {restProps.required && (
              <span className="text-error ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={!!error}
          aria-describedby={
            [hintId, errorId].filter(Boolean).join(" ") || undefined
          }
          onChange={handleChange}
          className={cn(
            "flex min-h-[120px] w-full border bg-white px-4 py-3",
            "text-base text-neutral-900 placeholder:text-neutral-400",
            "transition-colors duration-200 resize-y",
            "focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-0 focus:border-gold-600",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100",
            error
              ? "border-error focus:ring-error focus:border-error"
              : "border-neutral-300 hover:border-neutral-400",
            className
          )}
          {...restProps}
        />

        <div className="flex justify-between items-center">
          <div>
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

          {showCharCount && maxLength && (
            <p
              className={cn(
                "text-xs",
                charCount >= maxLength ? "text-error" : "text-neutral-400"
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
