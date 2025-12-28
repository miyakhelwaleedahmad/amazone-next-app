// W:\Amazone-clone2\my-app\src\components\ui\Card.tsx
import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: "none" | "sm" | "md" | "lg";
  bordered?: boolean;
  hoverable?: boolean;
}

export default function Card({
  children,
  className,
  shadow = "sm",
  bordered = true,
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-md",
        bordered && "border border-gray-200",
        shadow === "sm" && "shadow-sm",
        shadow === "md" && "shadow-md",
        shadow === "lg" && "shadow-lg",
        hoverable && "transition-transform transform hover:scale-[1.02]",
        className
      )}
    >
      {children}
    </div>
  );
}
