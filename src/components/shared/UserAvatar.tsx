import Image from "next/image";
import { getInitials, getAvatarColor } from "@/lib/utils/cn";
import { cn } from "@/lib/utils/cn";

interface UserAvatarProps {
  name: string | null | undefined;
  image?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: { container: "h-6 w-6", text: "text-[10px]" },
  sm: { container: "h-8 w-8", text: "text-xs" },
  md: { container: "h-10 w-10", text: "text-sm" },
  lg: { container: "h-12 w-12", text: "text-base" },
  xl: { container: "h-16 w-16", text: "text-lg" },
};

export function UserAvatar({
  name,
  image,
  size = "md",
  className,
}: UserAvatarProps) {
  const { container, text } = sizeMap[size];
  const color = getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        container,
        className
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={name ?? "Avatar"}
          fill
          className="object-cover"
          sizes="64px"
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center font-semibold text-white",
            text
          )}
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
