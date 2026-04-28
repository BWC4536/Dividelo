"use client";

import { useEffect, useRef } from "react";
import { useSpring, motion, useMotionValue, useTransform } from "framer-motion";
import { getCurrencySymbol } from "@/lib/utils/cn";

interface AnimatedNumberProps {
  value: number;
  currency?: string;
  className?: string;
  showSign?: boolean;
}

export function AnimatedNumber({
  value,
  currency,
  className,
  showSign = false,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.01,
  });

  const display = useTransform(spring, (latest) => {
    const formatted = Math.abs(latest).toFixed(2).replace(".", ",");
    const symbol = currency ? getCurrencySymbol(currency) : "";
    const sign = showSign ? (latest >= 0 ? "+" : "-") : "";
    return `${sign}${symbol}${formatted}`;
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span className={className}>{display}</motion.span>;
}
