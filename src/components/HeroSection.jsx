"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Fuel,
  MapPin,
  Navigation,
  Users,
} from "lucide-react";
import Image from "next/image";

const metrics = [
  { icon: Users, value: "2.4K+", label: "Employees connected" },
  { icon: Fuel, value: "32%", label: "Average fuel saved" },
  { icon: Clock3, value: "4 min", label: "Average trip match" },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:min-h-[calc(100vh-4.5rem)] lg:px-10 lg:py-20 xl:px-12"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-32 -top-36 size-[28rem] rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -bottom-52 -left-28 size-[30rem] rounded-full bg-sky-100/60 blur-3xl dark:bg-sky-500/5" />
        <div className="hero-grid absolute inset-0 opacity-[0.38] dark:opacity-[0.13]" />
      </div>

      <div className="mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:gap-16">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
          className="relative z-10 max-w-2xl"
        >
          <motion.div
            variants={reveal}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur-md sm:text-sm dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-300"
          >
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            Smart office mobility for Bangladesh
          </motion.div>

          <motion.h1
            variants={reveal}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="mt-6 max-w-[12ch] text-[clamp(2.65rem,7vw,5.4rem)] font-bold leading-[0.98] tracking-[-0.055em] text-slate-950 dark:text-white"
          >
            One route. <span className="text-emerald-600 dark:text-emerald-400">More people.</span> Less cost.
          </motion.h1>

          <motion.p
            variants={reveal}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-6 max-w-xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg sm:leading-8"
          >
            RouteSync matches nearby employee trip requests, creates shared rides, and helps companies reduce vehicles, fuel use, and travel stress.
          </motion.p>

          <motion.div
            variants={reveal}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <motion.a
              href="#request-trip"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(5,150,105,0.25)] transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:focus-visible:ring-offset-slate-950"
            >
              Request a shared trip
              <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </motion.a>
            <motion.a
              href="#how-it-works"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/75 px-6 py-3 text-sm font-semibold text-slate-800 backdrop-blur-md transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/70 dark:hover:text-emerald-300 dark:focus-visible:ring-offset-slate-950"
            >
              See how matching works
            </motion.a>
          </motion.div>

          <motion.div
            variants={reveal}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-600 sm:text-sm dark:text-slate-300"
          >
            {["Emergency trip priority", "Verified company access", "Real-time confirmation"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[720px] pb-14 sm:pb-16 lg:mx-0 lg:justify-self-end"
        >
          <div className="relative ml-auto aspect-[4/3] w-[91%] overflow-hidden rounded-[1.75rem] border border-white/70 bg-slate-200 shadow-[0_35px_90px_rgba(15,23,42,0.18)] sm:rounded-[2.2rem] dark:border-slate-700/70 dark:bg-slate-800 dark:shadow-[0_35px_90px_rgba(0,0,0,0.4)]">
            <Image
              src="/images/routesync-commute.webp"
              alt="Bangladeshi office employees sharing a company shuttle in Dhaka"
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 91vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/25 bg-slate-950/55 p-3 text-white backdrop-blur-xl sm:bottom-5 sm:left-5 sm:right-auto sm:min-w-[270px] sm:p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-500 text-slate-950">
                  <Navigation className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs text-white/65">Shared route</p>
                  <p className="mt-0.5 text-sm font-semibold">Uttara → Motijheel</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">4 matched</span>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-1 -top-7 w-[38%] min-w-[128px] max-w-[215px] overflow-hidden rounded-2xl border-4 border-background bg-slate-200 shadow-2xl sm:-left-3 sm:-top-10 sm:rounded-3xl lg:-left-7 dark:bg-slate-800"
          >
            <div className="relative aspect-[4/3]">
              <Image src="/images/routesync-dhaka-route.webp" alt="Company shuttle travelling through a Dhaka business district" fill unoptimized sizes="220px" className="object-cover" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5.8, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-0 flex w-[52%] min-w-[165px] max-w-[255px] items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-2.5 shadow-2xl backdrop-blur-xl sm:right-3 sm:w-[44%] sm:p-3 dark:border-slate-700 dark:bg-slate-900/95"
          >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl sm:size-16">
              <Image src="/images/routesync-shared-team.webp" alt="Bangladeshi colleagues enjoying a shared office commute" fill unoptimized sizes="64px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-900 sm:text-sm dark:text-white">Trip matched!</p>
              <p className="mt-1 flex items-center gap-1 truncate text-[10px] text-slate-500 sm:text-xs dark:text-slate-400">
                <MapPin className="size-3 text-emerald-600" /> 3 nearby colleagues
              </p>
            </div>
          </motion.div>

          <div className="absolute -right-1 -top-5 rounded-2xl border border-emerald-200 bg-white/95 p-3 shadow-xl backdrop-blur-xl sm:right-1 sm:top-5 sm:p-4 dark:border-emerald-800 dark:bg-slate-900/95">
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-500 sm:text-xs dark:text-slate-400">Today saved</p>
            <p className="mt-1 text-lg font-bold text-emerald-600 sm:text-2xl dark:text-emerald-400">৳ 12,480</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.75 }}
        className="mx-auto mt-20 grid max-w-[1440px] grid-cols-1 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 shadow-sm backdrop-blur-md sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/55"
      >
        {metrics.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3 px-5 py-4 sm:justify-center sm:px-4 lg:py-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 sm:text-[11px] lg:text-xs dark:text-slate-400">{label}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}