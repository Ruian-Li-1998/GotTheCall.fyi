import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "gold";
type ButtonSize = "sm" | "md" | "lg";

export function buttonClasses(opts?: { variant?: ButtonVariant; size?: ButtonSize }) {
  const variant = opts?.variant ?? "primary";
  const size = opts?.size ?? "md";
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40 focus-visible:ring-offset-1",
    size === "sm" && "h-8 px-3 text-sm",
    size === "md" && "h-10 px-4 text-sm",
    size === "lg" && "h-12 px-6 text-base",
    variant === "primary" && "bg-brand-600 text-white hover:bg-brand-700",
    variant === "outline" && "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
    variant === "ghost" && "text-gray-700 hover:bg-gray-100",
    variant === "gold" && "bg-gold-500 text-white hover:bg-gold-600",
  );
}

export function Button({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={cn(buttonClasses({ variant, size }), className)} {...props} />;
}

type BadgeVariant = "gray" | "brand" | "gold" | "outline";

export function Badge({
  className,
  variant = "gray",
  ...props
}: ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "gray" && "bg-gray-100 text-gray-700",
        variant === "brand" && "bg-brand-50 text-brand-700",
        variant === "gold" && "bg-gold-500/10 text-gold-600",
        variant === "outline" && "border border-gray-200 text-gray-600",
        className,
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-xl border border-gray-200 bg-white", className)}
      {...props}
    />
  );
}

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
        {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
