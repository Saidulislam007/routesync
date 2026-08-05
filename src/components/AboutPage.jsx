"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Fuel,
  Leaf,
  MapPinned,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const problems = [
  "Several employees request separate vehicles for nearby destinations.",
  "Uncoordinated departure times increase idle trips and fuel costs.",
  "Transport teams spend too much time matching drivers, routes, and vehicles manually.",
];

const steps = [
  { number: "01", title: "Employee requests a trip", description: "The employee adds pickup, destination, time, passengers, and trip priority.", icon: MapPinned },
  { number: "02", title: "RouteSync finds a match", description: "Nearby routes and compatible departure times are grouped into one shared trip.", icon: Route },
  { number: "03", title: "Company confirms the ride", description: "A vehicle and driver are assigned, employees are notified, and completion is recorded.", icon: CheckCircle2 },
];

const benefits = [
  { icon: Fuel, title: "Lower operating cost", description: "Use fewer vehicles and reduce unnecessary fuel consumption." },
  { icon: Clock3, title: "Faster coordination", description: "Replace calls and spreadsheets with one clear trip workflow." },
  { icon: ShieldCheck, title: "Safer company travel", description: "Keep employee, driver, vehicle, and trip confirmation connected." },
  { icon: Leaf, title: "Smarter sustainability", description: "Reduce repeated journeys and the environmental cost of office travel." },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background pt-16 text-foreground lg:pt-[72px]">
      <Navbar />

      <section className="relative isolate px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24 xl:px-12">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-40 -top-36 size-[34rem] rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-500/10" />
          <div className="hero-grid absolute inset-0 opacity-30 dark:opacity-10" />
        </div>

        <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
            <motion.div variants={reveal} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-emerald-800 backdrop-blur-md sm:text-sm dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Sparkles className="size-4" /> Built for smarter company mobility
            </motion.div>
            <motion.h1 variants={reveal} className="mt-6 max-w-[13ch] text-[clamp(2.7rem,6.5vw,5.2rem)] font-bold leading-[1] tracking-[-0.055em] text-slate-950 dark:text-white">
              Better journeys start with <span className="text-emerald-600 dark:text-emerald-400">better coordination.</span>
            </motion.h1>
            <motion.p variants={reveal} className="mt-6 max-w-xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg sm:leading-8">
              RouteSync is a company vehicle-sharing platform that connects employees travelling along nearby routes at similar times—so one well-planned trip can replace several separate journeys.
            </motion.p>
            <motion.div variants={reveal} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400">
                Join RouteSync <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/#request-trip" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white/75 px-6 text-sm font-semibold text-slate-800 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300">
                Request a shared trip
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative mx-auto w-full max-w-[720px] pb-12">
            <div className="relative ml-auto aspect-[16/11] w-[92%] overflow-hidden rounded-[1.8rem] bg-slate-200 shadow-[0_35px_90px_rgba(15,23,42,0.18)] sm:rounded-[2.2rem] dark:bg-slate-800">
              <Image src="/images/routesync-commute.webp" alt="Bangladeshi employees boarding a shared company shuttle" fill priority unoptimized sizes="(max-width:1024px) 92vw, 52vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[310px]">
                <p className="text-xs font-medium text-emerald-300">OUR PURPOSE</p>
                <p className="mt-1 text-sm font-semibold leading-6 sm:text-base">Make every company vehicle carry more value—not just more fuel.</p>
              </div>
            </div>
            <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-1 left-0 w-[42%] min-w-[150px] max-w-[250px] overflow-hidden rounded-2xl border-4 border-background bg-slate-200 shadow-2xl sm:rounded-3xl dark:bg-slate-800">
              <div className="relative aspect-[4/3]">
                <Image src="/images/routesync-dhaka-route.webp" alt="A shared company shuttle travelling through a Dhaka business district" fill unoptimized sizes="250px" className="object-cover" />
              </div>
            </motion.div>
            <div className="absolute -right-1 -top-5 rounded-2xl border border-emerald-200 bg-white/95 p-3 shadow-xl sm:right-2 sm:top-6 sm:p-4 dark:border-emerald-800 dark:bg-slate-900/95">
              <div className="flex items-center gap-2"><Users className="size-5 text-emerald-600" /><span className="text-sm font-bold text-slate-950 dark:text-white">People-first routes</span></div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Designed for real office teams</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 xl:px-12">
        <div className="mx-auto grid max-w-[1240px] gap-10 rounded-[2rem] border border-slate-200 bg-white/75 p-5 shadow-sm backdrop-blur-md sm:p-8 lg:grid-cols-[0.78fr_1.22fr] lg:p-12 dark:border-slate-800 dark:bg-slate-900/55">
          <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300"><Building2 className="size-6" /></span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">The problem we solve</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">Too many vehicles. Too many repeated routes.</h2>
          </motion.div>
          <div className="grid gap-3">
            {problems.map((problem, index) => (
              <motion.div key={problem} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/60">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">{index + 1}</span>
                <p className="text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">{problem}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">How RouteSync works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">From individual requests to one coordinated trip.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map(({ number, title, description, icon: Icon }, index) => (
              <motion.article key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -6 }} className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-400/10 dark:text-emerald-300"><Icon className="size-6" /></span><span className="text-sm font-bold text-slate-300 dark:text-slate-700">{number}</span></div>
                <h3 className="mt-7 text-xl font-bold tracking-tight text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 xl:px-12">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">Why companies choose it</p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">A practical mobility system for growing Bangladesh businesses.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map(({ icon: Icon, title, description }) => (
                <motion.article key={title} whileHover={{ y: -4 }} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <Icon className="size-6 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="mt-4 font-bold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
                </motion.article>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative aspect-[4/5] max-h-[680px] overflow-hidden rounded-[2rem] bg-slate-200 dark:bg-slate-800">
            <Image src="/images/routesync-shared-team.webp" alt="Bangladeshi colleagues enjoying a coordinated shared commute" fill unoptimized sizes="(max-width:1024px) 100vw, 42vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="text-sm font-medium text-emerald-300">BUILT FOR BANGLADESH</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">Local routes, real traffic patterns, and the teams who move our businesses forward.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-10 sm:px-6 sm:pb-24 lg:px-10 xl:px-12">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-7 overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:p-12 dark:border dark:border-slate-800">
          <div><p className="text-sm font-semibold text-emerald-400">READY TO MOVE SMARTER?</p><h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Turn repeated office journeys into one coordinated route.</h2></div>
          <Link href="/register" className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-semibold text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-emerald-400">Create an account <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-1" /></Link>
        </motion.div>
      </section>
    </main>
  );
}