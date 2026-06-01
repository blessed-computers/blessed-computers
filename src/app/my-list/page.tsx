"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCartStore } from "@/lib/cart-store";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function MyListPage() {
  const { items, hasHydrated, updateQuantity, removeItem, clearCart } = useCartStore();

  const estimatedTotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  if (!hasHydrated) {
    return (
      <main className="min-h-screen bg-[var(--color-brand-cream)] px-4 py-8 text-[var(--color-brand-black)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] bg-white p-8 shadow-[0_12px_40px_rgba(10,10,10,0.06)]">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-40 rounded bg-[var(--color-brand-border)]" />
            <div className="h-24 rounded bg-[var(--color-brand-cream)]" />
            <div className="h-24 rounded bg-[var(--color-brand-cream)]" />
            <div className="h-16 rounded bg-[var(--color-brand-border)]" />
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--color-brand-cream)] px-4 py-8 text-[var(--color-brand-black)] sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] bg-white px-6 py-12 text-center shadow-[0_12px_40px_rgba(10,10,10,0.06)] sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-brand-muted)]">
              My List
            </p>
            <h1 className="mt-4 text-3xl font-bold text-[var(--color-brand-black)] sm:text-4xl">
              Your list is empty
            </h1>
            <p className="mt-3 text-base text-[var(--color-brand-muted)]">
              Add products to your list and call directly when you are ready to buy.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex items-center justify-center rounded-[var(--radius-brand)] bg-[var(--color-brand-red)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] px-4 py-8 text-[var(--color-brand-black)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] bg-white shadow-[0_12px_40px_rgba(10,10,10,0.06)]">
          <div className="border-b border-[var(--color-brand-border)] px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-brand-muted)]">
                  Blessed Computers
                </p>
                <h1 className="mt-2 text-3xl font-bold text-[var(--color-brand-black)]">
                  My List
                </h1>
                <p className="mt-2 text-sm text-[var(--color-brand-muted)]">
                  Review your selected items and call the owner directly to place the order.
                </p>
              </div>

              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center justify-center rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] px-4 py-2 text-sm font-semibold text-[var(--color-brand-charcoal)] transition hover:bg-[var(--color-brand-cream)]"
              >
                Clear List
              </button>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] bg-[var(--color-brand-cream)] p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold text-[var(--color-brand-charcoal)]">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-base font-semibold text-[var(--color-brand-red)]">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="inline-flex items-center rounded-full border border-[var(--color-brand-border)] bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-11 w-11 text-xl font-bold text-[var(--color-brand-charcoal)] transition hover:bg-[var(--color-brand-cream)]"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          -
                        </button>

                        <span className="flex h-11 min-w-12 items-center justify-center border-x border-[var(--color-brand-border)] px-3 text-base font-bold text-[var(--color-brand-black)]">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-11 w-11 text-xl font-bold text-[var(--color-brand-charcoal)] transition hover:bg-[var(--color-brand-cream)]"
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-brand-border)] bg-white text-[var(--color-brand-red)] transition hover:bg-[var(--color-brand-cream)]"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-5 w-5"
                        >
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 border-t border-[var(--color-brand-border)] pt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-muted)]">
                    Estimated Total
                  </p>
                  <p className="mt-2 text-3xl font-bold text-[var(--color-brand-black)] sm:text-4xl">
                    {formatPrice(estimatedTotal)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 mt-6 pb-2">
          <a
            href="tel:9305837020"
            className="flex w-full items-center justify-center rounded-[var(--radius-brand)] bg-[var(--color-brand-red)] px-6 py-5 text-center text-lg font-bold text-white shadow-[0_14px_34px_rgba(200,16,46,0.28)] transition hover:opacity-95 sm:text-xl"
          >
            📞 Call Owner to Buy
          </a>
        </div>
      </div>
    </main>
  );
}
