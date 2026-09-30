"use client";

import { authClient } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BusFront,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Fuel,
  Gauge,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Moon,
  MoreHorizontal,
  Navigation,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Sun,
  UserRound,
  Users,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard/manager" },
  {
    label: "Requests",
    icon: CalendarDays,
    count: 12,
    href: "/dashboard/manager/requests",
  },
  {
    label: "Match suggestions",
    icon: Sparkles,
    count: 4,
    href: "/dashboard/manager/matches",
  },
  {
    label: "Today’s trips",
    icon: Navigation,
    href: "/dashboard/manager/trips",
  },
  { label: "Vehicles", icon: BusFront, href: "/dashboard/manager/vehicles" },
  { label: "Drivers", icon: Users, href: "/dashboard/manager/drivers" },
  { label: "Reports", icon: Gauge, href: "/dashboard/manager/reports" },
];

const summaryCards = [
  {
    label: "Pending requests",
    value: "12",
    change: "+3 since 9 AM",
    icon: CalendarDays,
    tone: "emerald",
  },
  {
    label: "Suggested matches",
    value: "4",
    change: "11 requests grouped",
    icon: Sparkles,
    tone: "violet",
  },
  {
    label: "Available vehicles",
    value: "18",
    change: "5 currently assigned",
    icon: BusFront,
    tone: "blue",
  },
  {
    label: "Emergency queue",
    value: "2",
    change: "Needs attention",
    icon: ShieldAlert,
    tone: "amber",
  },
];

const matchSuggestions = [
  {
    id: "MT-2048",
    score: 92,
    priority: "Client meeting",
    priorityTone: "emerald",
    requests: 3,
    passengers: 4,
    from: "Uttara & Airport Road",
    to: "Motijheel",
    date: "Today",
    time: "10:00–10:20 AM",
    pickupDistance: "1.2 km",
    destinationDistance: "0.8 km",
  },
  {
    id: "MT-2049",
    score: 86,
    priority: "Branch visit",
    priorityTone: "blue",
    requests: 2,
    passengers: 3,
    from: "Dhanmondi & Kalabagan",
    to: "Gulshan 1",
    date: "Today",
    time: "11:30–11:50 AM",
    pickupDistance: "1.7 km",
    destinationDistance: "1.1 km",
  },
];

const todayTrips = [
  {
    id: "RT-3104",
    route: "Uttara → Motijheel",
    time: "08:30 AM",
    vehicle: "Dhaka Metro-GA 15-4821",
    driver: "Kamal Hossain",
    status: "In progress",
    statusTone: "emerald",
  },
  {
    id: "RT-3108",
    route: "Gulshan → Airport",
    time: "10:45 AM",
    vehicle: "Dhaka Metro-CHA 18-9032",
    driver: "Jamal Uddin",
    status: "Driver accepted",
    statusTone: "blue",
  },
  {
    id: "RT-3112",
    route: "Mirpur → Banani",
    time: "12:10 PM",
    vehicle: "Awaiting assignment",
    driver: "Not assigned",
    status: "Delayed",
    statusTone: "amber",
  },
];

const vehicles = [
  {
    id: "VH-018",
    name: "Toyota HiAce",
    plate: "Dhaka Metro-CHA 19-4728",
    seats: 11,
    location: "Uttara Depot",
    status: "Available",
    maintenance: false,
  },
  {
    id: "VH-024",
    name: "Toyota Noah",
    plate: "Dhaka Metro-GA 17-8142",
    seats: 7,
    location: "Banani Office",
    status: "Available",
    maintenance: false,
  },
  {
    id: "VH-009",
    name: "Nissan Caravan",
    plate: "Dhaka Metro-CHA 16-2204",
    seats: 12,
    location: "Motijheel Office",
    status: "Maintenance overdue",
    maintenance: true,
  },
  {
    id: "VH-031",
    name: "Toyota Coaster",
    plate: "Dhaka Metro-BA 20-6721",
    seats: 22,
    location: "Tejgaon Depot",
    status: "Available",
    maintenance: false,
  },
  {
    id: "VH-036",
    name: "Mitsubishi L300",
    plate: "Dhaka Metro-CHA 21-6402",
    seats: 10,
    location: "Gulshan Office",
    status: "Available",
    maintenance: false,
  },
  {
    id: "VH-041",
    name: "Toyota Axio",
    plate: "Dhaka Metro-GA 22-3018",
    seats: 4,
    location: "Airport Parking",
    status: "Available",
    maintenance: false,
  },
  {
    id: "VH-047",
    name: "Hyundai H-1",
    plate: "Dhaka Metro-CHA 23-1846",
    seats: 9,
    location: "Bashundhara Office",
    status: "Available",
    maintenance: false,
  },
];

