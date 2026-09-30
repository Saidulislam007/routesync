"use client";
import { operation } from "@/lib/operations-client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

export default function EmployeeOperations({ section, requests, setRequests, NewRequest }) {
  const [trips, setTrips] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState(""), [notice, setNotice] = useState("");
  const load = useCallback(async () => {
    try { const [r, t] = await Promise.all([operation("requests"), operation("trips")]); setRequests(r); setTrips(t); setError(""); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [setRequests]);
  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);
  const submit = async (request) => {
    try { const saved = await operation("requests", { method: "POST", body: { pickup: request.details.pickup, destination: request.details.destination, date: request.details.date, departure: request.details.departure, purpose: request.details.purpose, type: request.type, passengers: request.passengers, emergency: request.details.emergency } }); setRequests((old) => [saved, ...old]); setNotice(`${saved.id} submitted. Manager review is pending.`); return saved; }
    catch (err) { setError(err.message); throw err; }
  };
  const active = trips.filter((t) => !["Completed", "Cancelled"].includes(t.status));
  const history = trips.filter((t) => ["Completed", "Cancelled"].includes(t.status));
  const shown = section === "history" || section === "feedback" ? history : section === "matches" ? active.filter((t) => t.requestIds.length > 1) : active;
  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Employee travel</p><h1 className="mt-2 text-3xl font-bold">{{ overview: "Your dashboard", "new-request": "New trip request", requests: "My requests", matches: "Matched trips", upcoming: "Upcoming trips", history: "Trip history", feedback: "Trip feedback" }[section]}</h1></div>
    {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}{notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p>}
    {section === "new-request" && <NewRequest onSubmit={submit} />}
    {loading && section !== "new-request" ? <p>Loading your trips...</p> : <>
      {section === "overview" && <div className="grid gap-4 sm:grid-cols-3">{[["My requests", requests.length], ["Awaiting review", requests.filter((r) => ["Pending", "Priority review"].includes(r.status)).length], ["Upcoming trips", active.length]].map(([label, count]) => <div key={label} className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><p className="text-3xl font-bold">{count}</p><p className="mt-2 text-sm text-slate-500">{label}</p></div>)}<Link href="/dashboard/employee/new-request" className="rounded-2xl bg-emerald-600 p-6 font-semibold text-white">+ Create a trip request</Link></div>}
      {section === "requests" && (requests.length ? requests.map((r) => <article key={r.id} className="rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><div className="flex justify-between gap-3"><b>{r.id}</b><span className="text-emerald-600">{r.status}</span></div><h2 className="mt-3 text-lg font-bold">{r.route}</h2><p className="mt-2 text-sm text-slate-500">{r.date} · {r.departure} · {r.purpose} · {r.passengers} passenger(s)</p>{r.rejectionReason && <p className="mt-2 text-sm text-rose-600">Reason: {r.rejectionReason}</p>}{r.tripId && <p className="mt-2 text-sm text-emerald-600">Assigned trip: {r.tripId}</p>}</article>) : <p className="rounded-2xl bg-white p-6 dark:bg-slate-900">You have not sent a trip request yet.</p>)}
      {["matches", "upcoming", "history", "feedback"].includes(section) && (shown.length ? shown.map((t) => <article key={t.id} className="rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><div className="flex justify-between gap-3"><b>{t.id}</b><span className="text-emerald-600">{t.status}</span></div><h2 className="mt-3 text-lg font-bold">{t.route}</h2><p className="mt-2 text-sm text-slate-500">{t.date} · {t.departure} · {t.passengers} passenger(s)</p><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">Vehicle: <b>{t.vehicle} · {t.plate}</b></div><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">Driver: <b>{t.driver} · {t.driverPhone}</b></div></div>{section === "feedback" && <p className="mt-4 text-sm text-slate-500">Feedback submission will be available after the trip feedback API is added.</p>}</article>) : <p className="rounded-2xl bg-white p-6 dark:bg-slate-900">No {section === "history" ? "completed" : "assigned"} trips yet.</p>)}
    </>}
  </div>;
}
