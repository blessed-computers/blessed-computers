"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, Phone, Lock } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Catalog", href: "/catalog", icon: LayoutGrid },
    { name: "My List", href: "/my-list", icon: Heart },
    { name: "Contact", href: "/contact", icon: Phone },
    { name: "Admin", href: "/admin", icon: Lock },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-brand-cream border-t border-brand-border z-50">
      <div className="flex justify-around items-center h-16 relative">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-colors ${
                isActive ? "text-brand-red" : "text-brand-muted hover:text-brand-charcoal"
              }`}
            >
              {/* Active Top Bar Indicator */}
              {isActive && (
                <div className="absolute top-0 w-10 h-[3px] bg-brand-red rounded-b-md" />
              )}
              
              <Icon className={`w-6 h-6 ${isActive ? "scale-110" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}