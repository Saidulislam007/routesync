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
  Download,
  FileSpreadsheet,
  FileText,
  Fuel,
  Gauge,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Moon,
  MoreHorizontal,
  Navigation,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Sun,
  UserCheck,
  Users,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AssignmentModal } from "./ManagerDashboard";

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

const pageConfig = {
  requests: {
    eyebrow: "Request operations",
    title: "Trip requests",
    description: "Review employee requests, priorities and approval status.",
    action: "New trip",
    actionIcon: Plus,
  },
  matches: {
    eyebrow: "Decision workspace",
    title: "Match suggestions",
    description: "Compare suggested groups before creating a shared trip.",
    action: "Matching rules",
    actionIcon: Settings,
  },
  trips: {
    eyebrow: "Live operations",
    title: "Today’s trips",
    description:
      "Track assignments, departures and driver progress in one place.",
    action: "Create trip",
    actionIcon: Plus,
  },
  vehicles: {
    eyebrow: "Fleet management",
    title: "Vehicles",
    description:
      "Monitor availability, capacity, location and maintenance health.",
    action: "Add vehicle",
    actionIcon: Plus,
  },
  drivers: {
    eyebrow: "Driver operations",
    title: "Drivers",
    description: "See availability, assignments and performance at a glance.",
    action: "Add driver",
    actionIcon: Plus,
  },
  reports: {
    eyebrow: "Operational intelligence",
    title: "Reports",
    description: "Understand savings, utilization and trip performance trends.",
    action: "Export report",
    actionIcon: Download,
  },
};

const requests = [
  {
    id: "RQ-1058",
    employee: "Nadia Sultana",
    initials: "NS",
    route: "Uttara → Motijheel",
    time: "Today, 10:10 AM",
    type: "Client meeting",
    priority: "High",
    passengers: 2,
    status: "Match suggested",
  },
  {
    id: "RQ-1061",
    employee: "Mahmud Hasan",
    initials: "MH",
    route: "Banani → Square Hospital",
    time: "Today, 10:40 AM",
    type: "Emergency",
    priority: "Critical",
    passengers: 1,
    status: "Priority review",
  },
  {
    id: "RQ-1064",
    employee: "Samira Khan",
    initials: "SK",
    route: "Dhanmondi → Gulshan 1",
    time: "Today, 11:30 AM",
    type: "Branch visit",
    priority: "Medium",
    passengers: 2,
    status: "Pending",
  },
  {
    id: "RQ-1067",
    employee: "Rafiq Ahmed",
    initials: "RA",
    route: "Mirpur → Airport",
    time: "Today, 01:15 PM",
    type: "Airport drop",
    priority: "High",
    passengers: 3,
    status: "Pending",
  },
  {
    id: "RQ-1070",
    employee: "Tania Noor",
    initials: "TN",
    route: "Bashundhara → Motijheel",
    time: "Tomorrow, 09:00 AM",
    type: "Regular official",
    priority: "Regular",
    passengers: 1,
    status: "Pending",
  },
  {
    id: "RQ-1073",
    employee: "Ayesha Rahman",
    initials: "AR",
    route: "Mohammadpur → Karwan Bazar",
    time: "Tomorrow, 09:20 AM",
    type: "Client meeting",
    priority: "High",
    passengers: 2,
    status: "Match suggested",
  },
  {
    id: "RQ-1076",
    employee: "Imran Kabir",
    initials: "IK",
    route: "Badda → Gulshan 2",
    time: "Tomorrow, 10:00 AM",
    type: "Regular official",
    priority: "Regular",
    passengers: 1,
    status: "Pending",
  },
  {
    id: "RQ-1079",
    employee: "Nusrat Jahan",
    initials: "NJ",
    route: "Farmgate → Banani",
    time: "Tomorrow, 10:15 AM",
    type: "Branch visit",
    priority: "Medium",
    passengers: 3,
    status: "Match suggested",
  },
  {
    id: "RQ-1082",
    employee: "Shakil Hossain",
    initials: "SH",
    route: "Jatrabari → Uttara",
    time: "Tomorrow, 11:30 AM",
    type: "Airport pickup",
    priority: "High",
    passengers: 2,
    status: "Priority review",
  },
  {
    id: "RQ-1085",
    employee: "Farzana Akter",
    initials: "FA",
    route: "Khilgaon → Motijheel",
    time: "Tomorrow, 12:10 PM",
    type: "Regular official",
    priority: "Regular",
    passengers: 1,
    status: "Pending",
  },
  {
    id: "RQ-1088",
    employee: "Tanvir Ahmed",
    initials: "TA",
    route: "Mohakhali → Tejgaon",
    time: "Tomorrow, 01:30 PM",
    type: "Client meeting",
    priority: "Medium",
    passengers: 2,
    status: "Match suggested",
  },
  {
    id: "RQ-1091",
    employee: "Rumana Islam",
    initials: "RI",
    route: "Lalmatia → Gulshan 1",
    time: "Tomorrow, 02:00 PM",
    type: "Branch visit",
    priority: "Regular",
    passengers: 2,
    status: "Pending",
  },
];

function calculateManagerSavings(operations = readManagerOperations()) {
  const active = operations.filter((item) => item.trip?.status !== "Cancelled");
  const vehiclesAvoided = active.reduce(
    (total, item) => total + Math.max(0, (item.requestIds?.length || 1) - 1),
    0,
  );
  const fuelSaved = active.reduce((total, item) => {
    const avoided = Math.max(0, (item.requestIds?.length || 1) - 1);
    return total + (avoided * (item.estimatedDistanceKm || 12)) / 8;
  }, 0);
  const costSaved = fuelSaved * 130 + vehiclesAvoided * 250;
  const passengers = active.reduce(
    (total, item) => total + (item.trip?.passengers || 0),
    0,
  );
  return {
    sharedTrips: active.length,
    vehiclesAvoided,
    fuelSaved,
    costSaved,
    passengers,
  };
}

function getReportRows(metrics = calculateManagerSavings()) {
  return [
    [
      "Cost saved",
      `BDT ${Math.round(metrics.costSaved).toLocaleString("en-US")}`,
      "Fuel plus avoided dispatch cost",
    ],
    [
      "Fuel saved",
      `${metrics.fuelSaved.toFixed(1)} L`,
      `Across ${metrics.sharedTrips} active shared trips`,
    ],
    [
      "Vehicles avoided",
      String(metrics.vehiclesAvoided),
      "Grouped requests minus shared vehicles",
    ],
    [
      "Shared passengers",
      String(metrics.passengers),
      "Passengers on approved shared trips",
    ],
    ["Fuel price", "BDT 130/L", "Calculation setting"],
    ["Average efficiency", "8 km/L", "MVP fleet estimate"],
    ["Dispatch cost avoided", "BDT 250/vehicle", "MVP operating-cost setting"],
  ];
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function createReportPdf() {
  const reportRows = getReportRows();
  const lines = [
    "RouteSync Operational Report",
    `Generated: ${new Date().toLocaleString("en-GB")}`,
    "",
    ...reportRows.map(
      ([metric, value, note]) => `${metric}: ${value} - ${note}`,
    ),
  ];
  const escapePdf = (value) =>
    value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const textCommands = lines
    .map(
      (line, index) =>
        `${index === 0 ? "/F1 18 Tf" : "/F1 10 Tf"} 1 0 0 1 54 ${790 - index * 28} Tm (${escapePdf(line)}) Tj`,
    )
    .join("\n");
  const stream = `BT\n${textCommands}\nET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n `)
    .join(
      "\n",
    )}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

const matches = [
  {
    id: "MT-2048",
    score: 92,
    route: "Uttara & Airport Road → Motijheel",
    time: "10:00–10:20 AM",
    requests: 3,
    requestIds: ["RQ-1058", "RQ-1073", "RQ-1088"],
    passengers: 4,
    pickup: "1.2 km",
    destination: "0.8 km",
    type: "Client meeting",
  },
  {
    id: "MT-2049",
    score: 86,
    route: "Dhanmondi & Kalabagan → Gulshan 1",
    time: "11:30–11:50 AM",
    requests: 2,
    requestIds: ["RQ-1079", "RQ-1091"],
    passengers: 3,
    pickup: "1.7 km",
    destination: "1.1 km",
    type: "Branch visit",
  },
  {
    id: "MT-2052",
    score: 81,
    route: "Mirpur 10 & Kazipara → Banani",
    time: "01:10–01:35 PM",
    requests: 3,
    requestIds: ["RQ-1064", "RQ-1076", "RQ-1091"],
    passengers: 5,
    pickup: "1.9 km",
    destination: "1.6 km",
    type: "Regular official",
  },
  {
    id: "MT-2055",
    score: 78,
    route: "Bashundhara & Badda → Motijheel",
    time: "02:20–02:45 PM",
    requests: 3,
    requestIds: ["RQ-1070", "RQ-1076", "RQ-1085"],
    passengers: 4,
    pickup: "2.0 km",
    destination: "2.2 km",
    type: "Regular official",
  },
  {
    id: "MT-2058",
    score: 89,
    route: "Mohammadpur & Lalmatia → Karwan Bazar",
    time: "09:10–09:30 AM",
    requests: 2,
    requestIds: ["RQ-1073", "RQ-1091"],
    passengers: 4,
    pickup: "1.3 km",
    destination: "0.9 km",
    type: "Client meeting",
  },
  {
    id: "MT-2061",
    score: 84,
    route: "Rampura & Banasree → Gulshan 2",
    time: "10:40–11:05 AM",
    requests: 3,
    requestIds: ["RQ-1064", "RQ-1076", "RQ-1079"],
    passengers: 5,
    pickup: "1.8 km",
    destination: "1.4 km",
    type: "Branch visit",
  },
  {
    id: "MT-2064",
    score: 76,
    route: "Jatrabari & Sayedabad → Airport",
    time: "12:00–12:25 PM",
    requests: 2,
    requestIds: ["RQ-1067", "RQ-1082"],
    passengers: 3,
    pickup: "1.9 km",
    destination: "2.6 km",
    type: "Airport pickup/drop",
  },
  {
    id: "MT-2067",
    score: 88,
    route: "Farmgate & Tejgaon → Banani",
    time: "01:40–02:00 PM",
    requests: 3,
    requestIds: ["RQ-1079", "RQ-1088", "RQ-1091"],
    passengers: 6,
    pickup: "1.1 km",
    destination: "1.0 km",
    type: "Regular official",
  },
  {
    id: "MT-2070",
    score: 82,
    route: "Khilgaon & Shantinagar → Motijheel",
    time: "02:50–03:15 PM",
    requests: 2,
    requestIds: ["RQ-1085", "RQ-1088"],
    passengers: 4,
    pickup: "1.6 km",
    destination: "1.3 km",
    type: "Client meeting",
  },
  {
    id: "MT-2073",
    score: 79,
    route: "Mohakhali & Gulshan 1 → Uttara",
    time: "03:20–03:45 PM",
    requests: 3,
    requestIds: ["RQ-1073", "RQ-1079", "RQ-1091"],
    passengers: 5,
    pickup: "2.0 km",
    destination: "2.1 km",
    type: "Branch visit",
  },
  {
    id: "MT-2076",
    score: 74,
    route: "Shyamoli & Agargaon → Purbachal",
    time: "04:10–04:35 PM",
    requests: 2,
    requestIds: ["RQ-1070", "RQ-1076"],
    passengers: 3,
    pickup: "1.7 km",
    destination: "2.8 km",
    type: "Regular official",
  },
  {
    id: "MT-2079",
    score: 80,
    route: "Wari & Tikatuli → Dhanmondi",
    time: "04:40–05:05 PM",
    requests: 3,
    requestIds: ["RQ-1064", "RQ-1085", "RQ-1088"],
    passengers: 4,
    pickup: "1.9 km",
    destination: "1.8 km",
    type: "Client meeting",
  },
];

const managerOperationsKey = "routesync-manager-operations";
const tripCancellationsKey = "routesync-trip-cancellations";
const requestDecisionsKey = "routesync-request-decisions";

