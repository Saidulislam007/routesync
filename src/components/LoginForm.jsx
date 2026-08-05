"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="w-full max-w-[440px]"
    >
      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">WELCOME BACK</p>
      <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">Your next shared trip is waiting.</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">Log in with your verified company email to request, match, and manage office trips.</p>

      <form className="mt-8 space-y-5" onSubmit={(event) => event.preventDefault()}>
        <div>
          <label htmlFor="login-email" className="text-sm font-semibold text-slate-800 dark:text-slate-200">Work email</label>
          <div className="relative mt-2">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
            <input id="login-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="login-password" className="text-sm font-semibold text-slate-800 dark:text-slate-200">Password</label>
            <a href="#forgot-password" className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400">Forgot password?</a>
          </div>
          <div className="relative mt-2">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
            <input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="Enter your password" className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-12 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:text-emerald-600">
              {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <input type="checkbox" name="remember" className="size-4 rounded border-slate-300 accent-emerald-600" />
          Keep me signed in on this device
        </label>

        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type="submit" className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400">
          Log in securely
          <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-1" />
        </motion.button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-600 dark:text-slate-400">New to RouteSync? <Link href="/register" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">Create your employee account</Link></p>
    </motion.div>
  );
}