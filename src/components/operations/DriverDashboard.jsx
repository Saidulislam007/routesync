"use client";

import { authClient } from "@/lib/auth-client";
import { operation } from "@/lib/operations-client";
import { ArrowRight, BusFront, CalendarDays, CheckCircle2, Clock3, History, LayoutDashboard, LogOut, MapPin, Menu, Moon, Navigation, RefreshCw, Sun, Users, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const nextStatus = {
  Scheduled: ["Driver accepted", "Accept trip"],
  "Driver accepted": ["In progress", "Start trip"],
  "In progress": ["Completed", "Complete trip"],
};
const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "assigned", label: "Assigned trips", icon: Navigation },
  { id: "history", label: "Trip history", icon: History },
];
const badge = {
  Scheduled: "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
  "Driver accepted": "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  "In progress": "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  Completed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export default function DriverDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [trips, setTrips] = useState([]);
  const [section, setSection] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try { setError(""); setTrips(await operation("trips")); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
    else if (!isPending && session?.user?.role !== "driver") router.replace("/dashboard/employee");
    else if (session?.user?.role === "driver") {
      const timer = setTimeout(load, 0);
      return () => clearTimeout(timer);
    }
  }, [isPending, session, router, load]);

  useEffect(() => {
    const timer = setTimeout(() => setDark(document.documentElement.classList.contains("dark")), 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("routesync-theme", next ? "dark" : "light");
  };

  const advance = async (trip) => {
    setBusy(trip.id);
    try {
      await operation(`trips/${trip.id}/status`, { method: "PATCH", body: { status: nextStatus[trip.status][0] } });
      await load();
    } catch (err) { setError(err.message); }
    finally { setBusy(""); }
  };
  const logout = async () => { await authClient.signOut(); router.replace("/login"); };

  if (isPending || !session || session.user.role !== "driver") return <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950"><div className="text-center"><div className="mx-auto size-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" /><p className="mt-4 text-sm text-slate-500">Checking your session...</p></div></div>;

  const active = trips.filter((trip) => !["Completed", "Cancelled"].includes(trip.status));
  const completed = trips.filter((trip) => ["Completed", "Cancelled"].includes(trip.status));
  const visible = section === "history" ? completed : active;
  const firstName = session.user.name?.trim().split(" ")[0] || "Driver";
  const initials = (session.user.name || "Driver").split(" ").filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join("");

  const sidebar = (
    <div className="flex h-full flex-col bg-white p-5 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tight text-slate-950 dark:text-white"><span className="grid size-10 place-items-center rounded-xl bg-emerald-600 text-white"><Navigation className="size-5" /></span><span>Route<span className="text-emerald-600">Sync</span></span></Link>
        <button onClick={() => setMenuOpen(false)} className="rounded-lg p-2 lg:hidden" aria-label="Close menu"><X className="size-5" /></button>
      </div>
      <p className="mt-2 pl-[52px] text-xs text-slate-500">Driver workspace</p>
      <p className="mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
      <nav className="mt-3 space-y-1.5" aria-label="Driver dashboard">{sections.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setSection(id); setMenuOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${section === id ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"}`}><Icon className="size-[18px]" />{label}{id === "assigned" && active.length > 0 && <span className="ml-auto rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] text-white">{active.length}</span>}</button>)}</nav>
      <div className="mt-auto pt-8"><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-xs font-bold text-white">{initials}</span><div className="min-w-0"><p className="truncate text-sm font-bold">{session.user.name}</p><p className="truncate text-xs text-slate-500">Driver</p></div></div><button onClick={logout} className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-500/10"><LogOut className="size-[18px]" />Log out</button></div>
    </div>
  );

  return <div className="flex min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-slate-200 dark:border-slate-800 lg:block">{sidebar}</aside>
    {menuOpen && <div className="fixed inset-0 z-[80] bg-slate-950/55 lg:hidden" onClick={() => setMenuOpen(false)}><aside className="h-full w-[min(85vw,290px)]" onClick={(event) => event.stopPropagation()}>{sidebar}</aside></div>}
    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90"><div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:h-[72px] lg:px-8"><div className="flex items-center gap-3"><button onClick={() => setMenuOpen(true)} className="grid size-10 place-items-center rounded-xl border border-slate-200 lg:hidden dark:border-slate-700" aria-label="Open menu"><Menu className="size-5" /></button><div><p className="text-sm font-bold">Driver operations</p><p className="hidden text-xs text-slate-500 sm:block">Your trips and daily activity</p></div></div><div className="flex items-center gap-2"><button onClick={load} className="grid size-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-700" aria-label="Refresh trips"><RefreshCw className="size-[18px]" /></button><button onClick={toggleTheme} className="grid size-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-700" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}</button><span className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold dark:border-slate-700 sm:flex"><span className="grid size-7 place-items-center rounded-lg bg-emerald-600 text-xs text-white">{initials}</span>{firstName}</span></div></div></header>
      <main className="mx-auto max-w-[1540px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.17em] text-emerald-600 dark:text-emerald-400">Driver dashboard</p><h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{section === "overview" ? `Good to see you, ${firstName}` : sections.find((item) => item.id === section)?.label}</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{section === "history" ? "See the trips you have completed." : "Review your assignments and keep everyone informed."}</p></div><span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-300">● Active driver account</span></div>
        {error && <p role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}
        <div className="mt-7 grid gap-4 sm:grid-cols-3">{[["Assigned trips", active.length, Navigation], ["In progress", active.filter((trip) => trip.status === "In progress").length, BusFront], ["Completed trips", completed.filter((trip) => trip.status === "Completed").length, CheckCircle2]].map(([label, value, Icon]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><span className="grid size-10 place-items-center rounded-xl bg-slate-50 text-emerald-600 dark:bg-slate-800"><Icon className="size-5" /></span><p className="mt-4 text-3xl font-bold">{value}</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p></article>)}</div>
        <section className="mt-8"><div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-600">{section === "history" ? "Past journeys" : "Your schedule"}</p><h2 className="mt-1 text-xl font-bold">{section === "history" ? "Trip history" : "Assigned trips"}</h2></div>{section === "overview" && active.length > 0 && <button onClick={() => setSection("assigned")} className="flex items-center gap-1 text-sm font-semibold text-emerald-600">View all <ArrowRight className="size-4" /></button>}</div>
          {loading ? <div className="grid min-h-44 place-items-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" /></div> : visible.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-900"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10"><CalendarDays className="size-7" /></span><h3 className="mt-4 font-bold">{section === "history" ? "No completed trips yet" : "No trips assigned yet"}</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{section === "history" ? "Your completed trips will appear here." : "When the Transport Manager assigns a trip to your account, its route, vehicle and time will appear here."}</p></div> : <div className="grid gap-4 xl:grid-cols-2">{visible.map((trip) => <article key={trip.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-800"><div><p className="text-xs font-bold uppercase tracking-wide text-emerald-600">{trip.id}</p><h3 className="mt-2 text-lg font-bold">{trip.route}</h3></div><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${badge[trip.status] || badge.Scheduled}`}>{trip.status}</span></div><div className="grid gap-3 p-5 text-sm sm:grid-cols-2">{[[Clock3, "DATE & TIME", `${trip.date} · ${trip.departure}`], [BusFront, "VEHICLE", `${trip.vehicle} · ${trip.plate}`], [Users, "PASSENGERS", `${trip.passengers} passenger(s)`], [MapPin, "REQUESTS", trip.requestIds?.join(", ") || "Assigned trip"]].map(([Icon, label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70"><Icon className="size-5 text-emerald-600" /><p className="mt-3 text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 font-semibold">{value}</p></div>)}</div>{nextStatus[trip.status] && <div className="border-t border-slate-100 p-5 dark:border-slate-800"><button disabled={busy === trip.id} onClick={() => advance(trip)} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">{busy === trip.id ? "Saving..." : nextStatus[trip.status][1]} <ArrowRight className="size-4" /></button></div>}</article>)}</div>}
        </section>
      </main>
    </div>
  </div>;
}
