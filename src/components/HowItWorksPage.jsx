"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  BusFront,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Crown,
  Fuel,
  Luggage,
  MapPin,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const steps = [
  {
    number: "01",
    title: "Create your employee account",
    description:
      "Register with your company details so every request stays inside your verified workplace network.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Request an official trip",
    description:
      "Add your pickup, destination, travel time, purpose, passengers and any luggage or equipment.",
    icon: MapPin,
  },
  {
    number: "03",
    title: "RouteSync checks nearby requests",
    description:
      "Eligible trips are compared using route direction, departure time, available seats and vehicle capacity.",
    icon: Route,
  },
  {
    number: "04",
    title: "Receive your assignment",
    description:
      "After approval, you receive the final pickup time, vehicle, driver and shared trip information.",
    icon: BusFront,
  },
  {
    number: "05",
    title: "Travel and confirm completion",
    description:
      "Take the shared journey, follow live status updates and confirm when your official trip is complete.",
    icon: CheckCircle2,
  },
];

const matchableTrips = [
  [BriefcaseBusiness, "Regular official trip"],
  [Users, "Client meeting"],
  [Building2, "Branch visit"],
  [Plane, "Airport pickup / drop"],
];

const privateTrips = [
  [AlertTriangle, "Emergency trip", "Moves to priority review"],
  [Crown, "Confidential / VIP", "Remains private"],
  [ShieldCheck, "Solo travel required", "No shared matching"],
  [Luggage, "Special equipment", "Separate vehicle when required"],
];

