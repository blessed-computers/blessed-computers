"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCartStore } from "@/lib/cart-store";

type ProductCardProps = {
  name: string;
  price: number;
  description?: string;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function createProductId(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function ProductCard({
  name,
  price,
  description,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const productId = useMemo(() => createProductId(name), [name]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  function handleAddToList() {
    addItem({
      id: productId,
      name,
      price,
      quantity: 1,
    });

    setAdded(true);

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = setTimeout(() => {
      setAdded(false);
    }, 1000);
  }

  return (
    <article className="overflow-hidden rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] bg-white shadow-[0_10px_30px_rgba(10,10,10,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(10,10,10,0.08)]">


      <div className="p-5">
        <h3 className="text-lg font-bold text-[var(--color-brand-charcoal)]">
          {name}
        </h3>



        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-muted)]">
              Price
            </p>
            <p className="mt-1 text-2xl font-bold text-[var(--color-brand-black)]">
              {formatPrice(price)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToList}
            className={[
              "inline-flex min-w-[156px] items-center justify-center rounded-[var(--radius-brand)] px-4 py-3 text-sm font-semibold transition",
              added
                ? "bg-[var(--color-brand-green)] text-white"
                : "bg-[var(--color-brand-red)] text-white hover:opacity-90",
            ].join(" ")}
            aria-label={`Add ${name} to list`}
          >
            {added ? "✓ Added" : "➕ Add to List"}
          </button>
        </div>
      </div>
    </article>
  );
}