const drivers = [
  {
    id: "DR-046",
    name: "Arif Rahman",
    initials: "AR",
    location: "Uttara Depot",
    completed: 238,
  },
  {
    id: "DR-031",
    name: "Mohammad Selim",
    initials: "MS",
    location: "Banani Office",
    completed: 184,
  },
  {
    id: "DR-052",
    name: "Sabbir Ahmed",
    initials: "SA",
    location: "Motijheel Office",
    completed: 206,
  },
  {
    id: "DR-063",
    name: "Jamal Uddin",
    initials: "JU",
    location: "Gulshan Office",
    completed: 219,
  },
  {
    id: "DR-071",
    name: "Kamal Hossain",
    initials: "KH",
    location: "Tejgaon Depot",
    completed: 256,
  },
  {
    id: "DR-084",
    name: "Hasan Mahmud",
    initials: "HM",
    location: "Bashundhara Office",
    completed: 173,
  },
];

const cardTone = {
  emerald:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  violet:
    "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
};

const badgeTone = {
  emerald:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-400/10 dark:text-emerald-300",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/15 dark:bg-blue-400/10 dark:text-blue-300",
  amber:
    "bg-amber-50 text-amber-700 ring-amber-600/15 dark:bg-amber-400/10 dark:text-amber-300",
};

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label="RouteSync home"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-[0_8px_24px_rgba(5,150,105,0.24)]">
        <Navigation className="size-5" />
      </span>
      <span className="text-xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white">
        Route
        <span className="text-emerald-600 dark:text-emerald-400">Sync</span>
      </span>
    </Link>
  );
}

