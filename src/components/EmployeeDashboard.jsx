"use client";

import { authClient } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BusFront,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  History,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquareText,
  Moon,
  Navigation,
  Package,
  Phone,
  Plus,
  Route,
  Search,
  Sparkles,
  Star,
  Sun,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import EmployeeOperations from "@/components/operations/EmployeeOperations";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard/employee" },
  {
    label: "New trip request",
    icon: Plus,
    href: "/dashboard/employee/new-request",
  },
  {
    label: "My requests",
    icon: ClipboardList,
    count: 3,
    href: "/dashboard/employee/requests",
  },
  {
    label: "Matched trips",
    icon: Sparkles,
    count: 1,
    href: "/dashboard/employee/matches",
  },
  {
    label: "Upcoming trips",
    icon: Navigation,
    href: "/dashboard/employee/upcoming",
  },
  { label: "Trip history", icon: History, href: "/dashboard/employee/history" },
  {
    label: "Feedback",
    icon: MessageSquareText,
    href: "/dashboard/employee/feedback",
  },
];

const seedRequests = [
  {
    id: "RQ-2128",
    route: "Uttara → Motijheel",
    date: "08 Aug 2026",
    time: "09:30 AM",
    type: "Client meeting",
    passengers: 2,
    status: "Pending",
  },
  {
    id: "RQ-2119",
    route: "Airport Road → Motijheel",
    date: "09 Aug 2026",
    time: "10:00 AM",
    type: "Branch visit",
    passengers: 1,
    status: "Match suggested",
  },
  {
    id: "RQ-2107",
    route: "Dhanmondi → Gulshan 1",
    date: "10 Aug 2026",
    time: "11:30 AM",
    type: "Regular official",
    passengers: 1,
    status: "Pending",
  },
];

const matchedTrips = [
  {
    id: "MT-3051",
    route: "Uttara & Airport Road → Motijheel",
    date: "09 Aug 2026",
    time: "09:50–10:15 AM",
    match: 92,
    colleagues: 3,
    pickupGap: "1.2 km",
    status: "Awaiting manager approval",
  },
];

const upcomingTrips = [
  {
    id: "RT-4208",
    route: "Uttara → Motijheel",
    date: "08 Aug 2026",
    time: "08:30 AM",
    pickup: "House Building Bus Stop",
    passengers: 6,
    driver: "Kamal Hossain",
    driverId: "DR-018",
    phone: "+880 19•• ••• 417",
    vehicle: "Toyota HiAce",
    plate: "Dhaka Metro-CHA 15-4821",
    status: "Driver accepted",
  },
];

const historyTrips = [
  {
    id: "RT-4172",
    route: "Banani → Tejgaon",
    date: "04 Aug 2026",
    type: "Client meeting",
    status: "Completed",
    rating: 5,
  },
  {
    id: "RT-4158",
    route: "Dhanmondi → Gulshan 1",
    date: "01 Aug 2026",
    type: "Branch visit",
    status: "Completed",
    rating: null,
  },
  {
    id: "RT-4136",
    route: "Mirpur → Motijheel",
    date: "29 Jul 2026",
    type: "Regular official",
    status: "Cancelled",
    rating: null,
  },
];

const pageInfo = {
  overview: [
    "Employee workspace",
    "Good morning",
    "Request company travel and stay updated from approval to arrival.",
  ],
  "new-request": [
    "Plan official travel",
    "New trip request",
    "Share your travel details so RouteSync can find the safest, smartest option.",
  ],
  requests: [
    "Request tracking",
    "My requests",
    "Follow every submitted request and its latest approval status.",
  ],
  matches: [
    "Shared travel",
    "Matched trips",
    "Review route groups suggested from nearby colleagues and similar schedules.",
  ],
  upcoming: [
    "Ready to travel",
    "Upcoming trips",
    "Find your vehicle, driver and pickup confirmation details.",
  ],
  history: [
    "Past travel",
    "Trip history",
    "Review completed and cancelled official journeys.",
  ],
  feedback: [
    "Help us improve",
    "Trip feedback",
    "Rate completed trips and share a short experience note.",
  ],
};

