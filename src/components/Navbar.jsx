"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BusFront,
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  ArrowRight,
  Sun,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

const navigation = [
  { label: "Home", href: "/#home" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Trips", href: "/trips" },
  { label: "About", href: "/about" },
];

const dashboardRoutes = {
  employee: "/dashboard/employee",
  manager: "/dashboard/manager",
  driver: "/dashboard/driver",
  admin: "/dashboard/admin",
};

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const profileRef = useRef(null);
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const user = session?.user;
  const role = user?.role?.toLowerCase() || "employee";
  const dashboardRoute = dashboardRoutes[role] || dashboardRoutes.employee;
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const initials = (user?.name || user?.email || "RouteSync User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("routesync-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const closeProfileMenu = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeProfileMenu);
    return () => document.removeEventListener("mousedown", closeProfileMenu);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    localStorage.setItem("routesync-theme", nextTheme ? "dark" : "light");
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    await authClient.signOut();
    window.location.href = "/";
  };

  // Employee, manager, driver and admin dashboards use their own navigation.
  if (isDashboardRoute) {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#DCE6E1] bg-white/70 backdrop-blur-xl dark:border-[#1D2E28] dark:bg-[#101E19]/60">
      <nav
        className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-5 sm:px-6 lg:h-[72px] lg:px-10 xl:px-14"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5"
          aria-label="RouteSync home"
        >
          <span className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-gradient-to-br from-[#0E8F6E] to-[#075C46] text-white shadow-[0_6px_16px_rgba(14,143,110,0.45)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="6" cy="18" r="2.5" />
              <circle cx="18" cy="6" r="2.5" />
              <path d="M8.2 16.2 15.8 7.8" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-[-0.03em] text-[#0B1512] dark:text-[#EAF3EF]">
            Route
            <span className="text-[#0E8F6E] dark:text-[#3FCB9B]">Sync</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1.5 xl:flex">
          {navigation.map((item) => {
            const isActive =
              item.href === "/#home"
                ? pathname === "/"
                : pathname === item.href;

            return (
              <a
                key={item.label}
                href={item.href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#0E8F6E]/15 text-[#075C46] font-semibold dark:bg-[#0E8F6E]/15 dark:text-[#3FCB9B]"
                    : "text-[#4B5A55] hover:bg-[#F0F6F3] hover:text-[#0B1512] dark:text-[#9FB3AC] dark:hover:bg-[#0F1B17] dark:hover:text-white"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-[#DCE6E1] bg-white text-[#0B1512] transition-all hover:-translate-y-0.5 hover:-rotate-12 dark:bg-[#101E19] hover:border-[#0E8F6E]/30 hover:bg-[#0E8F6E]/10 hover:text-[#075C46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E8F6E] focus-visible:ring-offset-2 dark:border-[#1D2E28] dark:text-[#9FB3AC] dark:hover:border-[#0E8F6E]/40 dark:hover:bg-emerald-400/10 dark:hover:text-[#3FCB9B] dark:focus-visible:ring-offset-slate-950"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? "sun" : "moon"}
                initial={{ opacity: 0, rotate: -35, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 35, scale: 0.7 }}
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

          {isPending ? (
            <div className="hidden h-11 w-32 animate-pulse rounded-full bg-slate-200 md:block dark:bg-[#0F1B17]" />
          ) : user ? (
            <div ref={profileRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsProfileOpen((open) => !open)}
                className="flex min-h-10 items-center gap-2.5 rounded-full border border-[#DCE6E1] bg-white py-1 pl-1 pr-3 text-left transition-colors hover:border-[#0E8F6E]/40 hover:bg-[#0E8F6E]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E8F6E] dark:border-[#1D2E28] dark:bg-[#101E19] dark:hover:border-[#0E8F6E]/60 dark:hover:bg-emerald-400/10"
                aria-label="Open user profile menu"
                aria-expanded={isProfileOpen}
                aria-controls="profile-menu"
              >
                <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#0E8F6E] to-[#075C46] text-[10px] font-bold text-white">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={`${user.name || "RouteSync user"} profile`}
                      className="size-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    initials || "RS"
                  )}
                </span>
                <span className="hidden max-w-32 leading-tight xl:block">
                  <span className="block truncate text-[13px] font-bold text-[#0B1512] dark:text-[#EAF3EF]">
                    {user.name || "RouteSync User"}
                  </span>
                  <span className="block text-[11px] text-[#4B5A55] dark:text-[#9FB3AC]">
                    {roleLabel}
                  </span>
                </span>
                <ChevronDown
                  className={`size-4 text-[#4B5A55] transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    id="profile-menu"
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-[calc(100%+0.65rem)] w-72 overflow-hidden rounded-2xl border border-[#DCE6E1] bg-white p-2 shadow-[0_22px_60px_rgba(15,23,42,0.18)] dark:border-[#1D2E28] dark:bg-[#101E19]"
                  >
                    <div className="flex items-center gap-3 rounded-full bg-[#F4F8F6] p-3 dark:bg-[#0F1B17]/80">
                      <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[#0E8F6E] text-sm font-bold text-white dark:bg-[#0E8F6E] dark:text-[#0B1512]">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={`${user.name || "RouteSync user"} profile`}
                            className="size-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          initials || "RS"
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0B1512] dark:text-[#EAF3EF]">
                          {user.name || "RouteSync User"}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[#4B5A55] dark:text-[#9FB3AC]">
                          {user.email}
                        </p>
                        <span className="mt-2 inline-flex rounded-full bg-[#0E8F6E]/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#075C46] dark:bg-emerald-400/10 dark:text-[#3FCB9B]">
                          {roleLabel}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={dashboardRoute}
                      onClick={() => setIsProfileOpen(false)}
                      className="mt-2 flex min-h-11 items-center gap-3 rounded-full px-3 text-sm font-semibold text-[#4B5A55] transition-colors hover:bg-[#0E8F6E]/10 hover:text-[#075C46] dark:text-[#EAF3EF] dark:hover:bg-emerald-400/10 dark:hover:text-[#3FCB9B]"
                    >
                      <LayoutDashboard
                        className="size-[18px]"
                        aria-hidden="true"
                      />
                      Open {roleLabel} Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex min-h-11 w-full items-center gap-3 rounded-full px-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-400/10"
                    >
                      <LogOut className="size-[18px]" aria-hidden="true" />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#4B5A55] transition-colors hover:bg-[#F0F6F3] hover:text-[#075C46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E8F6E] md:flex dark:text-[#EAF3EF] dark:hover:bg-[#0F1B17] dark:hover:text-[#3FCB9B]"
              >
                <LogIn className="size-[17px]" aria-hidden="true" />
                Log in
              </Link>
              <Link
                href="/register"
                className="hidden min-h-11 items-center gap-2 rounded-full bg-[#0E8F6E] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#075C46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E8F6E] focus-visible:ring-offset-2 md:flex dark:bg-[#0E8F6E] dark:text-[#0B1512] dark:hover:bg-emerald-400 dark:focus-visible:ring-offset-slate-950"
              >
                <UserPlus className="size-[17px]" aria-hidden="true" />
                Create account
              </Link>
            </>
          )}

          <motion.a
            href="/trips#request-trip"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="hidden h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#075C46] via-[#0E8F6E] to-[#075C46] bg-[length:220%_100%] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(14,143,110,0.4)] transition-all duration-300 hover:bg-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E8F6E] focus-visible:ring-offset-2 xl:flex dark:focus-visible:ring-offset-slate-950"
          >
            <ArrowRight className="size-[15px]" aria-hidden="true" />
            Request a Trip
          </motion.a>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="grid size-11 place-items-center rounded-full border border-[#DCE6E1] text-[#4B5A55] transition-colors hover:bg-[#F0F6F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E8F6E] focus-visible:ring-offset-2 xl:hidden dark:border-[#1D2E28] dark:text-[#EAF3EF] dark:hover:bg-[#0F1B17] dark:focus-visible:ring-offset-slate-950"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="overflow-hidden border-t border-[#DCE6E1] bg-white xl:hidden dark:border-[#1D2E28] dark:bg-[#101E19]"
          >
            <div className="space-y-1 px-4 py-4 sm:px-6">
              {navigation.map((item, index) => {
                const isActive =
                  item.href === "/#home"
                    ? pathname === "/"
                    : pathname === item.href;

                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex min-h-12 items-center rounded-full px-4 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-[#0E8F6E]/15 text-[#075C46] font-semibold dark:bg-[#0E8F6E]/15 dark:text-[#3FCB9B]"
                        : "text-[#4B5A55] hover:bg-[#0E8F6E]/10 hover:text-[#075C46] dark:text-[#EAF3EF] dark:hover:bg-emerald-400/10 dark:hover:text-[#3FCB9B]"
                    }`}
                  >
                    {item.label}
                  </motion.a>
                );
              })}
              {isPending ? (
                <div className="mt-3 h-24 animate-pulse rounded-full bg-[#F0F6F3] dark:bg-[#0F1B17]" />
              ) : user ? (
                <div className="mt-3 space-y-2 border-t border-[#DCE6E1] pt-4 dark:border-[#1D2E28]">
                  <div className="flex items-center gap-3 rounded-full bg-[#F4F8F6] p-3 dark:bg-[#101E19]">
                    <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#0E8F6E] text-sm font-bold text-white">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={`${user.name || "RouteSync user"} profile`}
                          className="size-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        initials || "RS"
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#0B1512] dark:text-[#EAF3EF]">
                        {user.name || "RouteSync User"}
                      </p>
                      <p className="truncate text-xs text-[#4B5A55] dark:text-[#9FB3AC]">
                        {user.email}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#0E8F6E] dark:text-[#3FCB9B]">
                        {roleLabel}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={dashboardRoute}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0E8F6E] px-4 text-sm font-semibold text-white dark:bg-[#0E8F6E] dark:text-[#0B1512]"
                  >
                    <LayoutDashboard className="size-[18px]" />
                    Open {roleLabel} Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-rose-200 text-sm font-semibold text-rose-600 dark:border-rose-900 dark:text-rose-400"
                  >
                    <LogOut className="size-[18px]" /> Log out
                  </button>
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#DCE6E1] pt-4 dark:border-[#1D2E28]">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#DCE6E1] text-sm font-semibold text-[#4B5A55] dark:border-[#1D2E28] dark:text-[#EAF3EF]"
                  >
                    <LogIn className="size-[17px]" /> Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0E8F6E] px-3 text-sm font-semibold text-white dark:bg-[#0E8F6E] dark:text-[#0B1512]"
                  >
                    <UserPlus className="size-[17px]" /> Register
                  </Link>
                </div>
              )}
              <a
                href="/trips#request-trip"
                onClick={() => setIsMenuOpen(false)}
                className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0E8F6E] px-5 text-base font-semibold text-white sm:hidden"
              >
                <BusFront className="size-5" aria-hidden="true" />
                Request a Trip
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}