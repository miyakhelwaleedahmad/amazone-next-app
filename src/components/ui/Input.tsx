"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // ✅ merge Tailwind classes (make sure you have this util)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;       // optional label
  error?: string;       // error message
  required?: boolean;   // required field
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="mb-1 block text-sm font-semibold text-gray-800">
            {label}{" "}
            {required && <span className="text-red-600">*</span>}
          </label>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={type}
          required={required}
          className={cn(
            "flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
            "placeholder:text-gray-400 shadow-sm transition-all",
            "focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
            className
          )}
          {...props}
        />

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
