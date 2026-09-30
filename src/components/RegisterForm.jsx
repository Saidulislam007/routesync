"use client";

import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Building2,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  IdCard,
  Loader2,
  LockKeyhole,
  Mail,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const fields = [
  {
    id: "full-name",
    name: "name",
    label: "Full name",
    type: "text",
    placeholder: "Your full name",
    icon: UserRound,
    autoComplete: "name",
  },
  {
    id: "work-email",
    name: "email",
    label: "Work email",
    type: "email",
    placeholder: "you@company.com",
    icon: Mail,
    autoComplete: "email",
  },
  {
    id: "company-name",
    name: "company",
    label: "Company name",
    type: "text",
    placeholder: "Your organization",
    icon: Building2,
    autoComplete: "organization",
  },
  {
    id: "employee-id",
    name: "employeeId",
    label: "Employee ID",
    type: "text",
    placeholder: "e.g. EMP-1042",
    icon: IdCard,
    autoComplete: "off",
  },
];

const initialFormData = {
  name: "",
  email: "",
  company: "",
  employeeId: "",
  password: "",
};

const acceptedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
const maximumImageSize = 1024 * 1024;

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageError, setImageError] = useState("");

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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    setImageError("");

    if (!file) {
      return;
    }

    if (!acceptedImageTypes.includes(file.type)) {
      setProfileImage("");
      setImageError("Please upload a JPG, PNG, WEBP, GIF or AVIF image.");
      event.target.value = "";
      return;
    }

    if (file.size > maximumImageSize) {
      setProfileImage("");
      setImageError("Profile image must be 1 MB or smaller.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };

    reader.onerror = () => {
      setProfileImage("");
      setImageError("The selected image could not be read. Try another image.");
      event.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setProfileImage("");
    setImageError("");

    const imageInput = document.getElementById("profile-image");
    if (imageInput) {
      imageInput.value = "";
    }
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const company = formData.company.trim();
    const employeeId = formData.employeeId.trim().toUpperCase();
    const password = formData.password;

    if (!name || !email || !company || !employeeId || !password) {
      return "Please complete all required fields.";
    }

    if (password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (!acceptedTerms) {
      return "You must accept the terms before registering.";
    }

    return "";
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { data, error } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        company: formData.company.trim(),
        employeeId: formData.employeeId.trim().toUpperCase(),
        image: profileImage || undefined,
        callbackURL: "/dashboard/employee",
      });

      if (error) {
        setErrorMessage(
          error.message || "Registration failed. Please try again.",
        );
        return;
      }

      setSuccessMessage(
        "Account created successfully. Redirecting to your dashboard...",
      );

      setFormData(initialFormData);
      setAcceptedTerms(false);
      setProfileImage("");
      setImageError("");

      router.push("/dashboard/employee");
      router.refresh();

      console.log("Registration successful", data);
    } catch (error) {
      console.error("Registration error:", error);

      setErrorMessage(
        "Unable to connect to the authentication server. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-[1.6rem] border border-slate-200 bg-white/95 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900/95"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
            Employee onboarding
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-slate-950 sm:text-3xl dark:text-white">
            Create your RouteSync account
          </h1>
        </div>

        <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:block dark:bg-emerald-400/10 dark:text-emerald-300">
          Step 1 of 2
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
        Use your official company details. Your organization can verify access
        before your first trip.
      </p>

      <form className="mt-7" onSubmit={handleRegister} noValidate>
        <div className="mb-6">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Profile image{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>

          <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-950/50">
            <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Selected profile preview"
                  className="size-full object-cover"
                />
              ) : (
                <Camera className="size-7" aria-hidden="true" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <label
                  htmlFor="profile-image"
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 ${
                    isSubmitting
                      ? "pointer-events-none opacity-60"
                      : "cursor-pointer"
                  }`}
                >
                  <Upload className="size-[17px]" aria-hidden="true" />
                  {profileImage ? "Change image" : "Upload image"}
                </label>

                {profileImage && (
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    disabled={isSubmitting}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-rose-400/10 dark:hover:text-rose-400"
                  >
                    <X className="size-[17px]" aria-hidden="true" />
                    Remove
                  </button>
                )}
              </div>

              <input
                id="profile-image"
                name="profileImage"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="sr-only"
              />

              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                JPG, PNG, WEBP, GIF or AVIF. Maximum size 1 MB.
              </p>

              {imageError && (
                <p
                  role="alert"
                  className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400"
                >
                  {imageError}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(
            ({
              id,
              name,
              label,
              type,
              placeholder,
              icon: Icon,
              autoComplete,
            }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  {label}
                </label>

                <div className="relative mt-2">
                  <Icon
                    className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />

                  <input
                    id={id}
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    autoComplete={autoComplete}
                    disabled={isSubmitting}
                    required
                    placeholder={placeholder}
                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
            ),
          )}
        </div>

        <div className="mt-5">
          <label
            htmlFor="register-password"
            className="text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            Create password
          </label>

          <div className="relative mt-2">
            <LockKeyhole
              className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={isSubmitting}
              required
              minLength={8}
              placeholder="Minimum 8 characters"
              className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-12 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              disabled={isSubmitting}
              aria-label={showPassword ? "Hide password" : "Show password"}
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

        <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-600 sm:text-sm dark:text-slate-400">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => {
              setAcceptedTerms(event.target.checked);
              setErrorMessage("");
            }}
            disabled={isSubmitting}
            required
            className="mt-0.5 size-4 shrink-0 rounded border-slate-300 accent-emerald-600"
          />

          <span>
            I agree to RouteSync&apos;s terms and confirm that the company
            information provided is accurate.
          </span>
        </label>

        {errorMessage && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-400/10 dark:text-rose-300"
          >
            <AlertCircle className="mt-0.5 size-[18px] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-300"
          >
            <CheckCircle2 className="mt-0.5 size-[18px] shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <motion.button
          whileHover={isSubmitting ? undefined : { y: -2 }}
          whileTap={isSubmitting ? undefined : { scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-[18px] animate-spin" />
              Creating account...
            </>
          ) : (
            "Create employee account"
          )}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Already registered?{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          Log in here
        </Link>
      </p>
    </motion.div>
  );
}