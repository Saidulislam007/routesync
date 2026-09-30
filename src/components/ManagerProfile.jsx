"use client";

import { authClient } from "@/lib/auth-client";

export default function ManagerProfile() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="h-12 w-48 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const role = user.role || "manager";

  const initials = (user.name || user.email || "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
      <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-emerald-600 font-bold text-white">
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
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
          {user.name || "RouteSync User"}
        </p>

        <p className="max-w-40 truncate text-xs text-slate-500 dark:text-slate-400">
          {user.email}
        </p>

        <p className="text-xs capitalize text-emerald-600 dark:text-emerald-400">
          {role}
        </p>
      </div>
    </div>
  );
}