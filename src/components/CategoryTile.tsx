import type { LucideIcon } from "lucide-react";

export type CategoryTileProps = {
  icon: LucideIcon;
  label: string;
  hindiLabel: string;
  className?: string;
};

export default function CategoryTile({
  icon: Icon,
  label,
  hindiLabel,
  className = "",
}: CategoryTileProps) {
  return (
    <div
      className={[
        "flex aspect-square flex-col items-center justify-center rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] bg-[var(--color-brand-cream)] p-5 text-center shadow-[0_8px_24px_rgba(10,10,10,0.06)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={`${label} / ${hindiLabel}`}
    >
      <div className="flex flex-1 items-center justify-center">
        <Icon className="h-10 w-10 text-[var(--color-brand-charcoal)]" aria-hidden="true" />
      </div>

      <div className="mt-3">
        <p className="text-sm font-semibold leading-none text-[var(--color-brand-black)]">
          {label}
        </p>
        <p className="mt-1 text-xs leading-none text-[var(--color-brand-muted)]">
          {hindiLabel}
        </p>
      </div>
    </div>
  );
}
