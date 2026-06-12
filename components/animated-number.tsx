"use client";

import { animate, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
  compact?: boolean;
};

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  locale = "en-US",
  compact = false
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplay(
          new Intl.NumberFormat(locale, {
            notation: compact ? "compact" : "standard",
            maximumFractionDigits: 0
          }).format(latest)
        );
      }
    });

    return controls.stop;
  }, [compact, locale, motionValue, value]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