const faqs = [
  {
    question: "What happens if no suitable trip is found?",
    answer:
      "Your request stays pending for transport review. A manager can assign a vehicle directly or wait for another eligible request.",
  },
  {
    question: "Can I edit or cancel my request?",
    answer:
      "Yes. You can edit or cancel before final approval. Once a vehicle is assigned, your company transport policy will apply.",
  },
  {
    question: "Who can see my trip information?",
    answer:
      "Only authorized company users involved in the trip can access necessary details. Confidential and VIP requests stay outside general matching.",
  },
  {
    question: "How are emergency trips handled?",
    answer:
      "Emergency requests skip automatic shared matching and move directly to priority review and vehicle assignment.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.55, ease: "easeOut" },
};

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="overflow-hidden">
      <section className="relative isolate">
        <div className="hero-grid pointer-events-none absolute inset-0 -z-20 opacity-70" />
        <div className="pointer-events-none absolute -right-40 top-0 -z-10 size-[32rem] rounded-full bg-emerald-200/45 blur-3xl dark:bg-emerald-500/10" />
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[0.88fr_1.12fr] lg:px-10 lg:pb-24 lg:pt-20 xl:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 backdrop-blur dark:border-emerald-900 dark:bg-slate-900/80 dark:text-emerald-300">
              <Sparkles className="size-3.5" /> Simple company travel
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-[3.6rem] lg:leading-[1.04] dark:text-white">
              From trip request to a smarter
              <span className="text-emerald-600 dark:text-emerald-400"> shared journey.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
              RouteSync helps employees request official transport, find safe route matches and receive an approved vehicle assignment—without confusing steps.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/trips#request-trip"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
              >
                Request a trip <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <UserCheck className="size-4" /> Create employee account
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative mx-auto w-full max-w-2xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border-4 border-white bg-slate-200 shadow-[0_28px_80px_rgba(15,23,42,0.2)] dark:border-slate-800">
              <Image
                src="/images/routesync-dhaka-route.webp"
                alt="Company shuttle travelling through a Dhaka business district"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition duration-700 hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">One coordinated vehicle</p>
                <p className="mt-2 max-w-md text-xl font-semibold tracking-tight sm:text-2xl">Nearby colleagues. Similar schedule. One smarter route.</p>
              </div>
            </div>
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-3.5 shadow-xl sm:left-7 dark:border-emerald-900 dark:bg-slate-900">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"><Fuel className="size-5" /></span>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">Estimated saving</p><p className="text-sm font-bold text-slate-950 dark:text-white">32% less fuel</p></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24 xl:px-12">
        <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Your journey in five steps</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">Easy enough for every employee</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">Every step tells you what happens next and when action is needed.</p>
        </motion.div>

        <div className="relative mt-12 grid gap-4 md:grid-cols-5">
          <div className="absolute left-[10%] right-[10%] top-9 hidden h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent md:block dark:via-emerald-800" />
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.number}
                {...reveal}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl md:text-center dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="relative mx-0 grid size-14 place-items-center rounded-2xl bg-emerald-600 text-white shadow-[0_10px_30px_rgba(5,150,105,0.25)] md:mx-auto"><Icon className="size-6" /></span>
                <span className="mt-5 block text-xs font-bold tracking-[0.16em] text-emerald-600 dark:text-emerald-400">STEP {step.number}</span>
                <h3 className="mt-2 text-base font-bold leading-6 text-slate-950 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{step.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950 lg:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:px-10 xl:px-12">
          <motion.div {...reveal}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">A real matching example</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">See why these requests travel together</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">RouteSync compares direction, nearby pickup points, departure time and available capacity—not just exact addresses.</p>
            <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {["Pickup points are within a practical range", "Destinations follow the same travel direction", "Departure times are close enough", "The assigned vehicle has enough seats"].map((item) => (
                <p key={item} className="flex items-center gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"><Check className="size-3.5" /></span>{item}</p>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal} className="rounded-[1.75rem] bg-slate-950 p-5 shadow-2xl sm:p-7 dark:bg-slate-900">
            <div className="grid gap-3">
              {[
                ["RA", "Rahim A.", "Uttara", "Motijheel", "8:00 AM"],
                ["NS", "Nadia S.", "Airport Road", "Motijheel", "8:15 AM"],
                ["SK", "Sakib K.", "Uttara", "Paltan", "8:10 AM"],
              ].map(([initials, name, from, to, time], index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.09 }}
                  className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-xs font-bold text-white">{initials}</span>
                  <div><p className="text-sm font-semibold text-white">{name}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">{from} <ArrowRight className="size-3" /> {to}</p></div>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-slate-200"><Clock3 className="size-3.5" />{time}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 sm:grid-cols-3">
              {[["86%", "Route match"], ["3", "Employees"], ["1", "Shared vehicle"]].map(([value, label]) => (
                <div key={label} className="text-center"><p className="text-2xl font-bold text-emerald-300">{value}</p><p className="mt-1 text-xs text-emerald-100/70">{label}</p></div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24 xl:px-12">
        <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Matching rules</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">Not every trip should be shared</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">RouteSync respects urgency, confidentiality, capacity and company travel policies.</p>
        </motion.div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <motion.div {...reveal} className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/70 p-5 sm:p-7 dark:border-emerald-900 dark:bg-emerald-400/5">
            <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-emerald-600 text-white"><Users className="size-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">Smart matching</p><h3 className="text-xl font-bold text-slate-950 dark:text-white">Usually eligible to share</h3></div></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {matchableTrips.map(([Icon, label]) => <div key={label} className="flex min-h-14 items-center gap-3 rounded-xl bg-white p-3 text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200"><Icon className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />{label}</div>)}
            </div>
          </motion.div>

          <motion.div {...reveal} className="rounded-[1.5rem] border border-amber-200 bg-amber-50/70 p-5 sm:p-7 dark:border-amber-900 dark:bg-amber-400/5">
            <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-amber-500 text-slate-950"><ShieldCheck className="size-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">Protected flow</p><h3 className="text-xl font-bold text-slate-950 dark:text-white">Outside general matching</h3></div></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {privateTrips.map(([Icon, label, note]) => <div key={label} className="flex min-h-14 items-center gap-3 rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900"><Icon className="size-5 shrink-0 text-amber-600 dark:text-amber-400" /><div><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{note}</p></div></div>)}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950 lg:py-24">
        <div className="mx-auto max-w-[1060px] px-4 sm:px-6 lg:px-10">
          <motion.div {...reveal} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Always know what comes next</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">One clear trip status</h2>
          </motion.div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {["Submitted", "Matching", "Approved", "Assigned", "In progress", "Completed"].map((status, index) => (
              <motion.div key={status} {...reveal} transition={{ duration: 0.4, delay: index * 0.05 }} className="relative rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-900">
                <span className="mx-auto grid size-8 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">{index + 1}</span>
                <p className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-200">{status}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:items-center dark:border-slate-800 dark:bg-slate-900">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600 sm:mt-0 dark:text-emerald-400" />
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300"><strong className="text-slate-900 dark:text-white">Privacy first:</strong> employees only see the details needed for their approved journey. Emergency, confidential and VIP information remains protected.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1100px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-10 lg:py-24">
        <motion.div {...reveal}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Quick answers</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">Employee questions</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">Everything you need to know before requesting your first trip.</p>
        </motion.div>
        <motion.div {...reveal} className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={faq.question} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen} className="flex min-h-16 w-full items-center justify-between gap-4 px-4 text-left sm:px-5">
                  <span className="text-sm font-semibold text-slate-900 sm:text-base dark:text-white">{faq.question}</span>
                  <ChevronDown className={`size-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} className="overflow-hidden">
                  <p className="border-t border-slate-100 px-4 py-4 text-sm leading-6 text-slate-600 sm:px-5 dark:border-slate-800 dark:text-slate-300">{faq.answer}</p>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-6 lg:px-10 lg:pb-24 xl:px-12">
        <motion.div {...reveal} className="relative overflow-hidden rounded-[1.75rem] bg-slate-950 px-5 py-10 text-center text-white sm:px-10 sm:py-14 dark:bg-slate-900">
          <div className="pointer-events-none absolute left-1/2 top-0 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/25 blur-3xl" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Ready when you are</p>
          <h2 className="relative mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Plan your first smarter company trip.</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Add the route and schedule. RouteSync will guide the rest.</p>
          <div className="relative mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/trips#request-trip" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400">Request a trip <ArrowRight className="size-4" /></Link>
            <Link href="/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10">Create employee account</Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
