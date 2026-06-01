function getOpenStatus() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    hour12: false,
    minute: "numeric",
  }).formatToParts(now);

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  const minutesSinceMidnight = hour * 60 + minute;

  const isSunday = weekday === "Sun";
  const opensAt = 10 * 60;
  const closesAt = 20 * 60;

  return !isSunday && minutesSinceMidnight >= opensAt && minutesSinceMidnight < closesAt;
}

const infoCardClass =
  "rounded-[calc(var(--radius-brand)-6px)] border border-[var(--color-brand-border)] bg-white p-6 shadow-[0_8px_24px_rgba(10,10,10,0.04)]";

export default function ContactPage() {
  const isOpenNow = getOpenStatus();

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] px-4 py-8 text-[var(--color-brand-black)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] bg-white shadow-[0_18px_60px_rgba(10,10,10,0.08)]">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-[var(--color-brand-red)]" aria-hidden="true" />

          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            <header className="border-b border-[var(--color-brand-border)] pb-8 text-center">


              <h1 className="mt-4 text-3xl font-bold tracking-[0.12em] text-[var(--color-brand-black)] sm:text-4xl lg:text-5xl">
                BLESSED COMPUTERS
              </h1>

              <div className="mx-auto mt-5 max-w-2xl">
                <div className="flex items-center justify-center gap-3">
                  <span
                    className="hidden h-px flex-1 bg-[var(--color-brand-border)] sm:block"
                    aria-hidden="true"
                  />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-muted)] sm:text-xs">
                    Head Office
                  </p>
                  <span
                    className="hidden h-px flex-1 bg-[var(--color-brand-border)] sm:block"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-4 text-sm leading-7 tracking-[0.08em] text-[var(--color-brand-charcoal)] sm:text-base">
                  15/299 FFB-20 SOMDUTT PLAZA, CIVIL LINES, KANPUR — 208001
                </p>
              </div>
            </header>

            <section className="mt-8 grid gap-4 sm:grid-cols-2">
              <article className={infoCardClass}>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-muted)]">
                  GSTIN
                </p>
                <p className="mt-4 text-xl font-semibold tracking-[0.12em] text-[var(--color-brand-charcoal)] sm:text-2xl">
                  09ADGPJ8295H1Z1
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--color-brand-muted)]">
                  Registered business identification for invoices, billing, and official
                  correspondence.
                </p>
              </article>

              <article className={infoCardClass}>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-muted)]">
                  Business Hours
                </p>
                <p className="mt-4 text-base font-medium text-[var(--color-brand-charcoal)] sm:text-lg">
                  Mon–Sat: 10 AM – 8 PM
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-brand-border)] px-3 py-1.5 text-sm font-semibold text-[var(--color-brand-charcoal)]">
                  <span
                    className={[
                      "inline-block h-2.5 w-2.5 rounded-full",
                      isOpenNow
                        ? "bg-[var(--color-brand-green)]"
                        : "bg-[var(--color-brand-muted)]",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  {isOpenNow ? "Open Now" : "Closed Now"}
                </div>

                <p className="mt-3 text-sm leading-6 text-[var(--color-brand-muted)]">
                  Sunday remains closed for walk-in service and front-desk operations.
                </p>
              </article>
            </section>

            <section className="mt-8 rounded-[calc(var(--radius-brand)-4px)] border border-[var(--color-brand-border)] bg-[var(--color-brand-cream)] px-6 py-7 sm:px-8 sm:py-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-muted)]">
                    Contact Lines
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-brand-charcoal)] sm:text-base">
                    For sales enquiries, service coordination, and direct business assistance,
                    connect with us on the numbers below.
                  </p>
                </div>

                <div className="h-px w-full bg-[var(--color-brand-border)] lg:hidden" aria-hidden="true" />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <a
                  href="tel:9305837020"
                  className="break-all text-3xl font-bold tracking-tight text-[var(--color-brand-red)] transition hover:opacity-80 sm:text-4xl lg:text-5xl"
                >
                  9305837020
                </a>

                <a
                  href="tel:+919839606925"
                  className="break-all text-3xl font-bold tracking-tight text-[var(--color-brand-red)] transition hover:opacity-80 sm:text-4xl lg:text-5xl"
                >
                  +91-9839606925
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