function readManagerOperations() {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(
      localStorage.getItem(managerOperationsKey) || "[]",
    );
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveManagerOperation(operation) {
  const current = readManagerOperations().filter(
    (item) => item.matchId !== operation.matchId,
  );
  const next = [operation, ...current];
  localStorage.setItem(managerOperationsKey, JSON.stringify(next));
  window.dispatchEvent(
    new CustomEvent("routesync-manager-update", { detail: next }),
  );
  return next;
}

function readTripCancellations() {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(
      localStorage.getItem(tripCancellationsKey) || "[]",
    );
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readRequestDecisions() {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(requestDecisionsKey) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveRequestDecision(decision) {
  const next = [
    decision,
    ...readRequestDecisions().filter(
      (item) => item.requestId !== decision.requestId,
    ),
  ];
  localStorage.setItem(requestDecisionsKey, JSON.stringify(next));
  window.dispatchEvent(
    new CustomEvent("routesync-request-update", { detail: next }),
  );
  return next;
}

function cancelTripOperation(tripId, reason) {
  const cancelledAt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
  const operations = readManagerOperations();
  const isSharedTrip = operations.some((item) => item.trip?.id === tripId);
  if (isSharedTrip) {
    const next = operations.map((item) =>
      item.trip?.id === tripId
        ? {
            ...item,
            cancellationReason: reason,
            cancelledAt,
            trip: {
              ...item.trip,
              status: "Cancelled",
              cancellationReason: reason,
              cancelledAt,
            },
          }
        : item,
    );
    localStorage.setItem(managerOperationsKey, JSON.stringify(next));
    window.dispatchEvent(
      new CustomEvent("routesync-manager-update", { detail: next }),
    );
  } else {
    const next = [
      { tripId, reason, cancelledAt },
      ...readTripCancellations().filter((item) => item.tripId !== tripId),
    ];
    localStorage.setItem(tripCancellationsKey, JSON.stringify(next));
  }
  window.dispatchEvent(new Event("routesync-trip-cancelled"));
  return cancelledAt;
}

const trips = [
  {
    id: "RT-3104",
    route: "Uttara → Motijheel",
    departure: "08:30 AM",
    arrival: "09:35 AM",
    vehicle: "Toyota HiAce · 15-4821",
    driver: "Kamal Hossain",
    driverNumber: "DR-018",
    driverPhone: "+880 19•• ••• 417",
    passengers: 7,
    status: "In progress",
    progressTimes: {
      Approved: "06 Aug 2026 · 07:42 AM",
      Assigned: "06 Aug 2026 · 07:48 AM",
      "Driver accepted": "06 Aug 2026 · 08:05 AM",
      Completed: "Not completed yet",
    },
  },
  {
    id: "RT-3108",
    route: "Gulshan → Airport",
    departure: "10:45 AM",
    arrival: "11:35 AM",
    vehicle: "Toyota Noah · 18-9032",
    driver: "Jamal Uddin",
    driverNumber: "DR-063",
    driverPhone: "+880 17•• ••• 810",
    passengers: 4,
    status: "Driver accepted",
    progressTimes: {
      Approved: "06 Aug 2026 · 09:35 AM",
      Assigned: "06 Aug 2026 · 09:42 AM",
      "Driver accepted": "06 Aug 2026 · 10:02 AM",
      Completed: "Not completed yet",
    },
  },
  {
    id: "RT-3112",
    route: "Mirpur → Banani",
    departure: "12:10 PM",
    arrival: "01:00 PM",
    vehicle: "Awaiting assignment",
    driver: "Not assigned",
    driverNumber: "Not assigned",
    driverPhone: "Not available",
    passengers: 5,
    status: "Delayed",
    progressTimes: {
      Approved: "06 Aug 2026 · 11:20 AM",
      Assigned: "Pending assignment",
      "Driver accepted": "Pending",
      Completed: "Pending",
    },
  },
  {
    id: "RT-3117",
    route: "Dhanmondi → Narayanganj",
    departure: "02:20 PM",
    arrival: "03:45 PM",
    vehicle: "Nissan Caravan · 12-7781",
    driver: "Arif Rahman",
    driverNumber: "DR-046",
    driverPhone: "+880 17•• ••• 284",
    passengers: 8,
    status: "Scheduled",
    progressTimes: {
      Approved: "06 Aug 2026 · 01:10 PM",
      Assigned: "06 Aug 2026 · 01:18 PM",
      "Driver accepted": "Pending acceptance",
      Completed: "Pending",
    },
  },
  {
    id: "RT-3121",
    route: "Mohammadpur → Karwan Bazar",
    departure: "09:10 AM",
    arrival: "09:50 AM",
    vehicle: "Toyota Premio · 18-5621",
    driver: "Mizanur Rahman",
    driverNumber: "DR-067",
    driverPhone: "+880 18•• ••• 115",
    passengers: 3,
    status: "In progress",
    progressTimes: {
      Approved: "06 Aug 2026 · 08:02 AM",
      Assigned: "06 Aug 2026 · 08:10 AM",
      "Driver accepted": "06 Aug 2026 · 08:28 AM",
      Completed: "Not completed yet",
    },
  },
  {
    id: "RT-3124",
    route: "Badda → Gulshan 2",
    departure: "11:15 AM",
    arrival: "11:45 AM",
    vehicle: "Awaiting assignment",
    driver: "Not assigned",
    driverNumber: "Not assigned",
    driverPhone: "Not available",
    passengers: 4,
    status: "Delayed",
    progressTimes: {
      Approved: "06 Aug 2026 · 10:20 AM",
      Assigned: "Pending assignment",
      "Driver accepted": "Pending",
      Completed: "Pending",
    },
  },
  {
    id: "RT-3127",
    route: "Uttara → Tejgaon",
    departure: "06:50 AM",
    arrival: "07:45 AM",
    vehicle: "Toyota HiAce · 19-4728",
    driver: "Arif Rahman",
    driverNumber: "DR-046",
    driverPhone: "+880 17•• ••• 284",
    passengers: 7,
    status: "Completed",
    progressTimes: {
      Approved: "06 Aug 2026 · 05:40 AM",
      Assigned: "06 Aug 2026 · 05:48 AM",
      "Driver accepted": "06 Aug 2026 · 06:05 AM",
      Completed: "06 Aug 2026 · 07:43 AM",
    },
  },
  {
    id: "RT-3130",
    route: "Mirpur → Motijheel",
    departure: "07:10 AM",
    arrival: "08:05 AM",
    vehicle: "Toyota Noah · 17-8142",
    driver: "Mohammad Selim",
    driverNumber: "DR-031",
    driverPhone: "+880 16•• ••• 731",
    passengers: 5,
    status: "Completed",
    progressTimes: {
      Approved: "06 Aug 2026 · 06:02 AM",
      Assigned: "06 Aug 2026 · 06:10 AM",
      "Driver accepted": "06 Aug 2026 · 06:22 AM",
      Completed: "06 Aug 2026 · 08:02 AM",
    },
  },
  {
    id: "RT-3133",
    route: "Gulshan → Purbachal",
    departure: "07:30 AM",
    arrival: "08:25 AM",
    vehicle: "Mitsubishi L300 · 21-6402",
    driver: "Sabbir Ahmed",
    driverNumber: "DR-052",
    driverPhone: "+880 18•• ••• 506",
    passengers: 6,
    status: "Completed",
    progressTimes: {
      Approved: "06 Aug 2026 · 06:18 AM",
      Assigned: "06 Aug 2026 · 06:25 AM",
      "Driver accepted": "06 Aug 2026 · 06:40 AM",
      Completed: "06 Aug 2026 · 08:20 AM",
    },
  },
  {
    id: "RT-3136",
    route: "Banani → Airport",
    departure: "08:00 AM",
    arrival: "08:35 AM",
    vehicle: "Toyota Axio · 22-3018",
    driver: "Jamal Uddin",
    driverNumber: "DR-063",
    driverPhone: "+880 17•• ••• 810",
    passengers: 3,
    status: "Completed",
    progressTimes: {
      Approved: "06 Aug 2026 · 06:55 AM",
      Assigned: "06 Aug 2026 · 07:02 AM",
      "Driver accepted": "06 Aug 2026 · 07:18 AM",
      Completed: "06 Aug 2026 · 08:32 AM",
    },
  },
  {
    id: "RT-3139",
    route: "Khilgaon → Motijheel",
    departure: "08:15 AM",
    arrival: "08:50 AM",
    vehicle: "Toyota Microbus · 17-4389",
    driver: "Hasan Mahmud",
    driverNumber: "DR-084",
    driverPhone: "+880 19•• ••• 264",
    passengers: 6,
    status: "Completed",
    progressTimes: {
      Approved: "06 Aug 2026 · 07:05 AM",
      Assigned: "06 Aug 2026 · 07:12 AM",
      "Driver accepted": "06 Aug 2026 · 07:27 AM",
      Completed: "06 Aug 2026 · 08:48 AM",
    },
  },
  {
    id: "RT-3142",
    route: "Dhanmondi → Gulshan 1",
    departure: "08:35 AM",
    arrival: "09:20 AM",
    vehicle: "Toyota Noah · 20-9241",
    driver: "Kamal Hossain",
    driverNumber: "DR-018",
    driverPhone: "+880 19•• ••• 417",
    passengers: 4,
    status: "Completed",
    progressTimes: {
      Approved: "06 Aug 2026 · 07:20 AM",
      Assigned: "06 Aug 2026 · 07:28 AM",
      "Driver accepted": "06 Aug 2026 · 07:40 AM",
      Completed: "06 Aug 2026 · 09:17 AM",
    },
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
    fuel: 76,
    nextService: "18 Aug",
  },
  {
    id: "VH-024",
    name: "Toyota Noah",
    plate: "Dhaka Metro-GA 17-8142",
    seats: 7,
    location: "Banani Office",
    status: "Available",
    fuel: 62,
    nextService: "25 Aug",
  },
  {
    id: "VH-031",
    name: "Nissan Caravan",
    plate: "Dhaka Metro-CHA 20-1194",
    seats: 12,
    location: "On route to Motijheel",
    status: "Assigned",
    fuel: 48,
    nextService: "12 Aug",
  },
  {
    id: "VH-009",
    name: "Toyota Coaster",
    plate: "Dhaka Metro-BA 14-2204",
    seats: 22,
    location: "Motijheel Office",
    status: "Maintenance overdue",
    fuel: 35,
    nextService: "Overdue",
  },
  {
    id: "VH-036",
    name: "Mitsubishi L300",
    plate: "Dhaka Metro-CHA 21-6402",
    seats: 10,
    location: "Gulshan Office",
    status: "Available",
    fuel: 83,
    nextService: "29 Aug",
  },
  {
    id: "VH-041",
    name: "Toyota Axio",
    plate: "Dhaka Metro-GA 22-3018",
    seats: 4,
    location: "Airport parking",
    status: "Assigned",
    fuel: 57,
    nextService: "21 Aug",
  },
  {
    id: "VH-045",
    name: "Toyota Premio",
    plate: "Dhaka Metro-GA 18-5621",
    seats: 4,
    location: "Uttara Depot",
    status: "Available",
    fuel: 71,
    nextService: "24 Aug",
  },
  {
    id: "VH-047",
    name: "Toyota Microbus",
    plate: "Dhaka Metro-CHA 17-4389",
    seats: 10,
    location: "Motijheel Office",
    status: "Available",
    fuel: 68,
    nextService: "26 Aug",
  },
  {
    id: "VH-052",
    name: "Toyota HiAce",
    plate: "Dhaka Metro-CHA 22-7154",
    seats: 11,
    location: "Banani Office",
    status: "Available",
    fuel: 89,
    nextService: "30 Aug",
  },
  {
    id: "VH-056",
    name: "Toyota Noah",
    plate: "Dhaka Metro-GA 20-9241",
    seats: 7,
    location: "Gulshan Office",
    status: "Available",
    fuel: 54,
    nextService: "02 Sep",
  },
  {
    id: "VH-058",
    name: "Toyota Allion",
    plate: "Dhaka Metro-GA 19-6830",
    seats: 4,
    location: "Motijheel Office",
    status: "Available",
    fuel: 77,
    nextService: "05 Sep",
  },
  {
    id: "VH-061",
    name: "Toyota X Noah",
    plate: "Dhaka Metro-GA 21-5077",
    seats: 7,
    location: "Uttara Depot",
    status: "Available",
    fuel: 64,
    nextService: "07 Sep",
  },
  {
    id: "VH-064",
    name: "Mitsubishi L300",
    plate: "Dhaka Metro-CHA 18-3342",
    seats: 10,
    location: "Banani Office",
    status: "Available",
    fuel: 82,
    nextService: "09 Sep",
  },
  {
    id: "VH-068",
    name: "Toyota HiAce",
    plate: "Dhaka Metro-CHA 23-1568",
    seats: 11,
    location: "Gulshan Office",
    status: "Available",
    fuel: 73,
    nextService: "12 Sep",
  },
  {
    id: "VH-071",
    name: "Toyota Axio",
    plate: "Dhaka Metro-GA 20-7613",
    seats: 4,
    location: "Airport parking",
    status: "Available",
    fuel: 59,
    nextService: "14 Sep",
  },
  {
    id: "VH-074",
    name: "Toyota Premio",
    plate: "Dhaka Metro-GA 22-4095",
    seats: 4,
    location: "Motijheel Office",
    status: "Available",
    fuel: 86,
    nextService: "16 Sep",
  },
  {
    id: "VH-078",
    name: "Toyota Noah",
    plate: "Dhaka Metro-GA 23-8426",
    seats: 7,
    location: "Uttara Depot",
    status: "Available",
    fuel: 66,
    nextService: "18 Sep",
  },
  {
    id: "VH-081",
    name: "Toyota HiAce",
    plate: "Dhaka Metro-CHA 21-9732",
    seats: 11,
    location: "Banani Office",
    status: "Available",
    fuel: 79,
    nextService: "20 Sep",
  },
  {
    id: "VH-084",
    name: "Toyota Allion",
    plate: "Dhaka Metro-GA 18-2187",
    seats: 4,
    location: "Gulshan Office",
    status: "Available",
    fuel: 61,
    nextService: "23 Sep",
  },
  {
    id: "VH-087",
    name: "Toyota Axio",
    plate: "Dhaka Metro-GA 23-6041",
    seats: 4,
    location: "Motijheel Office",
    status: "Available",
    fuel: 75,
    nextService: "25 Sep",
  },
  {
    id: "VH-091",
    name: "Toyota Coaster",
    plate: "Dhaka Metro-BA 16-7719",
    seats: 22,
    location: "Uttara Depot",
    status: "Available",
    fuel: 92,
    nextService: "28 Sep",
  },
  {
    id: "VH-094",
    name: "Nissan Caravan",
    plate: "Dhaka Metro-CHA 22-4865",
    seats: 12,
    location: "On route to Gulshan",
    status: "Assigned",
    fuel: 52,
    nextService: "31 Aug",
  },
  {
    id: "VH-097",
    name: "Toyota HiAce",
    plate: "Dhaka Metro-CHA 20-8374",
    seats: 11,
    location: "On route to Airport",
    status: "Assigned",
    fuel: 46,
    nextService: "04 Sep",
  },
  {
    id: "VH-101",
    name: "Toyota Noah",
    plate: "Dhaka Metro-GA 24-1953",
    seats: 7,
    location: "On route to Dhanmondi",
    status: "Assigned",
    fuel: 63,
    nextService: "08 Sep",
  },
];

const drivers = [
  {
    id: "DR-046",
    name: "Arif Rahman",
    initials: "AR",
    phone: "+880 17•• ••• 284",
    location: "Uttara Depot",
    completed: 238,
    rating: 4.9,
    status: "Available",
    assignment: "No active trip",
  },
  {
    id: "DR-031",
    name: "Mohammad Selim",
    initials: "MS",
    phone: "+880 18•• ••• 712",
    location: "Banani Office",
    completed: 184,
    rating: 4.8,
    status: "Available",
    assignment: "No active trip",
  },
  {
    id: "DR-052",
    name: "Sabbir Ahmed",
    initials: "SA",
    phone: "+880 16•• ••• 932",
    location: "Motijheel",
    completed: 206,
    rating: 4.7,
    status: "On trip",
    assignment: "RT-3104",
  },
  {
    id: "DR-018",
    name: "Kamal Hossain",
    initials: "KH",
    phone: "+880 19•• ••• 417",
    location: "Airport Road",
    completed: 312,
    rating: 4.9,
    status: "On trip",
    assignment: "RT-3108",
  },
  {
    id: "DR-063",
    name: "Jamal Uddin",
    initials: "JU",
    phone: "+880 17•• ••• 810",
    location: "Dhanmondi",
    completed: 147,
    rating: 4.6,
    status: "Off duty",
    assignment: "Shift starts 4 PM",
  },
  {
    id: "DR-067",
    name: "Mizanur Rahman",
    initials: "MR",
    phone: "+880 18•• ••• 115",
    location: "Gulshan Office",
    completed: 96,
    rating: 4.8,
    status: "Available",
    assignment: "No active trip",
  },
  {
    id: "DR-071",
    name: "Hasan Mahmud",
    initials: "HM",
    phone: "+880 19•• ••• 264",
    location: "Tejgaon Depot",
    completed: 173,
    rating: 4.7,
    status: "Available",
    assignment: "No active trip",
  },
  {
    id: "DR-074",
    name: "Shahidul Islam",
    initials: "SI",
    phone: "+880 17•• ••• 641",
    location: "Motijheel Office",
    completed: 221,
    rating: 4.9,
    status: "On trip",
    assignment: "RT-3121",
  },
  {
    id: "DR-078",
    name: "Nazrul Haque",
    initials: "NH",
    phone: "+880 18•• ••• 392",
    location: "Uttara Depot",
    completed: 158,
    rating: 4.6,
    status: "Available",
    assignment: "No active trip",
  },
  {
    id: "DR-082",
    name: "Abdul Karim",
    initials: "AK",
    phone: "+880 16•• ••• 508",
    location: "Banani Office",
    completed: 267,
    rating: 4.8,
    status: "On trip",
    assignment: "RT-3117",
  },
  {
    id: "DR-086",
    name: "Rubel Mia",
    initials: "RM",
    phone: "+880 19•• ••• 735",
    location: "Bashundhara Office",
    completed: 119,
    rating: 4.7,
    status: "Available",
    assignment: "No active trip",
  },
  {
    id: "DR-090",
    name: "Sohel Rana",
    initials: "SR",
    phone: "+880 17•• ••• 846",
    location: "Gulshan Office",
    completed: 193,
    rating: 4.8,
    status: "Available",
    assignment: "No active trip",
  },
  {
    id: "DR-094",
    name: "Anwar Hossain",
    initials: "AH",
    phone: "+880 18•• ••• 214",
    location: "Airport Parking",
    completed: 284,
    rating: 4.9,
    status: "On trip",
    assignment: "RT-3136",
  },
  {
    id: "DR-098",
    name: "Monir Ahmed",
    initials: "MA",
    phone: "+880 16•• ••• 687",
    location: "Dhanmondi Office",
    completed: 132,
    rating: 4.6,
    status: "Available",
    assignment: "No active trip",
  },
  {
    id: "DR-102",
    name: "Iqbal Hossain",
    initials: "IH",
    phone: "+880 19•• ••• 903",
    location: "Uttara Depot",
    completed: 245,
    rating: 4.8,
    status: "Available",
    assignment: "No active trip",
  },
  {
    id: "DR-106",
    name: "Babul Akter",
    initials: "BA",
    phone: "+880 17•• ••• 352",
    location: "Motijheel Office",
    completed: 176,
    rating: 4.7,
    status: "Available",
    assignment: "No active trip",
  },
  {
    id: "DR-110",
    name: "Firoz Alam",
    initials: "FA",
    phone: "+880 18•• ••• 579",
    location: "Tejgaon Depot",
    completed: 203,
    rating: 4.8,
    status: "Available",
    assignment: "No active trip",
  },
  {
    id: "DR-114",
    name: "Rashed Khan",
    initials: "RK",
    phone: "+880 16•• ••• 428",
    location: "Banani Office",
    completed: 151,
    rating: 4.6,
    status: "Off duty",
    assignment: "Shift starts 6 PM",
  },
];

const statusStyle = {
  Available:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  Assigned: "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
  "On trip": "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
  "Off duty":
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  "Maintenance overdue":
    "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
  "In progress":
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  "Driver accepted":
    "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
  Delayed:
    "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  Scheduled:
    "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  Completed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  "Match suggested":
    "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  "Priority review":
    "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
  Pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  Approved:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  Rejected: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Cancelled: "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
};

function Brand() {
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

function ManagerIdentity({ compact = false }) {
  const { data: session, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);
  const user = session?.user;
  const role = user?.role || "manager";
  const initials = (user?.name || user?.email || "Transport Manager")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  useEffect(() => {
    const closeMenu = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await authClient.signOut();
    window.location.href = "/login";
  };

  if (isPending) {
    return (
      <div
        className={`${compact ? "hidden h-11 w-40 sm:block" : "h-10 w-full"} animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800`}
      />
    );
  }

  if (!user) {
    return compact ? null : (
      <p className="text-sm font-semibold text-slate-500">
        Session unavailable
      </p>
    );
  }

  const avatar = (
    <span
      className={`${compact ? "size-8 rounded-lg" : "size-10 rounded-xl"} grid shrink-0 place-items-center overflow-hidden bg-emerald-600 text-xs font-bold text-white`}
    >
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
  );

  if (!compact) {
    return (
      <div className="flex items-center gap-3">
        {avatar}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
            {user.name || "RouteSync User"}
          </p>
          <p className="mt-0.5 truncate text-xs capitalize text-slate-500 dark:text-slate-400">
            {role}
            {user.company ? ` · ${user.company}` : ""}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={profileRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 pr-3 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:hover:border-emerald-700 dark:hover:bg-emerald-400/10"
        aria-expanded={isOpen}
        aria-controls="manager-section-profile-menu"
      >
        {avatar}
        <span className="max-w-36 text-left">
          <span className="block truncate text-xs font-bold">
            {user.name || "RouteSync User"}
          </span>
          <span className="block truncate text-[10px] capitalize text-slate-500 dark:text-slate-400">
            {role}
          </span>
        </span>
        <ChevronDown
          className={`size-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="manager-section-profile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-[calc(100%+0.6rem)] z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-900"
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
              onClick={() => setIsOpen(false)}
              className="mt-2 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
            >
              <LayoutDashboard className="size-[18px]" /> Manager dashboard
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
  );
}

function ManagerSidebar({ mobile = false, onClose }) {
  const pathname = usePathname();
  return (
    <aside
      className={`${mobile ? "flex h-full" : "hidden lg:flex"} w-[272px] shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950`}
    >
      <div className="flex items-center justify-between px-2">
        <Brand />
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-500 dark:border-slate-700"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        )}
      </div>
      <div className="mx-2 mt-7 rounded-2xl border border-emerald-100 bg-emerald-50 p-3.5 dark:border-emerald-900 dark:bg-emerald-400/10">
        <ManagerIdentity />
      </div>
      <nav className="mt-6 flex-1 space-y-1" aria-label="Manager dashboard">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${active ? "bg-slate-950 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"}`}
            >
              <Icon className="size-[18px] shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.count && (
                <span
                  className={`grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? "bg-white/15 text-white dark:bg-slate-950/15 dark:text-slate-950" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"}`}
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

function SummaryCard({
  label,
  value,
  note,
  icon: Icon,
  tone = "emerald",
  onClick,
  active = false,
}) {
  const tones = {
    emerald:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
    amber:
      "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
  };
  const Component = onClick ? motion.button : motion.article;
  return (
    <Component
      {...(onClick ? { type: "button", onClick, "aria-pressed": active } : {})}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className={`w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition dark:bg-slate-900 ${active ? "border-emerald-500 ring-2 ring-emerald-500/15 dark:border-emerald-500" : "border-slate-200 dark:border-slate-800"}`}
    >
      <span
        className={`grid size-10 place-items-center rounded-xl ${tones[tone]}`}
      >
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{note}</p>
    </Component>
  );
}

const defaultMatchingRules = {
  timeGap: "",
  pickupDistance: "",
  destinationDistance: "",
  clientMeeting: false,
  branchVisit: false,
  airport: false,
  regularOfficial: false,
};

function MatchingRulesModal({ onClose, onSave }) {
  const [rules, setRules] = useState(defaultMatchingRules);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const updateNumber = (key, value) => {
    setRules((current) => ({
      ...current,
      [key]: value === "" ? "" : Math.max(0, Number(value)),
    }));
  };

  const submitRules = (event) => {
    event.preventDefault();
    localStorage.setItem("routesync-matching-rules", JSON.stringify(rules));
    onSave(rules);
  };

  const shareableTypes = [
    ["clientMeeting", "Client meeting"],
    ["branchVisit", "Branch visit"],
    ["airport", "Airport pickup/drop"],
    ["regularOfficial", "Regular official trip"],
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.form
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        onSubmit={submitRules}
        role="dialog"
        aria-modal="true"
        aria-labelledby="matching-rules-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.5rem] bg-white shadow-2xl sm:rounded-[1.5rem] dark:bg-slate-900"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur sm:p-6 dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
              Route matching engine
            </p>
            <h2
              id="matching-rules-title"
              className="mt-1 text-xl font-bold text-slate-950 dark:text-white"
            >
              Matching rules
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Set the limits used to suggest shared trips.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close matching rules"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <section>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">
              Maximum matching limits
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                ["timeGap", "Departure gap", "minutes"],
                ["pickupDistance", "Pickup distance", "km"],
                ["destinationDistance", "Destination distance", "km"],
              ].map(([key, label, unit]) => (
                <label
                  key={key}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                >
                  <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {label}
                  </span>
                  <span className="mt-3 flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step={unit === "km" ? "0.1" : "1"}
                      value={rules[key]}
                      placeholder={
                        key === "timeGap"
                          ? "30"
                          : key === "pickupDistance"
                            ? "2"
                            : "3"
                      }
                      required
                      onChange={(event) =>
                        updateNumber(key, event.target.value)
                      }
                      className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none placeholder:text-slate-300 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-600"
                      aria-label={`${label} in ${unit}`}
                    />
                    <span className="text-xs font-semibold text-slate-400">
                      {unit}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">
              Trips allowed to share
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {shareableTypes.map(([key, label]) => (
                <label
                  key={key}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 transition hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-700"
                >
                  <input
                    type="checkbox"
                    checked={rules[key]}
                    onChange={(event) =>
                      setRules((current) => ({
                        ...current,
                        [key]: event.target.checked,
                      }))
                    }
                    className="size-4 accent-emerald-600"
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-400/10">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-300" />
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Always excluded from automatic matching
              </p>
              <p className="mt-1 text-xs leading-5 text-amber-800/80 dark:text-amber-300/80">
                Emergency and Confidential/VIP trips remain separate for safety
                and privacy.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="min-h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
            >
              <Check className="mr-1.5 inline size-4" />
              Save matching rules
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

function CreateTripModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    pickup: "",
    destination: "",
    date: "",
    departure: "",
    arrival: "",
    type: "",
    passengers: "",
    vehicleId: "",
    driverId: "",
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const updateField = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const submitTrip = (event) => {
    event.preventDefault();
    const vehicle = vehicles.find((item) => item.id === form.vehicleId);
    const driver = drivers.find((item) => item.id === form.driverId);
    const createdAt = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
      .format(new Date())
      .replace(",", " ·");
    onCreate({
      id: `RT-${Math.floor(3200 + Math.random() * 700)}`,
      route: `${form.pickup} → ${form.destination}`,
      date: form.date,
      departure: form.departure,
      arrival: form.arrival,
      type: form.type,
      passengers: Number(form.passengers),
      vehicle: vehicle
        ? `${vehicle.name} · ${vehicle.plate}`
        : "Awaiting assignment",
      driver: driver?.name || "Not assigned",
      driverNumber: driver?.id || "Not assigned",
      driverPhone: driver?.phone || "Not available",
      status: vehicle && driver ? "Scheduled" : "Delayed",
      progressTimes: {
        Approved: createdAt,
        Assigned: vehicle && driver ? createdAt : "Pending assignment",
        "Driver accepted": driver ? "Pending acceptance" : "Pending",
        Completed: "Pending",
      },
    });
  };

  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.form
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        onSubmit={submitTrip}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-trip-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.5rem] bg-white shadow-2xl sm:rounded-[1.5rem] dark:bg-slate-900"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur sm:p-6 dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
              Transport operations
            </p>
            <h2
              id="create-trip-title"
              className="mt-1 text-xl font-bold text-slate-950 dark:text-white"
            >
              Create a new trip
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add the route, schedule and assignment details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close create trip form"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Pickup location
              <input
                required
                name="pickup"
                value={form.pickup}
                onChange={updateField}
                placeholder="e.g. Uttara"
                className={inputClass}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Destination
              <input
                required
                name="destination"
                value={form.destination}
                onChange={updateField}
                placeholder="e.g. Motijheel"
                className={inputClass}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Travel date
              <input
                required
                type="date"
                name="date"
                value={form.date}
                onChange={updateField}
                className={inputClass}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Departure time
              <input
                required
                type="time"
                name="departure"
                value={form.departure}
                onChange={updateField}
                className={inputClass}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Expected arrival
              <input
                required
                type="time"
                name="arrival"
                value={form.arrival}
                onChange={updateField}
                className={inputClass}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Trip type
              <select
                required
                name="type"
                value={form.type}
                onChange={updateField}
                className={inputClass}
              >
                <option value="">Select trip type</option>
                <option>Regular official trip</option>
                <option>Client meeting</option>
                <option>Branch visit</option>
                <option>Airport pickup/drop</option>
                <option>Emergency trip</option>
                <option>Confidential/VIP trip</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Passenger count
              <input
                required
                type="number"
                min="1"
                max="22"
                name="passengers"
                value={form.passengers}
                onChange={updateField}
                placeholder="Number of employees"
                className={inputClass}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Vehicle
              <select
                name="vehicleId"
                value={form.vehicleId}
                onChange={updateField}
                className={inputClass}
              >
                <option value="">Assign later</option>
                {vehicles
                  .filter((item) => item.status === "Available")
                  .map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} · {vehicle.seats} seats
                    </option>
                  ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Driver
              <select
                name="driverId"
                value={form.driverId}
                onChange={updateField}
                className={inputClass}
              >
                <option value="">Assign later</option>
                {drivers
                  .filter((item) => item.status === "Available")
                  .map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} · {driver.location}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          <div className="flex gap-3 rounded-xl bg-blue-50 p-4 text-blue-900 dark:bg-blue-400/10 dark:text-blue-200">
            <BusFront className="mt-0.5 size-5 shrink-0" />
            <p className="text-xs leading-5">
              If a vehicle or driver is not selected, the trip will be created
              as delayed and marked for assignment.
            </p>
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="min-h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
            >
              <Plus className="mr-1.5 inline size-4" />
              Create trip
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

function RequestTripModal({ onClose, onCreate, assignedRequestIds = [] }) {
  const eligibleRequests = requests.filter(
    (request) =>
      ["Pending", "Priority review"].includes(request.status) &&
      !assignedRequestIds.includes(request.id),
  );
  const [form, setForm] = useState({
    requestId: eligibleRequests[0]?.id || "",
    date: "",
    departure: "",
    arrival: "",
    vehicleId: "",
    driverId: "",
  });
  const selectedRequest = eligibleRequests.find(
    (request) => request.id === form.requestId,
  );
  const availableVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.status === "Available" &&
      vehicle.seats >= (selectedRequest?.passengers || 1),
  );
  const availableDrivers = drivers.filter(
    (driver) => driver.status === "Available",
  );
  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const updateField = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const submitAssignment = (event) => {
    event.preventDefault();
    const vehicle = vehicles.find((item) => item.id === form.vehicleId);
    const driver = drivers.find((item) => item.id === form.driverId);
    if (!selectedRequest || !vehicle || !driver) return;
    const createdAt = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
      .format(new Date())
      .replace(",", " ·");
    onCreate({
      id: `RT-${Math.floor(3900 + Math.random() * 90)}`,
      requestId: selectedRequest.id,
      route: selectedRequest.route,
      date: form.date,
      departure: form.departure,
      arrival: form.arrival,
      type: selectedRequest.type,
      passengers: selectedRequest.passengers,
      vehicle: `${vehicle.name} · ${vehicle.plate}`,
      driver: driver.name,
      driverNumber: driver.id,
      driverPhone: driver.phone,
      status: "Scheduled",
      progressTimes: {
        Approved: createdAt,
        Assigned: createdAt,
        "Driver accepted": "Pending acceptance",
        Completed: "Pending",
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.form
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        onSubmit={submitAssignment}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-trip-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.5rem] bg-white shadow-2xl sm:rounded-[1.5rem] dark:bg-slate-900"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur sm:p-6 dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
              Separate trip assignment
            </p>
            <h2
              id="request-trip-title"
              className="mt-1 text-xl font-bold text-slate-950 dark:text-white"
            >
              Assign an unmatched request
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create a dedicated trip for a pending or priority request.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close assignment form"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {eligibleRequests.length ? (
            <>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Employee request
                <select
                  required
                  name="requestId"
                  value={form.requestId}
                  onChange={updateField}
                  className={inputClass}
                >
                  {eligibleRequests.map((request) => (
                    <option key={request.id} value={request.id}>
                      {request.id} · {request.employee} · {request.status}
                    </option>
                  ))}
                </select>
              </label>

              {selectedRequest && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-400/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="grid size-10 place-items-center rounded-xl bg-slate-950 text-xs font-bold text-white dark:bg-slate-800">
                      {selectedRequest.initials}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-950 dark:text-white">
                        {selectedRequest.employee}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {selectedRequest.id} · {selectedRequest.type}
                      </p>
                    </div>
                    <span
                      className={`ml-auto rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle[selectedRequest.status]}`}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-100">
                    {selectedRequest.route}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {selectedRequest.passengers} passenger
                    {selectedRequest.passengers > 1 ? "s" : ""} · Requested{" "}
                    {selectedRequest.time}
                  </p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Travel date
                  <input
                    required
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={updateField}
                    className={inputClass}
                  />
                </label>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Departure
                  <input
                    required
                    type="time"
                    name="departure"
                    value={form.departure}
                    onChange={updateField}
                    className={inputClass}
                  />
                </label>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Expected return
                  <input
                    required
                    type="time"
                    name="arrival"
                    value={form.arrival}
                    onChange={updateField}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Available vehicle
                  <select
                    required
                    name="vehicleId"
                    value={form.vehicleId}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option value="">Select vehicle</option>
                    {availableVehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} · {vehicle.seats} seats ·{" "}
                        {vehicle.location}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Available driver
                  <select
                    required
                    name="driverId"
                    value={form.driverId}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option value="">Select driver</option>
                    {availableDrivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} · {driver.location}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex gap-3 rounded-xl bg-blue-50 p-4 text-blue-900 dark:bg-blue-400/10 dark:text-blue-200">
                <ShieldAlert className="mt-0.5 size-5 shrink-0" />
                <p className="text-xs leading-5">
                  This creates a separate trip. Match-suggested requests
                  continue through the group approval workflow.
                </p>
              </div>
              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="min-h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                >
                  <Check className="mr-1.5 inline size-4" />
                  Assign separate trip
                </motion.button>
              </div>
            </>
          ) : (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
              <p className="mt-3 font-bold text-slate-950 dark:text-white">
                All unmatched requests assigned
              </p>
              <p className="mt-1 text-sm text-slate-500">
                There are no pending or priority requests left.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 min-h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white dark:bg-emerald-500 dark:text-slate-950"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </motion.form>
    </motion.div>
  );
}

function RequestReviewModal({ request, onClose, onApprove, onReject }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const submitReject = (event) => {
    event.preventDefault();
    if (!reason.trim()) return;
    onReject(reason.trim());
  };

  const decisionMade =
    request.status === "Approved" || request.status === "Rejected";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.section
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 22, scale: 0.98 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-review-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.5rem] bg-white shadow-2xl sm:rounded-[1.5rem] dark:bg-slate-900"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur sm:p-6 dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
              {request.id} · Request review
            </p>
            <h2
              id="request-review-title"
              className="mt-1 text-xl font-bold text-slate-950 dark:text-white"
            >
              Approve or reject trip request
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review the employee and journey information before deciding.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close request review"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white dark:bg-slate-800">
              {request.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-slate-950 dark:text-white">
                  {request.employee}
                </h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle[request.status]}`}
                >
                  {request.status}
                </span>
                {request.priority === "Critical" && (
                  <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white">
                    Critical
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Employee trip request
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Route
              </p>
              <p className="mt-2 text-sm font-bold text-slate-950 dark:text-white">
                {request.route}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Schedule
              </p>
              <p className="mt-2 text-sm font-bold text-slate-950 dark:text-white">
                {request.time}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Trip type
              </p>
              <p className="mt-2 text-sm font-bold text-slate-950 dark:text-white">
                {request.type}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Passengers & priority
              </p>
              <p className="mt-2 text-sm font-bold text-slate-950 dark:text-white">
                {request.passengers} passenger
                {request.passengers > 1 ? "s" : ""} · {request.priority}
              </p>
            </div>
          </div>
          {request.rejectionReason && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-400/10">
              <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                Rejection reason
              </p>
              <p className="mt-1 text-sm text-rose-700/80 dark:text-rose-300/80">
                {request.rejectionReason}
              </p>
            </div>
          )}
          {rejecting && !decisionMade && (
            <form id="reject-request-form" onSubmit={submitReject}>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Reason for rejection <span className="text-rose-600">*</span>
                <textarea
                  autoFocus
                  required
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Explain why this request cannot be approved"
                  className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
            </form>
          )}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
            {decisionMade ? (
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white dark:bg-emerald-500 dark:text-slate-950"
              >
                Close
              </button>
            ) : rejecting ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setRejecting(false);
                    setReason("");
                  }}
                  className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  Back
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  form="reject-request-form"
                  type="submit"
                  className="min-h-11 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  <XCircle className="mr-1.5 inline size-4" />
                  Confirm rejection
                </motion.button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setRejecting(true)}
                  className="min-h-11 rounded-xl border border-rose-200 px-5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-400/10"
                >
                  <XCircle className="mr-1.5 inline size-4" />
                  Reject request
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onApprove}
                  className="min-h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950"
                >
                  <Check className="mr-1.5 inline size-4" />
                  Approve request
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

function RequestsView({ createdTrips = [] }) {
  const pageSize = 5;
  const searchParams = useSearchParams();
  const [requestItems, setRequestItems] = useState(requests);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [decisionNotice, setDecisionNotice] = useState("");
  const filtered = requestItems.filter(
    (item) => filter === "All" || item.status === filter,
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleRequests = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const firstItem = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, filtered.length);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    const requestedFilter = searchParams.get("filter");
    if (
      ["All", "Pending", "Priority review", "Match suggested"].includes(
        requestedFilter,
      )
    )
      setFilter(requestedFilter);
  }, [searchParams]);

  useEffect(() => {
    const applyRequestUpdates = () => {
      const operations = readManagerOperations();
      const decisions = readRequestDecisions();
      setRequestItems(
        requests.map((request) => {
          const decision = decisions.find(
            (item) => item.requestId === request.id,
          );
          const operation = operations.find((item) =>
            item.requestIds?.includes(request.id),
          );
          if (operation)
            return operation.trip?.status === "Cancelled"
              ? {
                  ...request,
                  status: "Pending",
                  sharedTripId: undefined,
                  cancellationReason: operation.cancellationReason,
                }
              : {
                  ...request,
                  status: "Approved",
                  sharedTripId: operation.trip.id,
                  decidedAt: operation.createdAt,
                };
          return decision
            ? {
                ...request,
                status: decision.status,
                rejectionReason: decision.rejectionReason,
                decidedAt: decision.decidedAt,
              }
            : request;
        }),
      );
    };
    applyRequestUpdates();
    window.addEventListener("routesync-manager-update", applyRequestUpdates);
    window.addEventListener("routesync-request-update", applyRequestUpdates);
    return () => {
      window.removeEventListener(
        "routesync-manager-update",
        applyRequestUpdates,
      );
      window.removeEventListener(
        "routesync-request-update",
        applyRequestUpdates,
      );
    };
  }, []);

  const summaryFilters = [
    {
      filter: "All",
      label: "All requests",
      value: requestItems.length,
      note: "5 submitted today",
      icon: CalendarDays,
    },
    {
      filter: "Pending",
      label: "Pending requests",
      value: requestItems.filter((item) => item.status === "Pending").length,
      note: "Awaiting manager decision",
      icon: Clock3,
      tone: "amber",
    },
    {
      filter: "Priority review",
      label: "Priority review",
      value: requestItems.filter((item) => item.status === "Priority review")
        .length,
      note: "Emergency and time-sensitive",
      icon: ShieldAlert,
      tone: "rose",
    },
    {
      filter: "Match suggested",
      label: "Match suggested",
      value: requestItems.filter((item) => item.status === "Match suggested")
        .length,
      note: "Eligible for shared trips",
      icon: Sparkles,
      tone: "blue",
    },
  ];

  const decideRequest = (requestId, status, rejectionReason = "") => {
    const decidedAt = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
    saveRequestDecision({ requestId, status, rejectionReason, decidedAt });
    setRequestItems((current) =>
      current.map((item) =>
        item.id === requestId
          ? { ...item, status, rejectionReason, decidedAt }
          : item,
      ),
    );
    setSelectedRequest(null);
    setDecisionNotice(`${requestId} ${status.toLowerCase()} successfully.`);
    window.setTimeout(() => setDecisionNotice(""), 3000);
  };

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryFilters.map((item) => (
          <SummaryCard
            key={item.filter}
            {...item}
            active={filter === item.filter}
            onClick={() => setFilter(item.filter)}
          />
        ))}
      </div>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-slate-800">
          <div>
            <h2 className="font-bold text-slate-950 dark:text-white">
              Employee requests
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Prioritized by urgency, then request time
            </p>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {filtered.length}{" "}
            {filter === "All" ? "total" : filter.toLowerCase()} request
            {filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {visibleRequests.map((item) => {
            const assigned = createdTrips.some(
              (trip) => trip.requestId === item.id,
            );
            return (
              <article
                key={item.id}
                className="grid gap-4 p-4 transition hover:bg-slate-50 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5 dark:hover:bg-slate-800/40"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-xs font-bold text-white dark:bg-slate-800">
                    {item.initials}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-950 dark:text-white">
                        {item.employee}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle[item.status]}`}
                      >
                        {item.status}
                      </span>
                      {(assigned || item.sharedTripId) && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                          {item.sharedTripId
                            ? `Shared · ${item.sharedTripId}`
                            : "Trip assigned"}
                        </span>
                      )}
                      {item.priority === "Critical" && (
                        <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white">
                          Critical
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {item.route}
                    </p>
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>{item.time}</span>
                      <span>{item.type}</span>
                      <span>
                        {item.passengers} passenger
                        {item.passengers > 1 ? "s" : ""}
                      </span>
                      <span>{item.id}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(item)}
                    className="min-h-10 flex-1 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:flex-none dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(item)}
                    disabled={
                      assigned ||
                      item.status === "Approved" ||
                      item.status === "Rejected"
                    }
                    className="min-h-10 flex-1 rounded-xl bg-emerald-600 px-3 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 sm:flex-none dark:bg-emerald-500 dark:text-slate-950 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                  >
                    {assigned
                      ? "Assigned"
                      : item.status === "Approved"
                        ? "Approved"
                        : item.status === "Rejected"
                          ? "Rejected"
                          : "Review"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {totalPages > 1 && (
        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {firstItem}–{lastItem} of {filtered.length} requests
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Previous page"
            >
              <ArrowRight className="size-4 rotate-180" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`size-11 rounded-xl text-sm font-bold transition ${page === pageNumber ? "bg-slate-950 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950" : "border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={page === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Next page"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}
      <AnimatePresence>
        {selectedRequest && (
          <RequestReviewModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onApprove={() => decideRequest(selectedRequest.id, "Approved")}
            onReject={(reason) =>
              decideRequest(selectedRequest.id, "Rejected", reason)
            }
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {decisionNotice && (
          <motion.div
            initial={{ opacity: 0, y: 18, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 12, x: "-50%" }}
            role="status"
            className="fixed bottom-5 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-md items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white shadow-2xl dark:bg-emerald-500 dark:text-slate-950"
          >
            <CheckCircle2 className="size-5 shrink-0 text-emerald-400 dark:text-slate-950" />
            <p className="text-sm font-semibold">{decisionNotice}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MatchesView() {
  const pageSize = 4;
  const [remaining, setRemaining] = useState(matches);
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const approvedMatchIds = new Set(
      readManagerOperations().map((item) => item.matchId),
    );
    setRemaining(matches.filter((item) => !approvedMatchIds.has(item.id)));
  }, []);

  const filteredMatches = remaining.filter((item) => {
    if (filter === "High") return item.score >= 85;
    if (filter === "Standard") return item.score < 85;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filteredMatches.length / pageSize));
  const visibleMatches = filteredMatches.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const firstItem =
    filteredMatches.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, filteredMatches.length);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const openAssignment = (item) => {
    const [from = item.route, to = "Destination"] = item.route.split(" → ");
    setActiveSuggestion({ ...item, from, to });
  };

  const removeMatch = (id, message) => {
    setRemaining((current) => current.filter((match) => match.id !== id));
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const confirmAssignment = ({
    suggestion,
    selectedVehicle,
    selectedDriver,
  }) => {
    const vehicle = vehicles.find((item) => item.id === selectedVehicle);
    const driver = drivers.find((item) => item.id === selectedDriver);
    if (!vehicle || !driver) return;
    const [departure = "Scheduled", arrival = "Scheduled"] =
      suggestion.time.split("–");
    const createdAt = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
    const tripId = `RT-${String(4000 + Math.floor(Math.random() * 5000))}`;
    const operation = {
      matchId: suggestion.id,
      requestIds: suggestion.requestIds || [],
      vehicleId: vehicle.id,
      driverId: driver.id,
      createdAt,
      estimatedDistanceKm: Math.max(
        10,
        Math.round(8 + suggestion.passengers * 1.5),
      ),
      trip: {
        id: tripId,
        route: suggestion.route,
        departure: departure.trim(),
        arrival: arrival.trim(),
        vehicle: `${vehicle.name} · ${vehicle.plate}`,
        driver: driver.name,
        driverNumber: driver.id,
        driverPhone: driver.phone,
        passengers: suggestion.passengers,
        status: "Scheduled",
        type: "Shared official",
        matchId: suggestion.id,
        requestIds: suggestion.requestIds || [],
        progressTimes: {
          Approved: createdAt,
          Assigned: createdAt,
          "Driver accepted": "Pending acceptance",
          Completed: "Pending",
        },
      },
    };
    saveManagerOperation(operation);
    setActiveSuggestion(null);
    removeMatch(
      suggestion.id,
      `${tripId} shared trip created. Requests, vehicle and driver updated.`,
    );
  };

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          label="All suggestions"
          value={remaining.length}
          note="Generated from eligible requests"
          icon={Sparkles}
          active={filter === "All"}
          onClick={() => setFilter("All")}
        />
        <SummaryCard
          label="High match"
          value={remaining.filter((item) => item.score >= 85).length}
          note="85% match score or higher"
          icon={Users}
          tone="blue"
          active={filter === "High"}
          onClick={() => setFilter("High")}
        />
        <SummaryCard
          label="Standard match"
          value={remaining.filter((item) => item.score < 85).length}
          note="Below 85% match score"
          icon={Fuel}
          tone="amber"
          active={filter === "Standard"}
          onClick={() => setFilter("Standard")}
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visibleMatches.map((item) => (
            <motion.article
              layout
              exit={{ opacity: 0, scale: 0.96 }}
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-bold text-white dark:bg-emerald-500 dark:text-slate-950">
                    {item.score}% match
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                    {item.type}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {item.id}
                </span>
              </div>
              <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <p className="font-bold text-slate-950 dark:text-white">
                  {item.route}
                </p>
                <p className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock3 className="size-3.5" />
                  {item.time}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <p className="text-lg font-bold">{item.requests}</p>
                  <p className="text-[10px] text-slate-500">Requests</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{item.passengers}</p>
                  <p className="text-[10px] text-slate-500">Passengers</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{item.pickup}</p>
                  <p className="text-[10px] text-slate-500">Pickup gap</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{item.destination}</p>
                  <p className="text-[10px] text-slate-500">Destination gap</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    removeMatch(
                      item.id,
                      `${item.id} kept as separate requests.`,
                    )
                  }
                  className="min-h-11 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <XCircle className="mr-1 inline size-4" />
                  Keep separate
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => openAssignment(item)}
                  className="min-h-11 rounded-xl bg-emerald-600 text-xs font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                >
                  <Check className="mr-1 inline size-4" />
                  Approve group
                </motion.button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {!filteredMatches.length && (
        <div className="mt-5 rounded-2xl bg-emerald-50 p-10 text-center dark:bg-emerald-400/10">
          <CheckCircle2 className="mx-auto size-9 text-emerald-600" />
          <p className="mt-3 font-bold text-emerald-800 dark:text-emerald-200">
            {remaining.length
              ? "No suggestions in this filter"
              : "All suggestions reviewed"}
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {firstItem}–{lastItem} of {filteredMatches.length}{" "}
            suggestions
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Previous page"
            >
              <ArrowRight className="size-4 rotate-180" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`size-9 rounded-lg text-xs font-bold transition ${page === pageNumber ? "bg-slate-950 text-white dark:bg-emerald-500 dark:text-slate-950" : "border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={page === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Next page"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

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
            initial={{ opacity: 0, y: 18, x: "-50%" }}
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
    </>
  );
}

function TripCancellationModal({ trip, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (reason.trim()) onConfirm(reason.trim());
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.form
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-trip-title"
        className="w-full max-w-lg rounded-t-[1.5rem] bg-white p-5 shadow-2xl sm:rounded-[1.5rem] sm:p-6 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-600 dark:text-rose-400">
              {trip.id} · Cancellation
            </p>
            <h2
              id="cancel-trip-title"
              className="mt-1 text-xl font-bold text-slate-950 dark:text-white"
            >
              Cancel this trip?
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {trip.route}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-300"
            aria-label="Close cancellation"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800 dark:border-amber-900 dark:bg-amber-400/10 dark:text-amber-300">
          Cancelling releases the assigned vehicle and driver. Requests from a
          shared trip return to Pending review.
        </div>
        <label className="mt-5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
          Cancellation reason <span className="text-rose-600">*</span>
          <textarea
            autoFocus
            required
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Vehicle issue, driver unavailable, employee request..."
            className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
          >
            Keep trip
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="min-h-11 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white hover:bg-rose-700"
          >
            <XCircle className="mr-1.5 inline size-4" />
            Confirm cancellation
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function TripsView({ createdTrips = [] }) {
  const pageSize = 4;
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [sharedTrips, setSharedTrips] = useState([]);
  const [cancellations, setCancellations] = useState([]);
  const [cancelTripTarget, setCancelTripTarget] = useState(null);
  const [cancelNotice, setCancelNotice] = useState("");
  const allTrips = [...sharedTrips, ...createdTrips, ...trips].map((trip) => {
    const cancellation = cancellations.find((item) => item.tripId === trip.id);
    return cancellation
      ? {
          ...trip,
          status: "Cancelled",
          cancellationReason: cancellation.reason,
          cancelledAt: cancellation.cancelledAt,
        }
      : trip;
  });
  const tripGroup = (trip) =>
    ["In progress", "Driver accepted", "Scheduled"].includes(trip.status)
      ? "In progress"
      : trip.status;
  const filteredTrips = allTrips.filter(
    (trip) => filter === "All" || tripGroup(trip) === filter,
  );
  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / pageSize));
  const visibleTrips = filteredTrips.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const firstItem = filteredTrips.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, filteredTrips.length);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    const syncTrips = () => {
      setSharedTrips(readManagerOperations().map((item) => item.trip));
      setCancellations(readTripCancellations());
    };
    syncTrips();
    window.addEventListener("routesync-manager-update", syncTrips);
    window.addEventListener("routesync-trip-cancelled", syncTrips);
    return () => {
      window.removeEventListener("routesync-manager-update", syncTrips);
      window.removeEventListener("routesync-trip-cancelled", syncTrips);
    };
  }, []);

  const confirmCancellation = (reason) => {
    const trip = cancelTripTarget;
    if (!trip) return;
    cancelTripOperation(trip.id, reason);
    setCancelTripTarget(null);
    setSelectedTrip(null);
    setCancelNotice(`${trip.id} cancelled. Vehicle and driver released.`);
    window.setTimeout(() => setCancelNotice(""), 3200);
  };

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  useEffect(() => {
    if (!selectedTrip) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedTrip(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedTrip]);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          label="Trips today"
          value={allTrips.length}
          note="All live operations"
          icon={Navigation}
          active={filter === "All"}
          onClick={() => setFilter("All")}
        />
        <SummaryCard
          label="In progress"
          value={
            allTrips.filter((trip) => tripGroup(trip) === "In progress").length
          }
          note="Active and scheduled trips"
          icon={BusFront}
          tone="blue"
          active={filter === "In progress"}
          onClick={() => setFilter("In progress")}
        />
        <SummaryCard
          label="Delayed"
          value={
            allTrips.filter((trip) => tripGroup(trip) === "Delayed").length
          }
          note="Needs assignment attention"
          icon={AlertTriangle}
          tone="amber"
          active={filter === "Delayed"}
          onClick={() => setFilter("Delayed")}
        />
        <SummaryCard
          label="Completed"
          value={
            allTrips.filter((trip) => tripGroup(trip) === "Completed").length
          }
          note="96% on-time arrival"
          icon={CheckCircle2}
          tone="emerald"
          active={filter === "Completed"}
          onClick={() => setFilter("Completed")}
        />
        <SummaryCard
          label="Cancelled"
          value={
            allTrips.filter((trip) => tripGroup(trip) === "Cancelled").length
          }
          note="Released assignments"
          icon={XCircle}
          tone="rose"
          active={filter === "Cancelled"}
          onClick={() => setFilter("Cancelled")}
        />
      </div>

      <div className="mt-5 space-y-3">
        {visibleTrips.map((trip) => (
          <motion.article
            key={trip.id}
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {trip.id}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle[trip.status]}`}
                  >
                    {trip.status}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-bold text-slate-950 dark:text-white">
                  {trip.route}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {trip.passengers} passengers
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Schedule
                </p>
                <p className="mt-2 text-sm font-bold">
                  {trip.departure} → {trip.arrival}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Assignment
                </p>
                <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {trip.vehicle}
                </p>
                <p className="mt-1 text-xs text-slate-500">{trip.driver}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTrip(trip)}
                className="min-h-10 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300"
              >
                Open trip
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {!filteredTrips.length && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="font-bold text-slate-700 dark:text-slate-200">
            No trips found in this filter
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {firstItem}–{lastItem} of {filteredTrips.length} trips
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Previous page"
            >
              <ArrowRight className="size-4 rotate-180" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`size-11 rounded-xl text-sm font-bold transition ${page === pageNumber ? "bg-slate-950 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950" : "border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={page === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Next page"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"
            onMouseDown={(event) =>
              event.target === event.currentTarget && setSelectedTrip(null)
            }
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="trip-details-title"
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.5rem] bg-white shadow-2xl sm:rounded-[1.5rem] dark:bg-slate-900"
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur sm:p-6 dark:border-slate-800 dark:bg-slate-900/95">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedTrip.id}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle[selectedTrip.status]}`}
                    >
                      {selectedTrip.status}
                    </span>
                  </div>
                  <h2
                    id="trip-details-title"
                    className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-white"
                  >
                    {selectedTrip.route}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Official company trip details
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTrip(null)}
                  className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  aria-label="Close trip details"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                {selectedTrip.status === "Delayed" && (
                  <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-400/10">
                    <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-300" />
                    <div>
                      <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                        Assignment needs attention
                      </p>
                      <p className="mt-1 text-xs leading-5 text-amber-800/80 dark:text-amber-300/80">
                        A vehicle and driver must be assigned before this trip
                        can start.
                      </p>
                    </div>
                  </div>
                )}
                {selectedTrip.status === "Cancelled" && (
                  <div className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-400/10">
                    <XCircle className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-300" />
                    <div>
                      <p className="text-sm font-bold text-rose-900 dark:text-rose-200">
                        Trip cancelled
                      </p>
                      <p className="mt-1 text-xs leading-5 text-rose-800/80 dark:text-rose-300/80">
                        {selectedTrip.cancellationReason ||
                          "No reason recorded"}{" "}
                        · {selectedTrip.cancelledAt || "Time unavailable"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                    <Clock3 className="size-4 text-emerald-600" />
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Schedule
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      {selectedTrip.departure} → {selectedTrip.arrival}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                    <Users className="size-4 text-emerald-600" />
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Passengers
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      {selectedTrip.passengers} employees
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                    <Navigation className="size-4 text-emerald-600" />
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Trip type
                    </p>
                    <p className="mt-1 text-sm font-bold">Shared official</p>
                  </div>
                </div>

                <section>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                    Vehicle and driver
                  </h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                      <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                        <BusFront className="size-5" />
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Vehicle
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {selectedTrip.vehicle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                        <UserCheck className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Driver
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {selectedTrip.driver}
                        </p>
                        <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                          Driver ID:{" "}
                          {selectedTrip.driverNumber || "Not assigned"}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                          Phone: {selectedTrip.driverPhone || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                    Trip progress
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    {[
                      "Approved",
                      "Assigned",
                      "Driver accepted",
                      "Completed",
                    ].map((step, index) => {
                      const completeThrough =
                        selectedTrip.status === "Completed"
                          ? 3
                          : selectedTrip.status === "In progress"
                            ? 2
                            : selectedTrip.status === "Driver accepted"
                              ? 2
                              : selectedTrip.status === "Scheduled"
                                ? 1
                                : selectedTrip.status === "Delayed"
                                  ? 0
                                  : 0;
                      const completed = index <= completeThrough;
                      const stepTime =
                        selectedTrip.progressTimes?.[step] ||
                        (completed ? "Time unavailable" : "Pending");
                      return (
                        <div
                          key={step}
                          className={`rounded-xl border p-3 ${completed ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-400/10" : "border-slate-200 dark:border-slate-700"}`}
                        >
                          <span
                            className={`grid size-7 place-items-center rounded-full text-xs font-bold ${completed ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}
                          >
                            {completed ? (
                              <Check className="size-3.5" />
                            ) : (
                              index + 1
                            )}
                          </span>
                          <p className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {step}
                          </p>
                          <p
                            className={`mt-1.5 text-[10px] leading-4 ${completed ? "text-emerald-700/80 dark:text-emerald-300/80" : "text-slate-400"}`}
                          >
                            {stepTime}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedTrip(null)}
                    className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Close
                  </button>
                  {!["Completed", "Cancelled"].includes(
                    selectedTrip.status,
                  ) && (
                    <button
                      type="button"
                      onClick={() => setCancelTripTarget(selectedTrip)}
                      className="min-h-11 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                      <XCircle className="mr-1.5 inline size-4" />
                      Cancel trip
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {cancelTripTarget && (
          <TripCancellationModal
            trip={cancelTripTarget}
            onClose={() => setCancelTripTarget(null)}
            onConfirm={confirmCancellation}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {cancelNotice && (
          <motion.div
            initial={{ opacity: 0, y: 18, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 12, x: "-50%" }}
            role="status"
            className="fixed bottom-5 left-1/2 z-[110] flex w-[calc(100%-2rem)] max-w-md items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white shadow-2xl dark:bg-rose-500"
          >
            <CheckCircle2 className="size-5 shrink-0 text-emerald-400 dark:text-white" />
            <p className="text-sm font-semibold">{cancelNotice}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AddVehicleModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    plate: "",
    seats: "",
    location: "",
    fuel: "",
    nextService: "",
  });
  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const updateField = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const submitVehicle = (event) => {
    event.preventDefault();
    onCreate({
      id: `VH-${String(110 + Math.floor(Math.random() * 800)).padStart(3, "0")}`,
      name: form.name.trim(),
      plate: form.plate.trim(),
      seats: Number(form.seats),
      location: form.location.trim(),
      status: "Available",
      fuel: Number(form.fuel),
      nextService: new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
      }).format(new Date(`${form.nextService}T00:00:00`)),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.form
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        onSubmit={submitVehicle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-vehicle-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.5rem] bg-white shadow-2xl sm:rounded-[1.5rem] dark:bg-slate-900"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur sm:p-6 dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
              Fleet management
            </p>
            <h2
              id="add-vehicle-title"
              className="mt-1 text-xl font-bold text-slate-950 dark:text-white"
            >
              Add a new vehicle
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Register a vehicle and make it available for assignment.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close add vehicle form"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Vehicle name
              <input
                required
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Toyota HiAce"
                className={inputClass}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Registration plate
              <input
                required
                name="plate"
                value={form.plate}
                onChange={updateField}
                placeholder="Dhaka Metro-CHA 24-1234"
                className={inputClass}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Seat capacity
              <input
                required
                type="number"
                min="1"
                max="60"
                name="seats"
                value={form.seats}
                onChange={updateField}
                placeholder="Number of seats"
                className={inputClass}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Current location
              <input
                required
                name="location"
                value={form.location}
                onChange={updateField}
                placeholder="e.g. Uttara Depot"
                className={inputClass}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Fuel level (%)
              <input
                required
                type="number"
                min="0"
                max="100"
                name="fuel"
                value={form.fuel}
                onChange={updateField}
                placeholder="0–100"
                className={inputClass}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Next service date
              <input
                required
                type="date"
                name="nextService"
                value={form.nextService}
                onChange={updateField}
                className={inputClass}
              />
            </label>
          </div>
          <div className="flex gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            <p className="text-xs leading-5">
              The new vehicle will be registered with Available status and can
              immediately be used for assignments.
            </p>
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="min-h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
            >
              <Plus className="mr-1.5 inline size-4" />
              Add vehicle
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

function VehiclesView({ addedVehicles = [] }) {
  const PAGE_SIZE = 6;
  const [assignedVehicleIds, setAssignedVehicleIds] = useState([]);
  const allVehicles = [...addedVehicles, ...vehicles].map((vehicle) =>
    assignedVehicleIds.includes(vehicle.id) &&
    vehicle.status !== "Maintenance overdue"
      ? { ...vehicle, status: "Assigned" }
      : vehicle,
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const syncAssignments = () =>
      setAssignedVehicleIds(
        readManagerOperations()
          .filter(
            (item) =>
              item.trip?.status !== "Cancelled" &&
              item.trip?.status !== "Completed",
          )
          .map((item) => item.vehicleId),
      );
    syncAssignments();
    window.addEventListener("routesync-manager-update", syncAssignments);
    return () =>
      window.removeEventListener("routesync-manager-update", syncAssignments);
  }, []);

  useEffect(() => setPage(1), [query, filter]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredVehicles = allVehicles.filter((vehicle) => {
    const matchesFilter = filter === "All" || vehicle.status === filter;
    const searchText =
      `${vehicle.id} ${vehicle.name} ${vehicle.plate} ${vehicle.location}`.toLowerCase();
    return matchesFilter && searchText.includes(normalizedQuery);
  });
  const totalPages = Math.ceil(filteredVehicles.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const visibleVehicles = filteredVehicles.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );
  const summaryFilters = [
    {
      key: "All",
      label: "Total vehicles",
      value: allVehicles.length,
      note: "Across fleet locations",
      icon: BusFront,
      tone: "emerald",
    },
    {
      key: "Available",
      label: "Available now",
      value: allVehicles.filter((item) => item.status === "Available").length,
      note: "Ready for assignment",
      icon: CheckCircle2,
      tone: "blue",
    },
    {
      key: "Assigned",
      label: "Currently assigned",
      value: allVehicles.filter((item) => item.status === "Assigned").length,
      note: "Active trip assignments",
      icon: Navigation,
      tone: "amber",
    },
    {
      key: "Maintenance overdue",
      label: "Maintenance alert",
      value: allVehicles.filter((item) => item.status === "Maintenance overdue")
        .length,
      note: "Assignment disabled",
      icon: Wrench,
      tone: "rose",
    },
  ];

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryFilters.map((item) => (
          <SummaryCard
            key={item.key}
            {...item}
            active={filter === item.key}
            onClick={() => setFilter(item.key)}
          />
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search vehicle, plate, ID or location"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900"
          />
        </label>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Showing {filteredVehicles.length} vehicle
          {filteredVehicles.length === 1 ? "" : "s"}
        </p>
      </div>

      {visibleVehicles.length ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleVehicles.map((vehicle) => {
            const overdue = vehicle.status === "Maintenance overdue";
            return (
              <motion.article
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={vehicle.id}
                whileHover={{ y: overdue ? 0 : -3 }}
                className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900 ${overdue ? "border-rose-200 dark:border-rose-900" : "border-slate-200 dark:border-slate-800"}`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`grid size-11 place-items-center rounded-xl ${overdue ? "bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"}`}
                  >
                    {overdue ? (
                      <Wrench className="size-5" />
                    ) : (
                      <BusFront className="size-5" />
                    )}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle[vehicle.status]}`}
                  >
                    {vehicle.status}
                  </span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-950 dark:text-white">
                      {vehicle.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {vehicle.plate}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {vehicle.id}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/50">
                  <p>
                    <Users className="mr-1.5 inline size-3.5 text-slate-400" />
                    {vehicle.seats} seats
                  </p>
                  <p className="truncate">
                    <MapPin className="mr-1.5 inline size-3.5 text-slate-400" />
                    {vehicle.location}
                  </p>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Fuel level</span>
                    <span className="font-bold">{vehicle.fuel}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${vehicle.fuel < 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${vehicle.fuel}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
                  <span className="text-slate-500">Next service</span>
                  <span
                    className={`font-semibold ${overdue ? "text-rose-600" : "text-slate-700 dark:text-slate-200"}`}
                  >
                    {vehicle.nextService}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <Search className="mx-auto size-7 text-slate-400" />
          <p className="mt-3 font-bold text-slate-800 dark:text-white">
            No vehicles found
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try another search or select Total vehicles.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <nav
          className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800 dark:bg-slate-900"
          aria-label="Vehicle pagination"
        >
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {startIndex + 1}–
            {Math.min(startIndex + PAGE_SIZE, filteredVehicles.length)} of{" "}
            {filteredVehicles.length} vehicles
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Previous page"
            >
              <ArrowRight className="size-4 rotate-180" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-current={page === pageNumber ? "page" : undefined}
                  className={`size-11 rounded-xl text-sm font-bold transition ${page === pageNumber ? "bg-slate-950 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950" : "border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Next page"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </nav>
      )}
    </>
  );
}

function AddDriverModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    license: "",
    location: "",
    completed: "0",
    rating: "5",
  });
  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const updateField = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const submitDriver = (event) => {
    event.preventDefault();
    const initials = form.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
    onCreate({
      id: `DR-${String(120 + Math.floor(Math.random() * 800)).padStart(3, "0")}`,
      name: form.name.trim(),
      initials: initials || "ND",
      phone: form.phone.trim(),
      license: form.license.trim(),
      location: form.location.trim(),
      completed: Number(form.completed),
      rating: Number(form.rating),
      status: "Available",
      assignment: "No active trip",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.form
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        onSubmit={submitDriver}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-driver-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.5rem] bg-white shadow-2xl sm:rounded-[1.5rem] dark:bg-slate-900"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur sm:p-6 dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
              Driver operations
            </p>
            <h2
              id="add-driver-title"
              className="mt-1 text-xl font-bold text-slate-950 dark:text-white"
            >
              Add a new driver
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Register a driver and make them available for trips.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close add driver form"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Driver name
              <input
                required
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Rahim Uddin"
                className={inputClass}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Phone number
              <input
                required
                type="tel"
                name="phone"
                value={form.phone}
                onChange={updateField}
                placeholder="+880 17..."
                className={inputClass}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Driving license
              <input
                required
                name="license"
                value={form.license}
                onChange={updateField}
                placeholder="License number"
                className={inputClass}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Current location
              <input
                required
                name="location"
                value={form.location}
                onChange={updateField}
                placeholder="e.g. Uttara Depot"
                className={inputClass}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Previous completed trips
              <input
                required
                type="number"
                min="0"
                name="completed"
                value={form.completed}
                onChange={updateField}
                className={inputClass}
              />
            </label>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Initial rating
              <select
                required
                name="rating"
                value={form.rating}
                onChange={updateField}
                className={inputClass}
              >
                <option value="5">5.0</option>
                <option value="4.9">4.9</option>
                <option value="4.8">4.8</option>
                <option value="4.7">4.7</option>
                <option value="4.6">4.6</option>
              </select>
            </label>
          </div>
          <div className="flex gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200">
            <UserCheck className="mt-0.5 size-5 shrink-0" />
            <p className="text-xs leading-5">
              The new driver will be added with Available status and no active
              trip assignment.
            </p>
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="min-h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
            >
              <Plus className="mr-1.5 inline size-4" />
              Add driver
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

function DriversView({ addedDrivers = [] }) {
  const pageSize = 6;
  const [activeDriverAssignments, setActiveDriverAssignments] = useState({});
  const allDrivers = [...addedDrivers, ...drivers].map((driver) =>
    activeDriverAssignments[driver.id]
      ? {
          ...driver,
          status: "On trip",
          assignment: activeDriverAssignments[driver.id],
        }
      : driver,
  );
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const syncAssignments = () => {
      const assignments = Object.fromEntries(
        readManagerOperations()
          .filter(
            (item) =>
              item.trip?.status !== "Cancelled" &&
              item.trip?.status !== "Completed",
          )
          .map((item) => [item.driverId, item.trip.id]),
      );
      setActiveDriverAssignments(assignments);
    };
    syncAssignments();
    window.addEventListener("routesync-manager-update", syncAssignments);
    return () =>
      window.removeEventListener("routesync-manager-update", syncAssignments);
  }, []);
  const filteredDrivers = allDrivers.filter(
    (driver) => filter === "All" || driver.status === filter,
  );
  const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / pageSize));
  const visibleDrivers = filteredDrivers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const firstItem =
    filteredDrivers.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, filteredDrivers.length);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total drivers"
          value={allDrivers.length}
          note="All registered drivers"
          icon={Users}
          active={filter === "All"}
          onClick={() => setFilter("All")}
        />
        <SummaryCard
          label="Available now"
          value={
            allDrivers.filter((driver) => driver.status === "Available").length
          }
          note="Ready for assignment"
          icon={UserCheck}
          tone="blue"
          active={filter === "Available"}
          onClick={() => setFilter("Available")}
        />
        <SummaryCard
          label="On active trip"
          value={
            allDrivers.filter((driver) => driver.status === "On trip").length
          }
          note="Currently assigned"
          icon={Navigation}
          tone="amber"
          active={filter === "On trip"}
          onClick={() => setFilter("On trip")}
        />
        <SummaryCard
          label="Off duty"
          value={
            allDrivers.filter((driver) => driver.status === "Off duty").length
          }
          note="Outside active shift"
          icon={Moon}
          tone="rose"
          active={filter === "Off duty"}
          onClick={() => setFilter("Off duty")}
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleDrivers.map((driver) => (
          <motion.article
            key={driver.id}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white dark:bg-slate-800">
                {driver.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-950 dark:text-white">
                      {driver.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {driver.id} · {driver.phone}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle[driver.status]}`}
                  >
                    {driver.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <MapPin className="size-3.5 text-slate-400" />
                {driver.location}
              </p>
              <p className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Navigation className="size-3.5 text-slate-400" />
                {driver.assignment}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xl font-bold">{driver.completed}</p>
                <p className="text-[10px] text-slate-500">Trips completed</p>
              </div>
              <div>
                <p className="text-xl font-bold">{driver.rating}</p>
                <p className="text-[10px] text-slate-500">Average rating</p>
              </div>
            </div>
            <button className="mt-4 min-h-10 w-full rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
              View driver
            </button>
          </motion.article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {firstItem}–{lastItem} of {filteredDrivers.length} drivers
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Previous page"
            >
              <ArrowRight className="size-4 rotate-180" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`size-11 rounded-xl text-sm font-bold transition ${page === pageNumber ? "bg-slate-950 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950" : "border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={page === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Next page"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ExportReportModal({ onClose, onExport }) {
  const formats = [
    {
      id: "excel",
      title: "Excel",
      subtitle: "Spreadsheet-ready CSV file",
      icon: FileSpreadsheet,
      tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
    },
    {
      id: "pdf",
      title: "PDF",
      subtitle: "Printable operational report",
      icon: FileText,
      tone: "bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
    },
    {
      id: "google-doc",
      title: "Google Docs",
      subtitle: "Editable DOC file for Google Docs",
      icon: FileText,
      tone: "bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300",
    },
  ];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.section
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-report-title"
        className="w-full max-w-xl rounded-t-[1.5rem] bg-white p-5 shadow-2xl sm:rounded-[1.5rem] sm:p-6 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
              Operational intelligence
            </p>
            <h2
              id="export-report-title"
              className="mt-1 text-xl font-bold text-slate-950 dark:text-white"
            >
              Export report
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Choose the file format your manager needs.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close export options"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-6 grid gap-3">
          {formats.map((format) => {
            const Icon = format.icon;
            return (
              <motion.button
                key={format.id}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onExport(format.id)}
                className="flex min-h-20 items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-emerald-400 hover:bg-emerald-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:hover:border-emerald-500 dark:hover:bg-emerald-400/5"
              >
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-xl ${format.tone}`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-slate-950 dark:text-white">
                    {format.title}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    {format.subtitle}
                  </span>
                </span>
                <Download className="size-5 shrink-0 text-slate-400" />
              </motion.button>
            );
          })}
        </div>
      </motion.section>
    </motion.div>
  );
}

function ReportsView() {
  const weekly = [
    { day: "Sat", value: 58 },
    { day: "Sun", value: 72 },
    { day: "Mon", value: 66 },
    { day: "Tue", value: 84 },
    { day: "Wed", value: 76 },
    { day: "Thu", value: 92 },
    { day: "Fri", value: 42 },
  ];
  const [metrics, setMetrics] = useState(() => ({
    sharedTrips: 0,
    vehiclesAvoided: 0,
    fuelSaved: 0,
    costSaved: 0,
    passengers: 0,
  }));

  useEffect(() => {
    const syncMetrics = () => setMetrics(calculateManagerSavings());
    syncMetrics();
    window.addEventListener("routesync-manager-update", syncMetrics);
    window.addEventListener("routesync-trip-cancelled", syncMetrics);
    return () => {
      window.removeEventListener("routesync-manager-update", syncMetrics);
      window.removeEventListener("routesync-trip-cancelled", syncMetrics);
    };
  }, []);

  const operations = readManagerOperations();
  const acceptance = operations.length
    ? Math.round((metrics.sharedTrips / operations.length) * 100)
    : 0;
  const seatUtilization = metrics.sharedTrips
    ? Math.min(
        100,
        Math.round((metrics.passengers / (metrics.sharedTrips * 8)) * 100),
      )
    : 0;
  const vehicleReduction =
    metrics.sharedTrips + metrics.vehiclesAvoided
      ? Math.round(
          (metrics.vehiclesAvoided /
            (metrics.sharedTrips + metrics.vehiclesAvoided)) *
            100,
        )
      : 0;
  const co2Saved = metrics.fuelSaved * 2.68;

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Cost saved"
          value={`৳${Math.round(metrics.costSaved).toLocaleString("en-US")}`}
          note="Calculated from active shared trips"
          icon={CircleDollarSign}
        />
        <SummaryCard
          label="Fuel saved"
          value={`${metrics.fuelSaved.toFixed(1)} L`}
          note={`Across ${metrics.sharedTrips} shared trips`}
          icon={Fuel}
          tone="blue"
        />
        <SummaryCard
          label="Vehicles avoided"
          value={metrics.vehiclesAvoided}
          note="Grouped requests minus vehicles used"
          icon={BusFront}
          tone="amber"
        />
        <SummaryCard
          label="Shared passengers"
          value={metrics.passengers}
          note="Cancelled trips excluded"
          icon={Users}
          tone="emerald"
        />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-950 dark:text-white">
                Weekly fleet utilization
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Percentage of available vehicles assigned
              </p>
            </div>
            <select className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900">
              <option>This week</option>
              <option>Last week</option>
            </select>
          </div>
          <div className="mt-8 flex h-64 items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-700">
            {weekly.map((item, index) => (
              <div
                key={item.day}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                  className="relative rounded-t-lg bg-emerald-500/90 hover:bg-emerald-500"
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">
                    {item.value}%
                  </span>
                </motion.div>
                <p className="py-3 text-center text-[11px] font-semibold text-slate-500">
                  {item.day}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-xs leading-5 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">
            <strong>Calculation:</strong> avoided vehicles × route distance ÷ 8
            km/L. Cost uses ৳130/L fuel plus ৳250 avoided dispatch cost per
            vehicle.
          </div>
        </section>
        <section className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">
            Live shared impact
          </p>
          <h2 className="mt-2 text-xl font-bold">Shared travel outcome</h2>
          <div className="mt-6 space-y-5">
            {[
              ["Vehicle reduction", vehicleReduction],
              ["Seat utilization", seatUtilization],
              ["Match acceptance", acceptance],
            ].map(([label, percent]) => (
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
            <p className="text-3xl font-bold">{co2Saved.toFixed(1)} kg</p>
            <p className="mt-1 text-xs text-slate-400">
              Estimated CO₂ reduction
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

const views = {
  requests: RequestsView,
  matches: MatchesView,
  trips: TripsView,
  vehicles: VehiclesView,
  drivers: DriversView,
  reports: ReportsView,
};

export default function ManagerSectionPage({ section }) {
  const config = pageConfig[section];
  const Content = views[section];
  const ActionIcon = config.actionIcon;
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [rulesSaved, setRulesSaved] = useState(false);
  const [createTripOpen, setCreateTripOpen] = useState(false);
  const [requestTripOpen, setRequestTripOpen] = useState(false);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [addDriverOpen, setAddDriverOpen] = useState(false);
  const [exportReportOpen, setExportReportOpen] = useState(false);
  const [requestTripNotice, setRequestTripNotice] = useState("");
  const [createdTrips, setCreatedTrips] = useState([]);
  const [addedVehicles, setAddedVehicles] = useState([]);
  const [addedDrivers, setAddedDrivers] = useState([]);
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

  useEffect(() => {
    const saved = localStorage.getItem("routesync-theme");
    const next = saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("routesync-theme", next ? "dark" : "light");
  };
  const exportReport = (format) => {
    const date = new Date().toISOString().slice(0, 10);
    const reportRows = getReportRows();
    if (format === "excel") {
      const csv = [["Metric", "Value", "Context"], ...reportRows]
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
        )
        .join("\r\n");
      downloadFile(
        new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }),
        `routesync-report-${date}.csv`,
      );
    }
    if (format === "pdf")
      downloadFile(createReportPdf(), `routesync-report-${date}.pdf`);
    if (format === "google-doc") {
      const rows = reportRows
        .map(
          ([metric, value, note]) =>
            `<tr><td>${metric}</td><td>${value}</td><td>${note}</td></tr>`,
        )
        .join("");
      const documentHtml = `<html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#0f172a;padding:32px}h1{color:#059669}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{border:1px solid #cbd5e1;padding:10px;text-align:left}th{background:#ecfdf5}</style></head><body><h1>RouteSync Operational Report</h1><p>Generated: ${new Date().toLocaleString("en-GB")}</p><table><thead><tr><th>Metric</th><th>Value</th><th>Context</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
      downloadFile(
        new Blob([documentHtml], { type: "application/msword;charset=utf-8" }),
        `routesync-report-${date}.doc`,
      );
    }
    setExportReportOpen(false);
    const label =
      format === "google-doc"
        ? "Google Docs"
        : format === "pdf"
          ? "PDF"
          : "Excel";
    setRequestTripNotice(`${label} report downloaded successfully.`);
    window.setTimeout(() => setRequestTripNotice(""), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <ManagerSidebar />
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-slate-950/55 backdrop-blur-sm lg:hidden"
            onMouseDown={(event) =>
              event.target === event.currentTarget && setMenuOpen(false)
            }
          >
            <motion.div
              initial={{ x: -290 }}
              animate={{ x: 0 }}
              exit={{ x: -290 }}
              className="h-full w-[min(86vw,290px)]"
            >
              <ManagerSidebar mobile onClose={() => setMenuOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:h-[72px] lg:px-8 xl:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMenuOpen(true)}
                className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden dark:border-slate-700 dark:text-slate-300"
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </button>
              <div className="hidden sm:block">
                <p className="text-sm font-bold">Transport Operations</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {dateLabel}
                </p>
              </div>
              <div className="sm:hidden">
                <Brand />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative hidden md:block">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search this page"
                  className="h-10 w-52 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
              <button
                onClick={toggleTheme}
                className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
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
                className="relative grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                aria-label="Notifications"
              >
                <Bell className="size-[18px]" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
              </button>
              <ManagerIdentity compact />
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
                {config.eyebrow}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-[-0.035em] sm:text-3xl">
                {config.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {config.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (section === "requests") setRequestTripOpen(true);
                if (section === "matches") setRulesOpen(true);
                if (section === "trips") setCreateTripOpen(true);
                if (section === "vehicles") setAddVehicleOpen(true);
                if (section === "drivers") setAddDriverOpen(true);
                if (section === "reports") setExportReportOpen(true);
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 dark:bg-emerald-500 dark:text-slate-950"
            >
              <ActionIcon className="size-4" />
              {rulesSaved && section === "matches"
                ? "Rules saved"
                : config.action}
            </button>
          </motion.div>
          <div className="mt-6">
            <Content
              createdTrips={createdTrips}
              addedVehicles={addedVehicles}
              addedDrivers={addedDrivers}
            />
          </div>
        </main>
      </div>
      <AnimatePresence>
        {rulesOpen && (
          <MatchingRulesModal
            onClose={() => setRulesOpen(false)}
            onSave={() => {
              setRulesOpen(false);
              setRulesSaved(true);
              window.setTimeout(() => setRulesSaved(false), 2500);
            }}
          />
        )}
        {createTripOpen && (
          <CreateTripModal
            onClose={() => setCreateTripOpen(false)}
            onCreate={(trip) => {
              setCreatedTrips((current) => [trip, ...current]);
              setCreateTripOpen(false);
            }}
          />
        )}
        {requestTripOpen && (
          <RequestTripModal
            assignedRequestIds={createdTrips
              .map((trip) => trip.requestId)
              .filter(Boolean)}
            onClose={() => setRequestTripOpen(false)}
            onCreate={(trip) => {
              setCreatedTrips((current) => [trip, ...current]);
              setRequestTripOpen(false);
              setRequestTripNotice(`${trip.requestId} assigned as ${trip.id}.`);
              window.setTimeout(() => setRequestTripNotice(""), 3000);
            }}
          />
        )}
        {addVehicleOpen && (
          <AddVehicleModal
            onClose={() => setAddVehicleOpen(false)}
            onCreate={(vehicle) => {
              setAddedVehicles((current) => [vehicle, ...current]);
              setAddVehicleOpen(false);
              setRequestTripNotice(
                `${vehicle.id} · ${vehicle.name} added to the fleet.`,
              );
              window.setTimeout(() => setRequestTripNotice(""), 3000);
            }}
          />
        )}
        {addDriverOpen && (
          <AddDriverModal
            onClose={() => setAddDriverOpen(false)}
            onCreate={(driver) => {
              setAddedDrivers((current) => [driver, ...current]);
              setAddDriverOpen(false);
              setRequestTripNotice(
                `${driver.id} · ${driver.name} added to the driver roster.`,
              );
              window.setTimeout(() => setRequestTripNotice(""), 3000);
            }}
          />
        )}
        {exportReportOpen && (
          <ExportReportModal
            onClose={() => setExportReportOpen(false)}
            onExport={exportReport}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {requestTripNotice && (
          <motion.div
            initial={{ opacity: 0, y: 18, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 12, x: "-50%" }}
            role="status"
            className="fixed bottom-5 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-md items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white shadow-2xl dark:bg-emerald-500 dark:text-slate-950"
          >
            <CheckCircle2 className="size-5 shrink-0 text-emerald-400 dark:text-slate-950" />
            <p className="text-sm font-semibold">{requestTripNotice}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}