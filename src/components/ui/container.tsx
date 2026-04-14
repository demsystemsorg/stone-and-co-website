import * as React from "react";
import { cn } from "@/lib/cn";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum width of the container */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Center the container */
  centered?: boolean;
  /** Add horizontal padding */
  padding?: boolean;
}

const sizeStyles = {
  sm: "max-w-3xl", // 768px
  md: "max-w-5xl", // 1024px
  lg: "max-w-[1240px]", // 1240px — design system v2
  xl: "max-w-[1240px]", // 1240px — design system v2
  full: "max-w-full",
};

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      size = "xl",
      centered = true,
      padding = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          sizeStyles[size],
          centered && "mx-auto",
          padding && "px-4 sm:px-6 lg:px-8",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export { Container };
