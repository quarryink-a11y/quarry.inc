import { cn } from "./lib/cn";

interface CharacterCounterProps {
  current: number;
  max: number;
  min?: number;
  className?: string;
  as?: "p" | "span" | "div";
  withoutLabel?: boolean;
  withoutMinWarning?: boolean;
}

export function CharacterCounter({
  current,
  max,
  min,
  className,
  as: Component = "p",
  withoutLabel = false,
  withoutMinWarning = false,
}: CharacterCounterProps) {
  const isBelowMin = typeof min === "number" && current >= 0 && current < min;

  return (
    <Component
      className={cn(
        "text-xs",
        isBelowMin ? "text-red-400" : "text-gray-400",
        className,
      )}
    >
      {current}/{max} {withoutLabel ? "" : "characters"}
      {isBelowMin && !withoutMinWarning && ` · minimum ${min} characters`}
    </Component>
  );
}
