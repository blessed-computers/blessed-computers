"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-brand-cream)] border-b border-[var(--color-brand-border)] shadow-sm overflow-hidden">
      {/* The 2px Red Letterhead Seam */}
      <div className="h-[2px] w-full bg-[var(--color-brand-red)]" />

      <div className="flex h-20 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo Lockup */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/logo.png"
            alt="Blessed Computers Logo"
            className="h-14 w-14 object-contain rounded-full bg-white shadow-sm border border-[var(--color-brand-border)]"
          />
          {/* Text is always visible, using truncate if space gets tight */}
          <span className="font-heading font-extrabold text-lg sm:text-2xl text-[var(--color-brand-black)] tracking-tight uppercase truncate block">
            Blessed Computers
          </span>
        </Link>

        {/* Nav & Search */}
        <div className="flex flex-1 justify-end items-center gap-2 sm:gap-6 ml-4">
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-6 font-body font-medium text-[var(--color-brand-charcoal)] items-center shrink-0">
            <Link href="/" className="hover:text-[var(--color-brand-red)] transition-colors">Home</Link>
            <Link href="/catalog" className="hover:text-[var(--color-brand-red)] transition-colors">Catalog</Link>
            <Link href="/my-list" className="hover:text-[var(--color-brand-red)] transition-colors">My List</Link>
            <Link href="/contact" className="hover:text-[var(--color-brand-red)] transition-colors">Contact Us</Link>
            <Link href="/admin" className="hover:text-[var(--color-brand-red)] transition-colors font-bold">Admin</Link>
          </nav>

          {/* Search Toggle / Input */}
          <div className="flex items-center justify-end shrink-0">
            <form 
              onSubmit={handleSearch} 
              className={`flex items-center rounded-full transition-all duration-300 ease-in-out overflow-hidden ${
                isSearchOpen 
                  ? "w-48 sm:w-64 md:w-72 bg-white border border-[var(--color-brand-border)] shadow-sm px-2 py-1.5" 
                  : "w-10 h-10 bg-transparent border-transparent hover:bg-[var(--color-brand-border)] cursor-pointer"
              }`}
              onClick={() => {
                if (!isSearchOpen) {
                  setIsSearchOpen(true);
                  setTimeout(() => inputRef.current?.focus(), 100);
                }
              }}
            >
              {isSearchOpen ? (
                <>
                  <Search className="h-4 w-4 text-[var(--color-brand-muted)] shrink-0 ml-1" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      if (!searchQuery) setIsSearchOpen(false);
                    }}
                    className="w-full bg-transparent py-1 pl-2 pr-2 text-sm outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setIsSearchOpen(false); }}
                    className="text-[var(--color-brand-muted)] hover:text-[var(--color-brand-red)] shrink-0 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Search className="h-5 w-5 text-[var(--color-brand-charcoal)]" />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
