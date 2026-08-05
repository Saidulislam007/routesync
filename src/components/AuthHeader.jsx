"use client";

import { ArrowLeft, Route } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function AuthHeader() {
  useEffect(() => {
    const saved = localStorage.getItem("routesync-theme");
    const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-10 xl:px-12">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Back to RouteSync home">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <Route className="size-5" strokeWidth={2.2} />
          </span>
          <span className="text-xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white">
            Route<span className="text-emerald-600 dark:text-emerald-400">Sync</span>
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3.5 text-sm font-semibold text-slate-700 backdrop-blur-md transition-colors hover:border-emerald-300 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:text-emerald-300"
        >
          <ArrowLeft className="size-[17px]" aria-hidden="true" />
          <span className="hidden sm:inline">Back to home</span>
          <span className="sm:hidden">Home</span>
        </Link>
      </div>
    </header>
  );
}