import { Suspense } from "react";
import CatalogContent from "./CatalogContent";
import { getProducts } from "@/app/actions/product-actions";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const allProducts = await getProducts();

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] px-4 py-8 text-[var(--color-brand-black)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-muted)]">
            Blessed Computers
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-brand-black)] sm:text-4xl">
            Complete Catalog
          </h1>
        </header>
        <Suspense fallback={<div className="animate-pulse h-64 bg-[var(--color-brand-border)] rounded-[var(--radius-brand)]" />}>
          <CatalogContent allProducts={allProducts} />
        </Suspense>
      </div>
    </main>
  );
}
