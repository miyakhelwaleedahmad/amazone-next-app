// src/components/ui/Button.tsx
import React, { useState } from "react";
import clsx from "clsx";
import { Loader2, ChevronDown } from "lucide-react";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost"
  | "subtle"
  | "success"
  | "warning"
  | "info"
  | "link"
  | "icon"
  | "pill"
  | "fab"
  | "unstyled"
  | "text";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: "button" | "a" | "div";
  href?: string;
  roundedFull?: boolean;
  ariaLabel?: string;
  /** Toggle active state (like Amazon wishlist button) */
  toggleable?: boolean;
  /** If toggleable, track pressed state */
  pressed?: boolean;
  /** Dropdown support */
  split?: boolean;
  onSplitClick?: () => void;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  children,
  as = "button",
  href,
  roundedFull = false,
  ariaLabel,
  toggleable = false,
  pressed = false,
  split = false,
  onSplitClick,
  ...props
}: ButtonProps) {
  const Component: any = as === "a" ? "a" : as === "div" ? "div" : "button";

  const base =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles: Record<Variant, string> = {
    primary:
      "bg-yellow-400 hover:bg-yellow-500 text-black focus:ring-yellow-300 shadow-sm",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-black focus:ring-gray-300 border border-gray-200",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm",
    outline:
      "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-gray-300",
    ghost: "bg-transparent text-gray-800 hover:bg-gray-100",
    subtle: "bg-gray-50 text-gray-800 hover:bg-gray-100",
    success:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm",
    warning:
      "bg-amber-500 hover:bg-amber-600 text-black focus:ring-amber-400 shadow-sm",
    info: "bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400",
    link: "bg-transparent text-blue-600 hover:underline",
    text: "bg-transparent text-gray-700 hover:text-black",
    icon: "p-2 rounded-full bg-white hover:bg-gray-100",
    pill: "bg-yellow-400 hover:bg-yellow-500 text-black focus:ring-yellow-300 rounded-full",
    fab: "bg-yellow-400 hover:bg-yellow-500 text-black rounded-full shadow-lg p-3 fixed bottom-6 right-6 z-50",
    unstyled: "bg-transparent p-0 m-0",
  };

  const sizeStyles: Record<Size, string> = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  const shapeClass =
    roundedFull || variant === "pill" || variant === "fab"
      ? "rounded-full"
      : "rounded-md";

  const isIconOnly = variant === "icon" && !children;

  const buttonContent = loading ? (
    <>
      <Loader2 className="animate-spin mr-2 h-4 w-4" />
      {children ? <span>{children}</span> : null}
    </>
  ) : (
    <>
      {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
    </>
  );

  return (
    <div className={clsx("inline-flex", fullWidth && "w-full")}>
      <Component
        href={as === "a" ? href : undefined}
        role={as === "div" ? "button" : undefined}
        aria-label={isIconOnly ? ariaLabel : undefined}
        aria-pressed={toggleable ? pressed : undefined}
        className={clsx(
          base,
          variantStyles[variant],
          sizeStyles[size],
          shapeClass,
          fullWidth && "w-full",
          loading && "pointer-events-none",
          className
        )}
        {...props}
      >
        {buttonContent}
      </Component>

      {/* Split button (dropdown chevron) */}
      {split && (
        <button
          onClick={onSplitClick}
          className={clsx(
            base,
            variantStyles[variant],
            sizeStyles[size],
            shapeClass,
            "ml-[1px] px-2"
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
