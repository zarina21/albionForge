"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Package, Coins, Pickaxe, BookOpen, Mail } from "lucide-react";

const NAV_ITEMS = [
  { href: "/market", label: "Market", icon: Package },
  { href: "/builds", label: "Builds", icon: Shield },
  { href: "/gold", label: "Gold", icon: Coins },
  { href: "/resources", label: "Resources", icon: Pickaxe },
  { href: "/professions", label: "Professions", icon: BookOpen },
  { href: "/contact", label: "Contact", icon: Mail },
] as const;

export function ForgeNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="border-b border-border/60 bg-background/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ul className="flex items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition whitespace-nowrap ${
                    active
                      ? "text-gold border-b-2 border-gold"
                      : "text-muted-foreground hover:text-gold border-b-2 border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
