"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BusFront,
  LogIn,
  Menu,
  Moon,
  Route,
  Sun,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Home", href: "/#home" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Trips", href: "/#trips" },
  { label: "About", href: "/#about" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("routesync-theme");

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldUseDark = savedTheme
      ? savedTheme === "dark"
      : prefersDark;

    setIsDark(shouldUseDark);

    document.documentElement.classList.toggle(
      "dark",
      shouldUseDark
    );
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleTheme = () => {
    const nextTheme = !isDark;

    setIsDark(nextTheme);

    document.documentElement.classList.toggle(
      "dark",
      nextTheme
    );

    localStorage.setItem(
      "routesync-theme",
      nextTheme ? "dark" : "light"
    );
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-10 xl:px-12"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="RouteSync home"
          className="group flex min-w-0 items-center gap-2.5"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-[0_8px_24px_rgba(5,150,105,0.25)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <Route
              className="size-5"
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </span>

          <span className="text-xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white">
            Route
            <span className="text-emerald-600 dark:text-emerald-400">
              Sync
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                index === 0
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Navbar actions */}
        <div className="flex items-center gap-2">
          {/* Theme button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-600 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? "sun" : "moon"}
                initial={{
                  opacity: 0,
                  rotate: -35,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  rotate: 35,
                  scale: 0.7,
                }}
                transition={{ duration: 0.18 }}
              >
                {isDark ? (
                  <Sun className="size-[19px]" />
                ) : (
                  <Moon className="size-[19px]" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>

          {/* Login button */}
          <Link
            href="/login"
            className="hidden min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 md:flex dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
          >
            <LogIn
              className="size-[17px]"
              aria-hidden="true"
            />

            Log in
          </Link>

          {/* Register button */}
          <Link
            href="/register"
            className="hidden min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:flex dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
          >
            <UserPlus
              className="size-[17px]"
              aria-hidden="true"
            />

            Register
          </Link>

          {/* Request Trip button */}
          <motion.a
            href="#request-trip"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="hidden h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 xl:flex dark:bg-slate-800 dark:hover:bg-emerald-600"
          >
            <BusFront
              className="size-[18px]"
              aria-hidden="true"
            />

            Request a Trip
          </motion.a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() =>
              setIsMenuOpen((previous) => !previous)
            }
            aria-label={
              isMenuOpen ? "Close menu" : "Open menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.24,
              ease: "easeOut",
            }}
            className="overflow-hidden border-t border-slate-200 bg-white lg:hidden dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="space-y-1 px-4 py-4 sm:px-6">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.04,
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex min-h-12 items-center rounded-xl px-4 text-base font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Login and Register */}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <LogIn className="size-[17px]" />

                  Log in
                </Link>

                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950"
                >
                  <UserPlus className="size-[17px]" />

                  Register
                </Link>
              </div>

              <a
                href="#request-trip"
                onClick={closeMobileMenu}
                className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-base font-semibold text-white sm:hidden dark:bg-slate-800"
              >
                <BusFront
                  className="size-5"
                  aria-hidden="true"
                />

                Request a Trip
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}