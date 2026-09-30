"use client";

import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const getDashboardRoute = (role) => {
    switch (role) {
      case "manager":
        return "/dashboard/manager";

      case "driver":
        return "/dashboard/driver";

      case "admin":
        return "/dashboard/admin";

      case "employee":
      default:
        return "/dashboard/employee";
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        setErrorMessage(
          error.message || "Invalid email or password."
        );
        return;
      }

      const userRole = data?.user?.role || "employee";
      const dashboardRoute = getDashboardRoute(userRole);

      router.replace(dashboardRoute);
      router.refresh();

      console.log("Login successful:", data);
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        "Unable to connect to the authentication server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="w-full max-w-[440px]"
    >
      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
        WELCOME BACK
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">
        Your next shared trip is waiting.
      </h1>

      <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">
        Log in with your verified company email to request, match, and
        manage office trips.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={handleLogin}
        noValidate
      >
        <div>
          <label
            htmlFor="login-email"
            className="text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            Work email
          </label>

          <div className="relative mt-2">
            <Mail
              className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              id="login-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={isSubmitting}
              required
              placeholder="you@company.com"
              className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="login-password"
              className="text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative mt-2">
            <LockKeyhole
              className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={isSubmitting}
              required
              placeholder="Enter your password"
              className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-12 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              disabled={isSubmitting}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:text-emerald-600 disabled:cursor-not-allowed"
            >
              {showPassword ? (
                <EyeOff className="size-[18px]" />
              ) : (
                <Eye className="size-[18px]" />
              )}
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <input
            type="checkbox"
            name="remember"
            checked={rememberMe}
            onChange={(event) =>
              setRememberMe(event.target.checked)
            }
            disabled={isSubmitting}
            className="size-4 rounded border-slate-300 accent-emerald-600"
          />

          Keep me signed in on this device
        </label>

        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-400/10 dark:text-rose-300"
          >
            <AlertCircle className="mt-0.5 size-[18px] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <motion.button
          whileHover={isSubmitting ? undefined : { y: -2 }}
          whileTap={isSubmitting ? undefined : { scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-[18px] animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Log in securely

              <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-1" />
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-600 dark:text-slate-400">
        New to RouteSync?{" "}
        <Link
          href="/register"
          className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          Create your employee account
        </Link>
      </p>
    </motion.div>
  );
}