import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {icon ? (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted text-4xl">
          {icon}
        </div>
      ) : (
        <svg
          className="mb-6 h-20 w-20 text-muted-foreground/30"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="80" fill="currentColor" opacity="0.1" />
          <path
            d="M60 100 L100 60 L140 100 L100 140 Z"
            fill="currentColor"
            opacity="0.2"
          />
          <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.3" />
        </svg>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-6" variant="gradient">
          {action.label}
        </Button>
      )}
    </div>
  );
}
