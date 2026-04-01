type TypeBadgeProps = {
  type: "DRAFT" | "PUBLISHED" | null | undefined;
  className?: string;
};

export function TypeBadge({ type, className }: TypeBadgeProps) {
  if (!type) return null;

  const color =
    type === "DRAFT"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-800";

  return (
    <span
      className={`inline-flex items-center rounded-full  text-[11px] font-medium  px-2 py-0.5 ${color} ${className ?? ""}`}
    >
      {type.toLowerCase()}
    </span>
  );
}
