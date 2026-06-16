"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border/60 backdrop-blur-sm bg-background/60 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4 flex-wrap">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/albionForge.png"
            alt="Albion Forge"
            className="h-12 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}