function Sidebar({ mobile = false, onClose, user, isSessionPending }) {
  const pathname = usePathname();
  const role = user?.role || "manager";
  const initials = (user?.name || user?.email || "Transport Manager")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <aside
      className={`${mobile ? "flex h-full" : "hidden lg:flex"} w-[272px] shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950`}
    >
      <div className="flex items-center justify-between px-2">
        <Logo />
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <div className="mx-2 mt-7 rounded-2xl border border-emerald-100 bg-emerald-50 p-3.5 dark:border-emerald-900 dark:bg-emerald-400/10">
        {isSessionPending ? (
          <div className="h-10 animate-pulse rounded-xl bg-emerald-200/70 dark:bg-emerald-400/10" />
        ) : (
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-emerald-600 text-sm font-bold text-white">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={`${user.name || "Manager"} profile`}
                  className="size-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                initials || "TM"
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                {user?.name || "Transport Manager"}
              </p>
              <p className="mt-0.5 truncate text-xs capitalize text-slate-500 dark:text-slate-400">
                {role}
                {user?.company ? ` · ${user.company}` : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      <nav className="mt-6 flex-1 space-y-1" aria-label="Manager dashboard">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition ${
                active
                  ? "bg-slate-950 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              <Icon className="size-[18px] shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.count && (
                <span
                  className={`grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    active
                      ? "bg-white/15 text-white dark:bg-slate-950/15 dark:text-slate-950"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-200 pt-4 dark:border-slate-800">
        <button className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          <Settings className="size-[18px]" /> Settings
        </button>
        <Link
          href="/"
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-700 dark:text-slate-300 dark:hover:bg-rose-400/10 dark:hover:text-rose-300"
        >
          <LogOut className="size-[18px]" /> Back to website
        </Link>
      </div>
    </aside>
  );
}

function scheduleRange(time) {
  const [startText = "", endText = ""] = String(time || "")
    .split(/[–-]/)
    .map((item) => item.trim());
  const endPeriod = endText.match(/\b(AM|PM)\b/i)?.[1]?.toUpperCase();
  const startPeriod =
    startText.match(/\b(AM|PM)\b/i)?.[1]?.toUpperCase() || endPeriod;
  const toMinutes = (value, period) => {
    const match = value.match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };
  const start = toMinutes(startText, startPeriod);
  const end = toMinutes(endText, endPeriod || startPeriod);
  return start === null || end === null
    ? null
    : [start, end <= start ? end + 12 * 60 : end];
}

function schedulesOverlap(first, second) {
  const a = scheduleRange(first);
  const b = scheduleRange(second);
  return Boolean(a && b && a[0] < b[1] && a[1] > b[0]);
}

export function AssignmentModal({ suggestion, onClose, onConfirm }) {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [activeOperations, setActiveOperations] = useState([]);
  const [vehiclePage, setVehiclePage] = useState(0);
  const [driverPage, setDriverPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const vehicleHasConflict = (vehicleId) =>
    activeOperations.some(
      (item) =>
        item.vehicleId === vehicleId &&
        !["Cancelled", "Completed"].includes(item.trip?.status) &&
        schedulesOverlap(
          suggestion.time,
          `${item.trip?.departure || ""}–${item.trip?.arrival || ""}`,
        ),
    );
  const driverHasConflict = (driverId) =>
    activeOperations.some(
      (item) =>
        item.driverId === driverId &&
        !["Cancelled", "Completed"].includes(item.trip?.status) &&
        schedulesOverlap(
          suggestion.time,
          `${item.trip?.departure || ""}–${item.trip?.arrival || ""}`,
        ),
    );
  const eligibleVehicles = vehicles.filter(
    (vehicle) =>
      !vehicle.maintenance &&
      vehicle.seats >= suggestion.passengers &&
      !vehicleHasConflict(vehicle.id),
  );
  const availableDrivers = drivers.filter(
    (driver) => !driverHasConflict(driver.id),
  );
  const canConfirm =
    eligibleVehicles.some((vehicle) => vehicle.id === selectedVehicle) &&
    availableDrivers.some((driver) => driver.id === selectedDriver);
  const vehiclePageCount = Math.ceil(vehicles.length / itemsPerPage);
  const driverPageCount = Math.ceil(drivers.length / itemsPerPage);
  const visibleVehicles = vehicles.slice(
    vehiclePage * itemsPerPage,
    (vehiclePage + 1) * itemsPerPage,
  );
  const visibleDrivers = drivers.slice(
    driverPage * itemsPerPage,
    (driverPage + 1) * itemsPerPage,
  );

  useEffect(() => {
    const syncOperations = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem("routesync-manager-operations") || "[]",
        );
        setActiveOperations(Array.isArray(saved) ? saved : []);
      } catch {
        setActiveOperations([]);
      }
    };
    syncOperations();
    window.addEventListener("routesync-manager-update", syncOperations);
    return () =>
      window.removeEventListener("routesync-manager-update", syncOperations);
  }, []);

  useEffect(() => {
    setSelectedVehicle(eligibleVehicles[0]?.id || "");
    setSelectedDriver(availableDrivers[0]?.id || "");
  }, [suggestion.id, activeOperations.length]);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(
        window.innerWidth < 640 ? 1 : window.innerWidth < 900 ? 2 : 3,
      );
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    setVehiclePage(0);
    setDriverPage(0);
  }, [itemsPerPage, suggestion.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.24 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[1.5rem] bg-white shadow-2xl sm:rounded-[1.5rem] dark:bg-slate-900"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur sm:p-6 dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
              {suggestion.id} · {suggestion.score}% match
            </p>
            <h2
              id="assignment-title"
              className="mt-1 text-xl font-bold text-slate-950 dark:text-white"
            >
              Assign vehicle and driver
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {suggestion.from} → {suggestion.to}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close assignment modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-7 p-5 sm:p-6">
          <section>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white">
                  Choose a vehicle
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Required capacity: {suggestion.passengers} passengers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:inline dark:bg-emerald-400/10 dark:text-emerald-300">
                  {eligibleVehicles.length} eligible
                </span>
                <span className="min-w-8 text-center text-[11px] font-semibold text-slate-400">
                  {vehiclePage + 1}/{vehiclePageCount}
                </span>
                <button
                  type="button"
                  disabled={vehiclePage === 0}
                  onClick={() =>
                    setVehiclePage((current) => Math.max(0, current - 1))
                  }
                  className="grid size-9 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:text-slate-300"
                  aria-label="Previous vehicles"
                >
                  <ArrowRight className="size-4 rotate-180" />
                </button>
                <button
                  type="button"
                  disabled={vehiclePage >= vehiclePageCount - 1}
                  onClick={() =>
                    setVehiclePage((current) =>
                      Math.min(vehiclePageCount - 1, current + 1),
                    )
                  }
                  className="grid size-9 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:text-slate-300"
                  aria-label="Next vehicles"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
            <div
              className={`mt-4 grid gap-3 ${itemsPerPage === 1 ? "grid-cols-1" : itemsPerPage === 2 ? "grid-cols-2" : "grid-cols-3"}`}
            >
              {visibleVehicles.map((vehicle) => {
                const capacityBlocked = vehicle.seats < suggestion.passengers;
                const scheduleBlocked = vehicleHasConflict(vehicle.id);
                const blocked =
                  vehicle.maintenance || capacityBlocked || scheduleBlocked;
                const blockReason = vehicle.maintenance
                  ? "Maintenance overdue"
                  : capacityBlocked
                    ? `Needs at least ${suggestion.passengers} seats`
                    : scheduleBlocked
                      ? "Schedule conflict"
                      : "Available";
                const active = !blocked && selectedVehicle === vehicle.id;
                return (
                  <button
                    key={vehicle.id}
                    type="button"
                    disabled={blocked}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    className={`relative rounded-2xl border p-4 text-left transition ${
                      blocked
                        ? "cursor-not-allowed border-rose-200 bg-rose-50/60 opacity-70 dark:border-rose-900 dark:bg-rose-400/5"
                        : active
                          ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/10 dark:bg-emerald-400/10"
                          : "border-slate-200 hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`grid size-10 place-items-center rounded-xl ${vehicle.maintenance ? "bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
                      >
                        {vehicle.maintenance ? (
                          <Wrench className="size-5" />
                        ) : (
                          <BusFront className="size-5" />
                        )}
                      </span>
                      {active && (
                        <CheckCircle2 className="size-5 text-emerald-600" />
                      )}
                    </div>
                    <p className="mt-3 text-sm font-bold text-slate-950 dark:text-white">
                      {vehicle.name}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {vehicle.plate}
                    </p>
                    <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <p className="flex items-center gap-1.5">
                        <Users className="size-3.5" /> {vehicle.seats} seats
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="size-3.5" /> {vehicle.location}
                      </p>
                    </div>
                    <p
                      className={`mt-3 text-[11px] font-semibold ${blocked ? "text-rose-600 dark:text-rose-300" : "text-emerald-600 dark:text-emerald-400"}`}
                    >
                      {blockReason}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white">
                  Choose a driver
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Available for this schedule
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 sm:inline dark:bg-blue-400/10 dark:text-blue-300">
                  {availableDrivers.length} available
                </span>
                <span className="min-w-8 text-center text-[11px] font-semibold text-slate-400">
                  {driverPage + 1}/{driverPageCount}
                </span>
                <button
                  type="button"
                  disabled={driverPage === 0}
                  onClick={() =>
                    setDriverPage((current) => Math.max(0, current - 1))
                  }
                  className="grid size-9 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:text-slate-300"
                  aria-label="Previous drivers"
                >
                  <ArrowRight className="size-4 rotate-180" />
                </button>
                <button
                  type="button"
                  disabled={driverPage >= driverPageCount - 1}
                  onClick={() =>
                    setDriverPage((current) =>
                      Math.min(driverPageCount - 1, current + 1),
                    )
                  }
                  className="grid size-9 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:text-slate-300"
                  aria-label="Next drivers"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
            <div
              className={`mt-4 grid gap-3 ${itemsPerPage === 1 ? "grid-cols-1" : itemsPerPage === 2 ? "grid-cols-2" : "grid-cols-3"}`}
            >
              {visibleDrivers.map((driver) => {
                const scheduleBlocked = driverHasConflict(driver.id);
                const active = !scheduleBlocked && selectedDriver === driver.id;
                return (
                  <button
                    key={driver.id}
                    type="button"
                    disabled={scheduleBlocked}
                    onClick={() => setSelectedDriver(driver.id)}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${scheduleBlocked ? "cursor-not-allowed border-rose-200 bg-rose-50/60 opacity-70 dark:border-rose-900 dark:bg-rose-400/5" : active ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/10 dark:bg-emerald-400/10" : "border-slate-200 hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-700"}`}
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-xs font-bold text-white dark:bg-slate-800">
                      {driver.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                        {driver.name}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
                        {driver.location}
                      </p>
                      <p
                        className={`mt-1 text-[11px] font-semibold ${scheduleBlocked ? "text-rose-600 dark:text-rose-300" : "text-emerald-600 dark:text-emerald-400"}`}
                      >
                        {scheduleBlocked
                          ? "Schedule conflict"
                          : `${driver.completed} trips`}
                      </p>
                    </div>
                    {active && (
                      <Check className="size-4 shrink-0 text-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {(!eligibleVehicles.length || !availableDrivers.length) && (
            <div
              role="alert"
              className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-400/10 dark:text-amber-200"
            >
              {!eligibleVehicles.length && !availableDrivers.length
                ? "No vehicle with enough seats and no conflict-free driver are available for this schedule."
                : !eligibleVehicles.length
                  ? "No conflict-free vehicle with enough seats is available for this schedule."
                  : "No conflict-free driver is available for this schedule."}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="min-h-12 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <motion.button
              whileTap={canConfirm ? { scale: 0.98 } : undefined}
              type="button"
              disabled={!canConfirm}
              onClick={() =>
                canConfirm &&
                onConfirm({ suggestion, selectedVehicle, selectedDriver })
              }
              className="min-h-12 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
            >
              Confirm assignment
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OverviewReports() {
  const [liveMetrics, setLiveMetrics] = useState({
    sharedTrips: 0,
    vehiclesAvoided: 0,
    fuelSaved: 0,
    costSaved: 0,
    passengers: 0,
  });

  useEffect(() => {
    const calculate = () => {
      let operations = [];
      try {
        operations = JSON.parse(
          localStorage.getItem("routesync-manager-operations") || "[]",
        );
      } catch {
        operations = [];
      }
      const active = operations.filter(
        (item) => item.trip?.status !== "Cancelled",
      );
      const vehiclesAvoided = active.reduce(
        (total, item) =>
          total + Math.max(0, (item.requestIds?.length || 1) - 1),
        0,
      );
      const fuelSaved = active.reduce(
        (total, item) =>
          total +
          (Math.max(0, (item.requestIds?.length || 1) - 1) *
            (item.estimatedDistanceKm || 12)) /
            8,
        0,
      );
      setLiveMetrics({
        sharedTrips: active.length,
        vehiclesAvoided,
        fuelSaved,
        costSaved: fuelSaved * 130 + vehiclesAvoided * 250,
        passengers: active.reduce(
          (total, item) => total + (item.trip?.passengers || 0),
          0,
        ),
      });
    };
    calculate();
    window.addEventListener("routesync-manager-update", calculate);
    window.addEventListener("routesync-trip-cancelled", calculate);
    return () => {
      window.removeEventListener("routesync-manager-update", calculate);
      window.removeEventListener("routesync-trip-cancelled", calculate);
    };
  }, []);

  const impactCards = [
    {
      label: "Cost saved",
      value: `৳${Math.round(liveMetrics.costSaved).toLocaleString("en-US")}`,
      note: "Fuel plus avoided dispatch cost",
      icon: CircleDollarSign,
      tone: "emerald",
    },
    {
      label: "Fuel saved",
      value: `${liveMetrics.fuelSaved.toFixed(1)} L`,
      note: `Across ${liveMetrics.sharedTrips} active shared trips`,
      icon: Fuel,
      tone: "blue",
    },
    {
      label: "Vehicles avoided",
      value: liveMetrics.vehiclesAvoided,
      note: "Cancelled trips excluded",
      icon: BusFront,
      tone: "amber",
    },
    {
      label: "Shared passengers",
      value: liveMetrics.passengers,
      note: "Approved grouped passengers",
      icon: CheckCircle2,
      tone: "emerald",
    },
  ];
  const weekly = [
    { day: "Sat", value: 58 },
    { day: "Sun", value: 72 },
    { day: "Mon", value: 66 },
    { day: "Tue", value: 84 },
    { day: "Wed", value: 76 },
    { day: "Thu", value: 92 },
    { day: "Fri", value: 42 },
  ];
  const seatUtilization = liveMetrics.sharedTrips
    ? Math.min(
        100,
        Math.round(
          (liveMetrics.passengers / (liveMetrics.sharedTrips * 8)) * 100,
        ),
      )
    : 0;
  const outcomes = [
    ["Active shared trips", Math.min(100, liveMetrics.sharedTrips * 10)],
    ["Seat utilization", seatUtilization],
    [
      "Vehicle reduction",
      liveMetrics.sharedTrips + liveMetrics.vehiclesAvoided
        ? Math.round(
            (liveMetrics.vehiclesAvoided /
              (liveMetrics.sharedTrips + liveMetrics.vehiclesAvoided)) *
              100,
          )
        : 0,
    ],
  ];

  return (
    <section className="mt-8" aria-labelledby="overview-reports-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
            Performance reports
          </p>
          <h2
            id="overview-reports-title"
            className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-white"
          >
            Fleet savings and utilization
          </h2>
        </div>
        <Link
          href="/dashboard/manager/reports"
          className="hidden min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 sm:inline-flex dark:text-emerald-400 dark:hover:bg-emerald-400/10"
        >
          View full report <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {impactCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={card.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <span
                className={`grid size-10 place-items-center rounded-xl ${cardTone[card.tone]}`}
              >
                <Icon className="size-5" />
              </span>
              <p className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                {card.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {card.label}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {card.note}
              </p>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-950 dark:text-white">
                Weekly fleet utilization
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Percentage of available vehicles assigned
              </p>
            </div>
            <select className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-900">
              <option>This week</option>
              <option>Last week</option>
            </select>
          </div>
          <div className="mt-8 flex h-64 items-end justify-between gap-2 border-b border-slate-200 sm:gap-3 dark:border-slate-700">
            {weekly.map((item, index) => (
              <div
                key={item.day}
                className="flex h-full min-w-0 flex-1 flex-col justify-end"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                  className="relative min-h-2 rounded-t-lg bg-emerald-500/90 transition hover:bg-emerald-500"
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500 sm:text-[10px]">
                    {item.value}%
                  </span>
                </motion.div>
                <p className="py-3 text-center text-[10px] font-semibold text-slate-500 sm:text-[11px]">
                  {item.day}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">
            Monthly impact
          </p>
          <h3 className="mt-2 text-xl font-bold">Shared travel outcome</h3>
          <div className="mt-7 space-y-5">
            {outcomes.map(([label, percent]) => (
              <div key={label}>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-bold text-emerald-400">{percent}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.7 }}
                    className="h-full rounded-full bg-emerald-400"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 rounded-xl bg-white/5 p-4">
            <p className="text-3xl font-bold">
              {(liveMetrics.fuelSaved * 2.68).toFixed(1)} kg
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Estimated CO₂ reduction
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}

export default function ManagerDashboard() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [suggestions, setSuggestions] = useState(matchSuggestions);
  const [notice, setNotice] = useState("");
  const [selectedRange, setSelectedRange] = useState("Today");
  const [liveSummary, setLiveSummary] = useState({
    pending: 12,
    matches: 4,
    vehicles: 18,
    emergencies: 2,
  });
  const profileRef = useRef(null);
  const user = session?.user;
  const role = user?.role || "manager";
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Manager";
  const initials = (user?.name || user?.email || "Transport Manager")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  useEffect(() => {
    const closeProfileMenu = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeProfileMenu);
    return () => document.removeEventListener("mousedown", closeProfileMenu);
  }, []);

  useEffect(() => {
    const syncOverview = () => {
      let operations = [];
      let decisions = [];
      try {
        operations = JSON.parse(
          localStorage.getItem("routesync-manager-operations") || "[]",
        );
      } catch {
        operations = [];
      }
      try {
        decisions = JSON.parse(
          localStorage.getItem("routesync-request-decisions") || "[]",
        );
      } catch {
        decisions = [];
      }
      const activeOperations = operations.filter(
        (item) => item.trip?.status !== "Cancelled",
      );
      const resolvedRequestIds = new Set([
        ...activeOperations.flatMap((item) => item.requestIds || []),
        ...decisions
          .filter((item) => ["Approved", "Rejected"].includes(item.status))
          .map((item) => item.requestId),
      ]);
      const emergencyIds = ["RQ-1061", "RQ-1082"];
      const activeVehicleIds = new Set(
        activeOperations
          .filter((item) => item.trip?.status !== "Completed")
          .map((item) => item.vehicleId),
      );
      setLiveSummary({
        pending: Math.max(0, 12 - resolvedRequestIds.size),
        matches: Math.max(
          0,
          4 - new Set(operations.map((item) => item.matchId)).size,
        ),
        vehicles: Math.max(0, 18 - activeVehicleIds.size),
        emergencies: emergencyIds.filter((id) => !resolvedRequestIds.has(id))
          .length,
      });
    };
    syncOverview();
    window.addEventListener("routesync-manager-update", syncOverview);
    window.addEventListener("routesync-request-update", syncOverview);
    window.addEventListener("routesync-trip-cancelled", syncOverview);
    return () => {
      window.removeEventListener("routesync-manager-update", syncOverview);
      window.removeEventListener("routesync-request-update", syncOverview);
      window.removeEventListener("routesync-trip-cancelled", syncOverview);
    };
  }, []);

  const liveSummaryCards = [
    {
      label: "Pending requests",
      value: String(liveSummary.pending),
      change: "Awaiting manager action",
      icon: CalendarDays,
      tone: "emerald",
    },
    {
      label: "Suggested matches",
      value: String(liveSummary.matches),
      change: "Ready for group review",
      icon: Sparkles,
      tone: "violet",
    },
    {
      label: "Available vehicles",
      value: String(liveSummary.vehicles),
      change: `${18 - liveSummary.vehicles} currently assigned`,
      icon: BusFront,
      tone: "blue",
    },
    {
      label: "Emergency queue",
      value: String(liveSummary.emergencies),
      change: liveSummary.emergencies
        ? "Needs priority review"
        : "All urgent requests reviewed",
      icon: ShieldAlert,
      tone: "amber",
    },
  ];

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
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    localStorage.setItem("routesync-theme", nextTheme ? "dark" : "light");
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await authClient.signOut();
    window.location.href = "/login";
  };

  const removeSuggestion = (id, message) => {
    setSuggestions((current) => current.filter((item) => item.id !== id));
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const confirmAssignment = ({
    suggestion,
    selectedVehicle,
    selectedDriver,
  }) => {
    const vehicle = vehicles.find((item) => item.id === selectedVehicle);
    const driver = drivers.find((item) => item.id === selectedDriver);
    setActiveSuggestion(null);
    removeSuggestion(
      suggestion.id,
      `${suggestion.id} assigned to ${vehicle.name} with ${driver.name}.`,
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <Sidebar user={user} isSessionPending={isSessionPending} />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-slate-950/55 backdrop-blur-sm lg:hidden"
            onMouseDown={(event) =>
              event.target === event.currentTarget && setIsMobileMenuOpen(false)
            }
          >
            <motion.div
              initial={{ x: -290 }}
              animate={{ x: 0 }}
              exit={{ x: -290 }}
              transition={{ duration: 0.25 }}
              className="h-full w-[min(86vw,290px)]"
            >
              <Sidebar
                mobile
                user={user}
                isSessionPending={isSessionPending}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:h-[72px] lg:px-8 xl:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden dark:border-slate-700 dark:text-slate-300"
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </button>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                  Transport Operations
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {dateLabel}
                </p>
              </div>
              <div className="sm:hidden">
                <Logo />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search trip or employee"
                  className="h-10 w-56 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
              <button
                type="button"
                onClick={toggleTheme}
                className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDark ? (
                  <Sun className="size-[18px]" />
                ) : (
                  <Moon className="size-[18px]" />
                )}
              </button>
              <button
                type="button"
                className="relative grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Notifications"
              >
                <Bell className="size-[18px]" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
              </button>
              {isSessionPending ? (
                <div className="hidden h-11 w-40 animate-pulse rounded-xl bg-slate-200 sm:block dark:bg-slate-800" />
              ) : user ? (
                <div ref={profileRef} className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((open) => !open)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 pr-3 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:hover:border-emerald-700 dark:hover:bg-emerald-400/10"
                    aria-expanded={isProfileOpen}
                    aria-controls="manager-profile-menu"
                  >
                    <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-950 text-xs font-bold text-white dark:bg-emerald-500 dark:text-slate-950">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={`${user.name || "Manager"} profile`}
                          className="size-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        initials || "TM"
                      )}
                    </span>
                    <span className="max-w-36 text-left">
                      <span className="block truncate text-xs font-bold">
                        {user.name || "RouteSync User"}
                      </span>
                      <span className="block truncate text-[10px] capitalize text-slate-500 dark:text-slate-400">
                        {role}
                      </span>
                    </span>
                    <ChevronDown
                      className={`size-4 text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        id="manager-profile-menu"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 top-[calc(100%+0.6rem)] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                          <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-emerald-600 text-sm font-bold text-white">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={`${user.name || "Manager"} profile`}
                                className="size-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              initials || "TM"
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                              {user.name || "RouteSync User"}
                            </p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {user.email}
                            </p>
                            <p className="mt-1 text-xs capitalize text-emerald-600 dark:text-emerald-400">
                              {role}
                            </p>
                          </div>
                        </div>
                        <Link
                          href="/dashboard/manager"
                          onClick={() => setIsProfileOpen(false)}
                          className="mt-2 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
                        >
                          <LayoutDashboard className="size-[18px]" /> Manager
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
              ) : null}
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
                  Operations live
                </p>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-slate-950 sm:text-3xl dark:text-white">
                Good morning, {firstName}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review matches, clear urgent requests and keep today’s fleet
                moving.
              </p>
            </div>
          </motion.div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {liveSummaryCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`grid size-10 place-items-center rounded-xl ${cardTone[card.tone]}`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <MoreHorizontal className="size-5 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="mt-5 text-3xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white">
                    {card.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {card.label}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {card.change}
                  </p>
                </motion.article>
              );
            })}
          </div>

          <OverviewReports />

          <div className="hidden">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-violet-600 dark:text-violet-400" />
                    <h2 className="font-bold text-slate-950 dark:text-white">
                      Route match suggestions
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    System suggestions waiting for your decision
                  </p>
                </div>
                <Link
                  href="/dashboard/manager/matches"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
                >
                  View all suggestions
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                <AnimatePresence mode="popLayout">
                  {suggestions.length ? (
                    suggestions.map((suggestion) => (
                      <motion.article
                        layout
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-200 dark:border-slate-700 dark:hover:border-emerald-800"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-bold text-white dark:bg-slate-800">
                                {suggestion.score}% match
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${badgeTone[suggestion.priorityTone]}`}
                              >
                                {suggestion.priority}
                              </span>
                              <span className="text-[11px] font-medium text-slate-400">
                                {suggestion.id}
                              </span>
                            </div>
                            <div className="mt-4 flex items-start gap-3">
                              <div className="mt-0.5 flex flex-col items-center">
                                <span className="size-2.5 rounded-full border-2 border-emerald-500 bg-white dark:bg-slate-900" />
                                <span className="my-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
                                <span className="size-2.5 rounded-full bg-emerald-500" />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                  {suggestion.from}
                                </p>
                                <p className="mt-4 truncate text-sm font-semibold text-slate-900 dark:text-white">
                                  {suggestion.to}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 sm:grid-cols-4 dark:text-slate-400">
                              <p className="flex items-center gap-1.5">
                                <Clock3 className="size-3.5" />
                                {suggestion.time}
                              </p>
                              <p className="flex items-center gap-1.5">
                                <Users className="size-3.5" />
                                {suggestion.passengers} people
                              </p>
                              <p>Pickup: {suggestion.pickupDistance}</p>
                              <p>
                                Destination: {suggestion.destinationDistance}
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-2 lg:flex-col">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              type="button"
                              onClick={() => setActiveSuggestion(suggestion)}
                              className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700 lg:flex-none dark:bg-emerald-500 dark:text-slate-950"
                            >
                              <Check className="size-4" /> Approve & assign
                            </motion.button>
                            <button
                              type="button"
                              onClick={() =>
                                removeSuggestion(
                                  suggestion.id,
                                  `${suggestion.id} kept as separate requests.`,
                                )
                              }
                              className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 lg:flex-none dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <XCircle className="size-4" /> Keep separate
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-2xl bg-emerald-50 p-8 text-center dark:bg-emerald-400/10"
                    >
                      <CheckCircle2 className="mx-auto size-8 text-emerald-600 dark:text-emerald-400" />
                      <p className="mt-3 text-sm font-bold text-emerald-800 dark:text-emerald-200">
                        All suggestions reviewed
                      </p>
                      <p className="mt-1 text-xs text-emerald-700/70 dark:text-emerald-300/70">
                        New matches will appear here automatically.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
              <section className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-amber-50 p-5 shadow-sm dark:border-rose-900 dark:from-rose-400/10 dark:to-amber-400/5">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-600/20">
                    <AlertTriangle className="size-5" />
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 shadow-sm dark:bg-slate-900 dark:text-rose-300">
                    Urgent
                  </span>
                </div>
                <h2 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">
                  {liveSummary.emergencies} emergency request
                  {liveSummary.emergencies === 1 ? "" : "s"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {liveSummary.emergencies
                    ? "Time-sensitive requests are waiting for approve or reject decisions."
                    : "All emergency requests have been reviewed."}
                </p>
                <Link
                  href="/dashboard/manager/requests?filter=Priority%20review"
                  className="mt-5 flex min-h-10 w-full items-center justify-between rounded-xl bg-rose-600 px-3.5 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  {liveSummary.emergencies
                    ? "Review emergency queue"
                    : "View emergency decisions"}{" "}
                  <ArrowRight className="size-4" />
                </Link>
              </section>

              <section className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">
                      {selectedRange}’s impact
                    </p>
                    <h2 className="mt-1 text-lg font-bold">Fleet efficiency</h2>
                  </div>
                  <Fuel className="size-6 text-emerald-400" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-2xl font-bold">৳12,480</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Estimated cost saved
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">38.6 L</p>
                    <p className="mt-1 text-xs text-slate-400">Fuel saved</p>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Vehicle utilization</span>
                    <span className="font-semibold text-emerald-400">78%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full bg-emerald-400"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <section className="hidden">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-slate-800">
              <div>
                <h2 className="font-bold text-slate-950 dark:text-white">
                  Today’s trip operations
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Live assignment and driver status
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="min-h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  All statuses
                </button>
                <button
                  type="button"
                  className="min-h-9 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white dark:bg-slate-800"
                >
                  View schedule
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Trip</th>
                    <th className="px-5 py-3 font-semibold">Schedule</th>
                    <th className="px-5 py-3 font-semibold">Vehicle</th>
                    <th className="px-5 py-3 font-semibold">Driver</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {todayTrips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-950 dark:text-white">
                          {trip.route}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">{trip.id}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                        {trip.time}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-300">
                        {trip.vehicle}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-300">
                        {trip.driver}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${badgeTone[trip.statusTone]}`}
                        >
                          {trip.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          aria-label={`Open ${trip.id}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <AnimatePresence>
        {activeSuggestion && (
          <AssignmentModal
            suggestion={activeSuggestion}
            onClose={() => setActiveSuggestion(null)}
            onConfirm={confirmAssignment}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 12, x: "-50%" }}
            role="status"
            className="fixed bottom-5 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-md items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white shadow-2xl dark:bg-emerald-500 dark:text-slate-950"
          >
            <CheckCircle2 className="size-5 shrink-0 text-emerald-400 dark:text-slate-950" />
            <p className="text-sm font-semibold">{notice}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}