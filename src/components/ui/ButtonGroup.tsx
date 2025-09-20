// src/components/ui/ButtonGroup.tsx
import React from "react";
import clsx from "clsx";

interface ButtonGroupProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  vertical?: boolean;
  className?: string;
}

export default function ButtonGroup({
  children,
  fullWidth = false,
  vertical = false,
  className,
}: ButtonGroupProps) {
  return (
    <div
      className={clsx(
        "inline-flex",
        vertical ? "flex-col" : "flex-row",
        fullWidth && "w-full",
        className
      )}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const element = child as React.ReactElement<any>;

        return React.cloneElement(element, {
          className: clsx(
            element.props.className,
            // remove rounded corners for middle buttons
            vertical
              ? index === 0
                ? "rounded-t-md"
                : index === React.Children.count(children) - 1
                ? "rounded-b-md"
                : "rounded-none"
              : index === 0
              ? "rounded-l-md"
              : index === React.Children.count(children) - 1
              ? "rounded-r-md"
              : "rounded-none",
            // merge borders
            vertical
              ? index > 0 && "border-t-0"
              : index > 0 && "border-l-0"
          ),
        });
      })}
    </div>
  );
}
