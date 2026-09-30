"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Crown,
  Luggage,
  MapPin,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { operation } from "@/lib/operations-client";

const tripTypes = [
  { value: "regular", label: "Regular official trip", icon: BriefcaseBusiness, matchable: true },
  { value: "client", label: "Client meeting", icon: Users, matchable: true },
  { value: "branch", label: "Branch visit", icon: Building2, matchable: true },
  { value: "airport", label: "Airport pickup / drop", icon: Plane, matchable: true },
  { value: "emergency", label: "Emergency trip", icon: AlertTriangle, matchable: false },
  { value: "vip", label: "Confidential / VIP", icon: Crown, matchable: false },
];

const initialForm = {
  tripType: "regular",
  pickup: "",
  destination: "",
  journeyDate: "",
  departureTime: "",
  returnTime: "",
  purpose: "",
  passengers: "1",
  hasLuggage: false,
  luggageDetails: "",
  soloRequired: false,
  emergencyReason: "",
  authorization: "",
  flightNumber: "",
  flightTime: "",
};

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

export default function TripsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedType = tripTypes.find((item) => item.value === form.tripType);
  const canMatch = selectedType?.matchable && !form.soloRequired;

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setSubmitted(false);
    setError("");
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitted(null);
    if (isPending) {
      setError("Checking your account. Please try again in a moment.");
      return;
    }
    if (!session) {
      setError("Please log in as an employee before submitting. Then return to this form.");
      return;
    }
    if ((session.user.role || "employee") !== "employee") {
      setError("Only employee accounts can send trip requests.");
      return;
    }
    if (form.pickup.trim().toLowerCase() === form.destination.trim().toLowerCase()) {
      setError("Pickup and destination must be different.");
      return;
    }
    setSubmitting(true);
    try {
      const saved = await operation("requests", {
        method: "POST",
        body: {
          pickup: form.pickup,
          destination: form.destination,
          date: form.journeyDate,
          departure: form.departureTime,
          purpose: form.purpose,
          type: selectedType.label,
          passengers: Number(form.passengers),
          emergency: form.tripType === "emergency",
          solo: form.soloRequired || form.tripType === "vip" || form.tripType === "emergency",
          details: {
            returnTime: form.returnTime,
            hasLuggage: form.hasLuggage,
            luggageDetails: form.luggageDetails,
            emergencyReason: form.emergencyReason,
            authorization: form.authorization,
            flightNumber: form.flightNumber,
            flightTime: form.flightTime,
          },
        },
      });
      setSubmitted(saved);
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Trip request could not be sent.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-emerald-50 via-emerald-50/30 to-transparent dark:from-emerald-950/30 dark:via-slate-950/20" />
      <div className="pointer-events-none absolute -right-32 top-20 size-80 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/10" />

      <section className="relative mx-auto max-w-[1280px] px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-10 lg:pb-14 lg:pt-20 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-900 dark:bg-slate-900/70 dark:text-emerald-300">
            <Sparkles className="size-3.5" /> Smart trip request
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
            One request. The right route. <span className="text-emerald-600 dark:text-emerald-400">Less waste.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
            Tell RouteSync where and when you need to travel. Eligible company trips are checked for nearby colleagues, while emergency and confidential journeys stay private.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            [Route, "Route aware", "Pickup, destination and time checked"],
            [Users, "Team matching", "Nearby colleagues grouped safely"],
            [ShieldCheck, "Private when needed", "VIP and emergency trips excluded"],
          ].map(([Icon, title, text], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + index * 0.08 }}
              className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
            >
              <Icon className="size-5 text-emerald-600 dark:text-emerald-400" />
              <p className="mt-3 font-semibold text-slate-950 dark:text-white">{title}</p>
              <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="request-trip" className="relative mx-auto max-w-[1280px] scroll-mt-24 px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">Trip type</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Choose your journey</h2>
              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {tripTypes.map((item) => {
                  const Icon = item.icon;
                  const active = form.tripType === item.value;
                  return (
                    <motion.button
                      key={item.value}
                      type="button"
                      whileTap={{ scale: 0.985 }}
                      onClick={() => {
                        setSubmitted(null);
                        setError("");
                        setForm((current) => ({ ...current, tripType: item.value }));
                      }}
                      className={`flex min-h-14 items-center gap-3 rounded-xl border px-3 text-left transition ${
                        active
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"
                          : "border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${active ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-800"}`}>
                        <Icon className="size-4.5" />
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-semibold">{item.label}</span>
                      {active && <Check className="size-4 shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>

              <div className={`mt-5 rounded-xl p-4 ${canMatch ? "bg-emerald-50 dark:bg-emerald-400/10" : "bg-amber-50 dark:bg-amber-400/10"}`}>
                <p className={`flex items-center gap-2 text-sm font-semibold ${canMatch ? "text-emerald-800 dark:text-emerald-200" : "text-amber-800 dark:text-amber-200"}`}>
                  {canMatch ? <Users className="size-4" /> : <ShieldCheck className="size-4" />}
                  {canMatch ? "Eligible for smart matching" : "Kept outside general matching"}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                  {canMatch ? "RouteSync will compare nearby routes, departure time and available seats." : "This request follows a direct review and vehicle assignment flow."}
                </p>
              </div>
            </div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-7 lg:p-8 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">Request details</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Plan your company trip</h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">All fields marked * are required</span>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Pickup location *
                <span className="relative block">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 mt-1 size-4 -translate-y-1/2 text-slate-400" />
                  <input className={`${inputClass} pl-10`} name="pickup" value={form.pickup} onChange={updateField} placeholder="e.g. Uttara Sector 7" required />
                </span>
              </label>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Destination *
                <span className="relative block">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 mt-1 size-4 -translate-y-1/2 text-emerald-500" />
                  <input className={`${inputClass} pl-10`} name="destination" value={form.destination} onChange={updateField} placeholder="e.g. Motijheel Office" required />
                </span>
              </label>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Journey date *
                <input className={inputClass} type="date" name="journeyDate" value={form.journeyDate} onChange={updateField} required />
              </label>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Departure time *
                <input className={inputClass} type="time" name="departureTime" value={form.departureTime} onChange={updateField} required />
              </label>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Expected return time
                <input className={inputClass} type="time" name="returnTime" value={form.returnTime} onChange={updateField} />
              </label>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Passenger count *
                <span className="relative block">
                  <select className={`${inputClass} appearance-none`} name="passengers" value={form.passengers} onChange={updateField} required>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => <option key={count} value={count}>{count} passenger{count > 1 ? "s" : ""}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 mt-1 size-4 -translate-y-1/2 text-slate-400" />
                </span>
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2 dark:text-slate-200">
                Trip purpose *
                <textarea className={`${inputClass} min-h-28 resize-y py-3`} name="purpose" value={form.purpose} onChange={updateField} placeholder="Briefly explain the official purpose of this trip" required />
              </label>
            </div>

            <AnimatePresence mode="popLayout">
              {form.tripType === "airport" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-5 grid gap-5 overflow-hidden rounded-2xl bg-sky-50 p-4 sm:grid-cols-2 dark:bg-sky-400/10">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Flight number *<input className={inputClass} name="flightNumber" value={form.flightNumber} onChange={updateField} placeholder="e.g. BG 147" required /></label>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Flight time *<input className={inputClass} type="time" name="flightTime" value={form.flightTime} onChange={updateField} required /></label>
                </motion.div>
              )}
              {form.tripType === "emergency" && (
                <motion.label initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-5 block overflow-hidden rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">
                  Emergency reason *<textarea className={`${inputClass} min-h-24 py-3`} name="emergencyReason" value={form.emergencyReason} onChange={updateField} placeholder="Explain why priority transport is required" required />
                </motion.label>
              )}
              {form.tripType === "vip" && (
                <motion.label initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-5 block overflow-hidden rounded-2xl bg-violet-50 p-4 text-sm font-semibold text-violet-900 dark:bg-violet-400/10 dark:text-violet-200">
                  Authorization / reference *<input className={inputClass} name="authorization" value={form.authorization} onChange={updateField} placeholder="Enter the approving authority or reference" required />
                </motion.label>
              )}
            </AnimatePresence>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <label className="flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-emerald-300 dark:border-slate-700">
                <input className="size-4 accent-emerald-600" type="checkbox" name="hasLuggage" checked={form.hasLuggage} onChange={updateField} />
                <Luggage className="size-5 text-slate-500" />
                <span><span className="block text-sm font-semibold text-slate-800 dark:text-white">Equipment or luggage</span><span className="text-xs text-slate-500 dark:text-slate-400">Reserve suitable cargo space</span></span>
              </label>
              <label className="flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-emerald-300 dark:border-slate-700">
                <input className="size-4 accent-emerald-600" type="checkbox" name="soloRequired" checked={form.soloRequired} onChange={updateField} />
                <ShieldCheck className="size-5 text-slate-500" />
                <span><span className="block text-sm font-semibold text-slate-800 dark:text-white">Solo travel required</span><span className="text-xs text-slate-500 dark:text-slate-400">Exclude from route matching</span></span>
              </label>
            </div>

            <AnimatePresence>
              {form.hasLuggage && (
                <motion.label initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 block overflow-hidden text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Equipment / luggage details *<input className={inputClass} name="luggageDetails" value={form.luggageDetails} onChange={updateField} placeholder="Type, quantity and approximate size" required />
                </motion.label>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {submitted && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200" role="status">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                  <div><p className="text-sm font-semibold">Trip request submitted · {submitted.id}</p><p className="mt-1 text-xs leading-5">Your request is saved and waiting for Manager review. <Link href="/dashboard/employee/requests" className="font-bold underline">View my requests</Link></p></div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error} {!session && <Link href="/login" className="underline">Log in</Link>}</p>}

            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }} type="submit" disabled={submitting || isPending} className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400">
              {submitting ? "Sending request..." : isPending ? "Checking account..." : "Submit trip request"} <ArrowRight className="size-4" />
            </motion.button>
          </motion.form>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-[1280px] px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white sm:p-7 lg:p-9 dark:bg-slate-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">What happens next</p><h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">A clear trip approval flow</h2></div>
            <p className="max-w-md text-sm leading-6 text-slate-400">Every request stays visible from submission to completion.</p>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Request pending", "Route matching", "Vehicle assigned", "Trip completed"].map((step, index) => (
              <div key={step} className="relative rounded-xl border border-white/10 bg-white/5 p-4">
                <span className="grid size-8 place-items-center rounded-lg bg-emerald-500 text-sm font-bold text-slate-950">{index + 1}</span>
                <p className="mt-4 text-sm font-semibold">{step}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${25 * (index + 1)}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