const statusStyle = {
  Pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  "Match suggested":
    "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  Completed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  Cancelled: "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
};

function readLocalRequests() {
  if (typeof window === "undefined") return seedRequests;
  try {
    const saved = JSON.parse(
      localStorage.getItem("routesync-employee-requests") || "null",
    );
    return Array.isArray(saved) ? saved : seedRequests;
  } catch {
    return seedRequests;
  }
}

function EmployeeShell({ children, user }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const profileRef = useRef(null);
  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "EM";

  useEffect(() => {
    const saved = localStorage.getItem("routesync-theme");
    const next = saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const closeProfile = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeProfile);
    return () => document.removeEventListener("mousedown", closeProfile);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("routesync-theme", next ? "dark" : "light");
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    setMenuOpen(false);
    await authClient.signOut();
    window.location.href = "/login";
  };

  const avatar = (size = "size-11", radius = "rounded-xl") => (
    <span
      className={`grid ${size} shrink-0 place-items-center overflow-hidden ${radius} bg-emerald-600 text-sm font-bold text-white`}
    >
      {user?.image ? (
        <img
          src={user.image}
          alt={`${user.name || "Employee"} profile`}
          className="size-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        initials
      )}
    </span>
  );

  const sidebar = (
    <div className="flex h-full flex-col bg-white p-5 dark:bg-slate-950">
      <Link
        href="/"
        className="flex items-center gap-3"
        aria-label="RouteSync home"
      >
        <span className="grid size-11 place-items-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
          <Route className="size-5" />
        </span>
        <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
          Route
          <span className="text-emerald-600 dark:text-emerald-400">Sync</span>
        </span>
      </Link>
      <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/70 dark:bg-emerald-400/10">
        <div className="flex items-center gap-3">
          {avatar()}
          <div className="min-w-0">
            <p className="truncate font-bold text-slate-950 dark:text-white">
              {user?.name || "Employee"}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {user?.company || "RouteSync"} · {user?.employeeId || "Employee"}
            </p>
          </div>
        </div>
      </div>
      <nav className="mt-7 space-y-1" aria-label="Employee dashboard">
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard/employee"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`flex min-h-12 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition ${active ? "bg-slate-950 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"}`}
            >
              <Icon className="size-[18px]" />
              <span className="flex-1">{item.label}</span>
              {item.count && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${active ? "bg-white/15" : "bg-slate-100 dark:bg-slate-800"}`}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="mt-auto flex min-h-12 items-center gap-3 border-t border-slate-200 pt-5 text-left text-sm font-semibold text-slate-500 hover:text-rose-600 dark:border-slate-800 dark:text-slate-400"
      >
        <LogOut className="size-[18px]" /> Log out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[300px] border-r border-slate-200 lg:block dark:border-slate-800">
        {sidebar}
      </aside>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.24 }}
              className="fixed inset-y-0 left-0 z-[60] w-[min(310px,88vw)] border-r border-slate-200 lg:hidden dark:border-slate-800"
            >
              {sidebar}
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute right-3 top-3 grid size-10 place-items-center rounded-xl bg-white/80 text-slate-600 dark:bg-slate-900 dark:text-slate-200"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="lg:pl-[300px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="grid size-11 place-items-center rounded-xl border border-slate-200 lg:hidden dark:border-slate-700"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <p className="text-sm font-bold">Employee Travel</p>
              <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Thursday, 07 August 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden h-11 w-64 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 md:flex dark:border-slate-700 dark:bg-slate-900">
              <Search className="size-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search my trips"
              />
            </div>
            <button
              onClick={toggleTheme}
              className="grid size-11 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
              aria-label="Toggle theme"
            >
              {dark ? (
                <Sun className="size-[18px]" />
              ) : (
                <Moon className="size-[18px]" />
              )}
            </button>
            <button
              className="relative grid size-11 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
              aria-label="Notifications"
            >
              <Bell className="size-[18px]" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500" />
            </button>
            <div ref={profileRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 p-1.5 pr-3 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:hover:border-emerald-700 dark:hover:bg-emerald-400/10"
                aria-expanded={profileOpen}
                aria-controls="employee-profile-menu"
              >
                {avatar("size-8", "rounded-lg")}
                <span className="hidden max-w-32 text-left xl:block">
                  <span className="block truncate text-xs font-bold">
                    {user?.name || "Employee"}
                  </span>
                  <span className="block truncate text-[10px] capitalize text-slate-500 dark:text-slate-400">
                    {user?.role || "employee"}
                  </span>
                </span>
                <ChevronDown
                  className={`size-4 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    id="employee-profile-menu"
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-[calc(100%+0.65rem)] z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                      {avatar("size-12", "rounded-xl")}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                          {user?.name || "RouteSync User"}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {user?.email}
                        </p>
                        <p className="mt-1 text-xs capitalize text-emerald-600 dark:text-emerald-400">
                          {user?.role || "employee"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/dashboard/employee"
                      onClick={() => setProfileOpen(false)}
                      className="mt-2 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
                    >
                      <LayoutDashboard className="size-[18px]" /> Employee
                      dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-400/10"
                    >
                      <LogOut className="size-[18px]" /> Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

function PageHeading({ section, user }) {
  const [eyebrow, title, description] = pageInfo[section];
  const firstName = user?.name?.trim().split(" ")[0] || "Employee";
  const resolvedTitle =
    section === "overview" ? `${title}, ${firstName}` : title;
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
        {resolvedTitle}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function Overview({ requests, user }) {
  const cards = [
    {
      label: "Pending requests",
      value: requests.filter((item) => item.status === "Pending").length,
      note: "Waiting for manager review",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
      href: "/dashboard/employee/requests",
    },
    {
      label: "Matched trips",
      value: matchedTrips.length,
      note: "Route suggestion ready",
      icon: Sparkles,
      tone: "bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
      href: "/dashboard/employee/matches",
    },
    {
      label: "Upcoming trips",
      value: upcomingTrips.length,
      note: "Driver already accepted",
      icon: Navigation,
      tone: "bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300",
      href: "/dashboard/employee/upcoming",
    },
    {
      label: "Completed trips",
      value: historyTrips.filter((item) => item.status === "Completed").length,
      note: "This month",
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
      href: "/dashboard/employee/history",
    },
  ];
  const next = upcomingTrips[0];
  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <PageHeading section="overview" user={user} />
        <Link
          href="/dashboard/employee/new-request"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-600 dark:bg-emerald-500 dark:text-slate-950"
        >
          <Plus className="size-[18px]" /> New trip request
        </Link>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <span
                className={`grid size-11 place-items-center rounded-xl ${card.tone}`}
              >
                <Icon className="size-5" />
              </span>
              <p className="mt-5 text-3xl font-bold">{card.value}</p>
              <p className="mt-1 font-bold">{card.label}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {card.note}
                </p>
                <Link href={card.href} aria-label={`View ${card.label}`}>
                  <ArrowRight className="size-4 text-slate-400" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">
              Your next journey
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">{next.route}</h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                {next.status}
              </span>
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            <Info
              icon={CalendarDays}
              label="Departure"
              value={`${next.date} · ${next.time}`}
            />
            <Info icon={MapPin} label="Pickup" value={next.pickup} />
            <Info
              icon={Users}
              label="Shared with"
              value={`${next.passengers - 1} colleagues`}
            />
          </div>
          <div className="mx-5 mb-5 flex flex-col gap-3 rounded-2xl bg-slate-950 p-4 text-white sm:flex-row sm:items-center sm:justify-between dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <BusFront className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold">
                  {next.vehicle} · {next.plate}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {next.driver} · {next.phone}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/employee/upcoming"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-xs font-bold text-slate-950"
            >
              View trip <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold">Recent activity</h2>
          <div className="mt-5 space-y-5">
            <Activity
              icon={Sparkles}
              title="Route match found"
              text="RQ-2119 grouped with 2 nearby colleagues"
              time="18 min ago"
            />
            <Activity
              icon={UserCheck}
              title="Driver accepted"
              text="Kamal Hossain accepted RT-4208"
              time="42 min ago"
            />
            <Activity
              icon={CheckCircle2}
              title="Trip completed"
              text="RT-4172 reached Tejgaon on time"
              time="3 days ago"
            />
          </div>
        </section>
      </div>
    </>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
      <Icon className="size-5 text-emerald-600 dark:text-emerald-400" />
      <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}
function Activity({ icon: Icon, title, text, time }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {text}
        </p>
        <p className="mt-1 text-[10px] font-semibold text-slate-400">{time}</p>
      </div>
    </div>
  );
}

function NewRequest({ onSubmit }) {
  const initial = {
    pickup: "",
    destination: "",
    date: "",
    departure: "",
    returnTime: "",
    type: "Regular official trip",
    purpose: "",
    passengers: "1",
    luggage: false,
    emergency: false,
    solo: false,
  };
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };
  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    ["pickup", "destination", "date", "departure", "purpose"].forEach(
      (field) => {
        if (!String(form[field]).trim())
          nextErrors[field] = "This field is required";
      },
    );
    if (
      form.pickup.trim().toLowerCase() ===
        form.destination.trim().toLowerCase() &&
      form.pickup.trim()
    )
      nextErrors.destination = "Destination must be different from pickup";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const id = `RQ-${String(Date.now()).slice(-4)}`;
    try {
    const saved = await onSubmit({
      id,
      route: `${form.pickup} → ${form.destination}`,
      date: form.date,
      time: form.departure,
      type: form.type,
      passengers: Number(form.passengers),
      status: form.emergency ? "Priority review" : "Pending",
      details: form,
    });
    setSuccess(
      `${saved.id} submitted successfully. Transport Manager review is pending.`,
    );
    setForm(initial);
    } catch (error) { setErrors({ purpose: error.message }); }
  };
  return (
    <>
      <PageHeading section="new-request" />
      <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_320px]">
        <form
          onSubmit={submit}
          noValidate
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Pickup location"
              name="pickup"
              value={form.pickup}
              onChange={update}
              error={errors.pickup}
              placeholder="e.g. Uttara House Building"
            />
            <Field
              label="Destination"
              name="destination"
              value={form.destination}
              onChange={update}
              error={errors.destination}
              placeholder="e.g. Motijheel Office"
            />
            <Field
              label="Journey date"
              name="date"
              type="date"
              value={form.date}
              onChange={update}
              error={errors.date}
            />
            <Field
              label="Departure time"
              name="departure"
              type="time"
              value={form.departure}
              onChange={update}
              error={errors.departure}
            />
            <Field
              label="Expected return time"
              name="returnTime"
              type="time"
              value={form.returnTime}
              onChange={update}
            />
            <label className="block">
              <span className="text-sm font-bold">Trip type</span>
              <select
                name="type"
                value={form.type}
                onChange={update}
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
              >
                <option>Regular official trip</option>
                <option>Client meeting</option>
                <option>Branch visit</option>
                <option>Airport pickup/drop</option>
                <option>Emergency trip</option>
                <option>Confidential/VIP trip</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-bold">Trip purpose</span>
              <textarea
                name="purpose"
                value={form.purpose}
                onChange={update}
                rows={3}
                placeholder="Briefly explain why this trip is required"
                className={`mt-2 w-full rounded-xl border bg-white p-3 text-sm outline-none focus:border-emerald-500 dark:bg-slate-950 ${errors.purpose ? "border-rose-500" : "border-slate-200 dark:border-slate-700"}`}
              />
              {errors.purpose && (
                <p className="mt-1 text-xs text-rose-600">{errors.purpose}</p>
              )}
            </label>
            <label className="block">
              <span className="text-sm font-bold">Passenger count</span>
              <input
                name="passengers"
                type="number"
                min="1"
                max="20"
                value={form.passengers}
                onChange={update}
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <CheckOption
              name="luggage"
              checked={form.luggage}
              onChange={update}
              icon={Package}
              label="Equipment or luggage"
            />
            <CheckOption
              name="emergency"
              checked={form.emergency}
              onChange={update}
              icon={AlertCircle}
              label="Emergency request"
            />
            <CheckOption
              name="solo"
              checked={form.solo}
              onChange={update}
              icon={UserCheck}
              label="Solo travel required"
            />
          </div>
          {success && (
            <div
              role="status"
              className="mt-5 flex gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
            >
              <CheckCircle2 className="size-5 shrink-0" />
              {success}
            </div>
          )}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
            <button
              type="button"
              onClick={() => setForm(initial)}
              className="min-h-12 rounded-xl border border-slate-200 px-5 text-sm font-bold dark:border-slate-700"
            >
              Clear form
            </button>
            <button
              type="submit"
              className="min-h-12 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700"
            >
              Submit request
            </button>
          </div>
        </form>
        <aside className="space-y-4">
          <div className="rounded-2xl bg-slate-950 p-5 text-white dark:border dark:border-slate-800 dark:bg-slate-900">
            <Sparkles className="size-6 text-emerald-400" />
            <h2 className="mt-4 text-lg font-bold">How matching works</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              RouteSync compares your time, pickup and destination with eligible
              colleague requests.
            </p>
            <div className="mt-5 space-y-3 text-xs">
              <p>≤ 30 min departure gap</p>
              <p>≤ 2 km pickup gap</p>
              <p>≤ 3 km destination gap</p>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800 dark:border-amber-900 dark:bg-amber-400/10 dark:text-amber-200">
            <AlertCircle className="size-5" />
            <p className="mt-3 text-sm font-bold">Privacy and priority</p>
            <p className="mt-2 text-xs leading-5">
              Emergency and Confidential/VIP requests remain outside automatic
              matching.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function Field({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <input
        {...props}
        className={`mt-2 min-h-12 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:bg-slate-950 ${error ? "border-rose-500" : "border-slate-200 dark:border-slate-700"}`}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </label>
  );
}
function CheckOption({ icon: Icon, label, ...props }) {
  return (
    <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <input type="checkbox" {...props} className="size-4 accent-emerald-600" />
      <Icon className="size-[18px] text-slate-400" />
      <span className="text-xs font-bold">{label}</span>
    </label>
  );
}

function RequestList({ requests }) {
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    if (!selectedRequest) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedRequest(null);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedRequest]);

  return (
    <>
      <PageHeading section="requests" />
      <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {requests.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 border-b border-slate-200 p-5 last:border-0 sm:flex-row sm:items-center dark:border-slate-800"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-xs font-bold text-white">
              {item.id.slice(-2)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold">{item.route}</h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle[item.status] || statusStyle.Pending}`}
                >
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {item.date} · {item.time} · {item.type} · {item.passengers}{" "}
                passenger{item.passengers > 1 ? "s" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedRequest(item)}
              className="min-h-11 rounded-xl border border-slate-200 px-4 text-xs font-bold transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:hover:border-emerald-700 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
              aria-label={`View details for request ${item.id}`}
            >
              View details
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget)
                setSelectedRequest(null);
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-details-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6 dark:border-slate-800">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                      {selectedRequest.id}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle[selectedRequest.status] || statusStyle.Pending}`}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                  <h2
                    id="request-details-title"
                    className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-white"
                  >
                    {selectedRequest.route}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                  aria-label="Close request details"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Info
                    icon={CalendarDays}
                    label="Journey date"
                    value={selectedRequest.date}
                  />
                  <Info
                    icon={Clock3}
                    label="Departure time"
                    value={selectedRequest.time}
                  />
                  <Info
                    icon={Navigation}
                    label="Trip type"
                    value={selectedRequest.type}
                  />
                  <Info
                    icon={Users}
                    label="Passengers"
                    value={`${selectedRequest.passengers} passenger${selectedRequest.passengers > 1 ? "s" : ""}`}
                  />
                </div>

                {selectedRequest.details && (
                  <div className="mt-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Trip information
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {selectedRequest.details.purpose ||
                        "No additional purpose provided."}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                      {selectedRequest.details.returnTime && (
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                          Return: {selectedRequest.details.returnTime}
                        </span>
                      )}
                      {selectedRequest.details.luggage && (
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                          Equipment/luggage
                        </span>
                      )}
                      {selectedRequest.details.emergency && (
                        <span className="rounded-full bg-rose-50 px-3 py-1.5 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300">
                          Emergency request
                        </span>
                      )}
                      {selectedRequest.details.solo && (
                        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                          Solo travel required
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-slate-200 p-4 sm:p-5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="min-h-11 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-emerald-600 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Matches() {
  return (
    <>
      <PageHeading section="matches" />
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {matchedTrips.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
                {item.match}% match
              </span>
              <span className="text-xs font-bold text-slate-400">
                {item.id}
              </span>
            </div>
            <h2 className="mt-5 text-lg font-bold">{item.route}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {item.date} · {item.time}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Info icon={Users} label="Colleagues" value={item.colleagues} />
              <Info icon={MapPin} label="Pickup gap" value={item.pickupGap} />
            </div>
            <div className="mt-5 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
              {item.status}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Upcoming() {
  const [confirmed, setConfirmed] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const trip = upcomingTrips[0];
  return (
    <>
      <PageHeading section="upcoming" />
      <article className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
              {trip.id}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{trip.route}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {trip.date} · {trip.time}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${cancelled ? statusStyle.Cancelled : "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300"}`}
          >
            {cancelled ? "Cancelled" : trip.status}
          </span>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/70">
            <BusFront className="size-6 text-emerald-600" />
            <p className="mt-4 text-xs font-bold uppercase text-slate-400">
              Vehicle
            </p>
            <p className="mt-1 font-bold">{trip.vehicle}</p>
            <p className="mt-1 text-sm text-slate-500">{trip.plate}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/70">
            <UserCheck className="size-6 text-emerald-600" />
            <p className="mt-4 text-xs font-bold uppercase text-slate-400">
              Driver
            </p>
            <p className="mt-1 font-bold">
              {trip.driver} · {trip.driverId}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <Phone className="size-3.5" />
              {trip.phone}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end dark:border-slate-800">
          <button
            disabled={cancelled}
            onClick={() => setCancelled(true)}
            className="min-h-12 rounded-xl border border-rose-200 px-5 text-sm font-bold text-rose-600 disabled:opacity-40"
          >
            Cancel trip
          </button>
          <button
            disabled={cancelled || confirmed}
            onClick={() => setConfirmed(true)}
            className="min-h-12 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white disabled:opacity-60"
          >
            {confirmed ? "Pickup confirmed" : "Confirm pickup"}
          </button>
        </div>
      </article>
    </>
  );
}

function HistoryPage() {
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    if (!selectedTrip) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedTrip(null);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedTrip]);

  return (
    <>
      <PageHeading section="history" />
      <div className="mt-7 grid gap-4">
        {historyTrips.map((trip) => (
          <article
            key={trip.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold">{trip.route}</h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle[trip.status]}`}
                >
                  {trip.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {trip.id} · {trip.date} · {trip.type}
              </p>
            </div>
            {trip.rating && (
              <div className="flex gap-1 text-amber-500">
                {Array.from({ length: trip.rating }, (_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => setSelectedTrip(trip)}
              className="min-h-11 rounded-xl border border-slate-200 px-4 text-xs font-bold transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:hover:border-emerald-700 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
              aria-label={`View details for trip ${trip.id}`}
            >
              Trip details
            </button>
          </article>
        ))}
      </div>

      <AnimatePresence>
        {selectedTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedTrip(null);
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-trip-details-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6 dark:border-slate-800">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                      {selectedTrip.id}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle[selectedTrip.status]}`}
                    >
                      {selectedTrip.status}
                    </span>
                  </div>
                  <h2
                    id="history-trip-details-title"
                    className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-white"
                  >
                    {selectedTrip.route}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTrip(null)}
                  className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                  aria-label="Close trip details"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
                <Info
                  icon={CalendarDays}
                  label="Trip date"
                  value={selectedTrip.date}
                />
                <Info
                  icon={Navigation}
                  label="Trip type"
                  value={selectedTrip.type}
                />
                <Info
                  icon={CheckCircle2}
                  label="Final status"
                  value={selectedTrip.status}
                />
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <Star className="size-5 text-amber-500" />
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Your rating
                  </p>
                  {selectedTrip.rating ? (
                    <div className="mt-2 flex gap-1 text-amber-500">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`size-4 ${index < selectedTrip.rating ? "fill-current" : "text-slate-300 dark:text-slate-600"}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                      Not submitted
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 p-5 dark:border-slate-800">
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {selectedTrip.status === "Cancelled"
                    ? "This official trip was cancelled before completion."
                    : "This official trip was completed and saved in your travel history."}
                </p>
              </div>

              <div className="flex justify-end border-t border-slate-200 p-4 sm:p-5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTrip(null)}
                  className="min-h-11 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-emerald-600 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Feedback() {
  const eligible = historyTrips.filter(
    (item) => item.status === "Completed" && !item.rating,
  );
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHeading section="feedback" />
      <div className="mt-7 max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
        {eligible.length ? (
          <>
            <label className="block text-sm font-bold">
              Select completed trip
              <select className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
                {eligible.map((trip) => (
                  <option key={trip.id}>
                    {trip.id} · {trip.route}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-6 text-sm font-bold">Overall rating</p>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <button
                  key={item}
                  onClick={() => setRating(item)}
                  aria-label={`${item} stars`}
                  className="grid size-11 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <Star
                    className={`size-5 ${item <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                  />
                </button>
              ))}
            </div>
            <label className="mt-6 block text-sm font-bold">
              Your experience
              <textarea
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
                placeholder="Tell us about the driver, vehicle and journey"
              />
            </label>
            {sent && (
              <p className="mt-4 text-sm font-semibold text-emerald-600">
                Thank you. Your feedback has been saved.
              </p>
            )}
            <button
              disabled={!rating}
              onClick={() => setSent(true)}
              className="mt-6 min-h-12 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white disabled:opacity-50"
            >
              Submit feedback
            </button>
          </>
        ) : (
          <p>No completed trip is waiting for feedback.</p>
        )}
      </div>
    </>
  );
}

export default function EmployeeDashboard({ section = "overview" }) {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();
  const [requests, setRequests] = useState([]);

  const userRole = session?.user?.role || "employee";

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (userRole === "manager") router.replace("/dashboard/manager");
    else if (userRole === "driver") router.replace("/dashboard/driver");
    else if (userRole === "admin") router.replace("/dashboard/admin");
    else if (userRole !== "employee") router.replace("/login");
  }, [isPending, router, session, userRole]);

  if (isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600 dark:border-slate-800 dark:border-t-emerald-400" />
          <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="max-w-sm rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm dark:border-rose-900 dark:bg-slate-900">
          <AlertCircle className="mx-auto size-7 text-rose-600" />
          <p className="mt-3 font-bold text-slate-950 dark:text-white">
            Unable to verify your session
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Please refresh the page or log in again.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white dark:bg-emerald-500 dark:text-slate-950"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (!session || userRole !== "employee") return null;

  return (
    <EmployeeShell user={session.user}>
      <main className="mx-auto max-w-[1540px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <EmployeeOperations section={section} requests={requests} setRequests={setRequests} NewRequest={NewRequest} />
      </main>
    </EmployeeShell>
  );
}