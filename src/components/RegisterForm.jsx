"use client";

import { motion } from "framer-motion";
import { Building2, Eye, EyeOff, IdCard, LockKeyhole, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const fields = [
  { id: "full-name", name: "name", label: "Full name", type: "text", placeholder: "Your full name", icon: UserRound, autoComplete: "name" },
  { id: "work-email", name: "email", label: "Work email", type: "email", placeholder: "you@company.com", icon: Mail, autoComplete: "email" },
  { id: "company-name", name: "company", label: "Company name", type: "text", placeholder: "Your organization", icon: Building2, autoComplete: "organization" },
  { id: "employee-id", name: "employeeId", label: "Employee ID", type: "text", placeholder: "e.g. EMP-1042", icon: IdCard, autoComplete: "off" },
];

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-[1.6rem] border border-slate-200 bg-white/95 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">Employee onboarding</p>
          <h1 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-slate-950 sm:text-3xl dark:text-white">Create your RouteSync account</h1>
        </div>
        <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:block dark:bg-emerald-400/10 dark:text-emerald-300">Step 1 of 2</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Use your official company details. Your organization can verify access before your first trip.</p>

      <form className="mt-7" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(({ id, name, label, type, placeholder, icon: Icon, autoComplete }) => (
            <div key={id}>
              <label htmlFor={id} className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</label>
              <div className="relative mt-2">
                <Icon className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
                <input id={id} name={name} type={type} autoComplete={autoComplete} required placeholder={placeholder} className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <label htmlFor="register-password" className="text-sm font-semibold text-slate-800 dark:text-slate-200">Create password</label>
          <div className="relative mt-2">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
            <input id="register-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8} placeholder="Minimum 8 characters" className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-12 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:text-emerald-600">
              {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
            </button>
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-600 sm:text-sm dark:text-slate-400">
          <input type="checkbox" required className="mt-0.5 size-4 shrink-0 rounded border-slate-300 accent-emerald-600" />
          <span>I agree to RouteSync&apos;s terms and confirm that the company information provided is accurate.</span>
        </label>

        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type="submit" className="mt-6 min-h-12 w-full rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400">Continue to verification</motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">Already registered? <Link href="/login" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">Log in here</Link></p>
    </motion.div>
  );
}