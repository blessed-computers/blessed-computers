"use client";

import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
  type: string;
  company: string;
  description?: string | null;
};

export default function CatalogContent({ allProducts }: { allProducts: Product[] }) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q")?.toLowerCase() || "";

  const TYPES = ["All", ...Array.from(new Set(allProducts.map((p) => p.type)))];
  const COMPANIES = ["All", ...Array.from(new Set(allProducts.map((p) => p.company)))];
  const PRICE_RANGES = ["All", "< ₹10,000", "₹10,000 - ₹30,000", "₹30,000 - ₹50,000", "> ₹50,000"];
  const SORTS = ["None", "Price: Low to High", "Price: High to Low"];

  const [selectedType, setSelectedType] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [sortOrder, setSortOrder] = useState("None");

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...allProducts];

    // Search filter
    if (initialSearch) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(initialSearch) ||
          p.type.toLowerCase().includes(initialSearch) ||
          p.company.toLowerCase().includes(initialSearch)
      );
    }

    // Filter by Type
    if (selectedType !== "All") {
      result = result.filter((p) => p.type === selectedType);
    }

    // Filter by Company
    if (selectedCompany !== "All") {
      result = result.filter((p) => p.company === selectedCompany);
    }

    // Filter by Price Range
    if (selectedPrice !== "All") {
      result = result.filter((p) => {
        if (selectedPrice === "< ₹10,000") return p.price < 10000;
        if (selectedPrice === "₹10,000 - ₹30,000") return p.price >= 10000 && p.price <= 30000;
        if (selectedPrice === "₹30,000 - ₹50,000") return p.price > 30000 && p.price <= 50000;
        if (selectedPrice === "> ₹50,000") return p.price > 50000;
        return true;
      });
    }

    // Sort
    if (sortOrder === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allProducts, selectedType, selectedCompany, selectedPrice, sortOrder, initialSearch]);

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      {/* Filters Sidebar */}
      <aside className="w-full lg:w-64 shrink-0 rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] bg-white p-5 shadow-[0_8px_24px_rgba(10,10,10,0.04)] mb-8 lg:mb-0">
        <div className="flex items-center gap-2 mb-6 border-b border-[var(--color-brand-border)] pb-4">
          <Filter className="h-5 w-5 text-[var(--color-brand-charcoal)]" />
          <h2 className="text-lg font-bold text-[var(--color-brand-charcoal)]">Filters</h2>
        </div>

        <div className="space-y-6">
          {/* Type Filter */}
          <div>
            <label className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-muted)] mb-2 block">
              Product Type
            </label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-md border border-[var(--color-brand-border)] bg-[var(--color-brand-cream)] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-red)] transition-colors cursor-pointer"
            >
              {TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Company Filter */}
          <div>
            <label className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-muted)] mb-2 block">
              Company
            </label>
            <select 
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full rounded-md border border-[var(--color-brand-border)] bg-[var(--color-brand-cream)] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-red)] transition-colors cursor-pointer"
            >
              {COMPANIES.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-muted)] mb-2 block">
              Price
            </label>
            <select 
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="w-full rounded-md border border-[var(--color-brand-border)] bg-[var(--color-brand-cream)] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-red)] transition-colors cursor-pointer"
            >
              {PRICE_RANGES.map(price => (
                <option key={price} value={price}>{price}</option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-muted)] mb-2 block">
              Sort By
            </label>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full rounded-md border border-[var(--color-brand-border)] bg-[var(--color-brand-cream)] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-red)] transition-colors cursor-pointer"
            >
              {SORTS.map(sort => (
                <option key={sort} value={sort}>{sort}</option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 w-full" aria-labelledby="catalog-all-items">
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="catalog-all-items"
            className="text-xl font-bold text-[var(--color-brand-charcoal)] sm:text-2xl"
          >
            {initialSearch ? `Search Results for "${initialSearch}"` : `Filtered Items (${filteredAndSortedProducts.length})`}
          </h2>
        </div>

        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl || undefined}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-brand)] border border-dashed border-[var(--color-brand-border)] bg-white py-16 text-center">
            <p className="text-lg font-medium text-[var(--color-brand-charcoal)]">No products found</p>
            <p className="mt-1 text-sm text-[var(--color-brand-muted)]">Try adjusting your filters or search term.</p>
            <button 
              onClick={() => {
                setSelectedType("All");
                setSelectedCompany("All");
                setSelectedPrice("All");
                setSortOrder("None");
              }}
              className="mt-4 text-sm font-semibold text-[var(--color-brand-red)] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
