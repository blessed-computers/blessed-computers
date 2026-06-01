"use client";

import { useState } from "react";
import { verifyAdminPassword } from "@/app/actions/auth-actions";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await verifyAdminPassword(password);
    if (!result.success) {
      setError(result.error || "Incorrect password");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-[var(--radius-brand)] border border-[var(--color-brand-border)] shadow-[0_10px_30px_rgba(10,10,10,0.05)]">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-[var(--color-brand-cream)] rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-[var(--color-brand-charcoal)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-black)]">Admin Access</h1>
          <p className="text-sm text-[var(--color-brand-muted)] mt-1 text-center">
            Please enter the master password to manage the catalog.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-brand-charcoal)] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-[var(--color-brand-border)] px-3 py-2 outline-none focus:border-[var(--color-brand-red)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm font-semibold text-[var(--color-brand-red)]">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !password}
            className="w-full rounded-[var(--radius-brand)] bg-[var(--color-brand-red)] px-4 py-2 font-bold text-white hover:bg-[#a01a1a] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Verifying..." : "Unlock Dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}
