import { Award } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/app/actions/product-actions";

export default async function HomePage() {
  const allProducts = await getProducts();

  return (
    <main className="bg-[var(--color-brand-cream)] text-[var(--color-brand-black)] min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        
        {/* Small 15+ Years Experience Card */}
        <section className="flex items-center justify-center rounded-[var(--radius-brand)] border border-[var(--color-brand-gold)] bg-[rgba(201,162,39,0.05)] py-4 px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-[var(--color-brand-gold)]" />
            <h1 className="text-lg font-bold text-[var(--color-brand-black)] sm:text-xl text-center">
              15+ Years of Dedicated Service and Experience
            </h1>
          </div>
        </section>

        {/* Main Content Area */}
        <section aria-labelledby="all-items-heading">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2
                id="all-items-heading"
                className="text-2xl font-extrabold text-[var(--color-brand-black)] sm:text-3xl"
              >
                All Items
              </h2>
              <p className="mt-1.5 text-sm text-[var(--color-brand-muted)]">
                Showing {allProducts.length} products
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
              />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
