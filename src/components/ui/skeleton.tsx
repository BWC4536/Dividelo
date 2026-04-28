import { cn } from "@/lib/utils/cn";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer shimmer-bg rounded-lg bg-muted",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
