"use client";

import Link from "next/link";
import { Sword } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border/60 backdrop-blur-sm bg-background/60 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4 flex-wrap">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-ember flex items-center justify-center shadow-lg shadow-primary/30">
            <Sword className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl text-gold leading-none notranslate" translate="no">
              Albion Forge
            </h1>
            <p className="text-xs text-muted-foreground tracking-wider uppercase">
              Theorycrafting · Market · Builds
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
