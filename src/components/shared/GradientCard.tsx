import { cn } from "@/lib/utils/cn";

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export function GradientCard({
  children,
  className,
  gradient = "from-brand-500 to-violet-500",
}: GradientCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        "bg-gradient-to-br",
        gradient,
        "text-white shadow-lg",
        className
      )}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
