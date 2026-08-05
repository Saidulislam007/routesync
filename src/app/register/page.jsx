import AuthHeader from "@/components/AuthHeader";
import RegisterForm from "@/components/RegisterForm";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Create account | RouteSync",
  description:
    "Create a verified RouteSync employee account for smarter shared company travel.",
};

const benefits = [
  "Company-verified employees",
  "Nearby route matching",
  "Lower fuel and trip costs",
  "Emergency trip priority",
];

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 pb-12 pt-24 text-foreground sm:px-6 lg:px-10 lg:pt-28 xl:px-12">
      <AuthHeader />

      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-500/10" />

      <div className="mx-auto grid max-w-[1240px] items-center gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
        {/* Image section */}
        <section className="relative order-2 overflow-hidden rounded-[1.75rem] bg-slate-900 lg:order-1 lg:min-h-[650px]">
          <div className="relative aspect-[16/11] lg:absolute lg:inset-0 lg:aspect-auto">
            <Image
              src="/images/routesync-register.webp"
              alt="Bangladeshi corporate team joining RouteSync together"
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
          </div>

          {/* Image content */}
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7 lg:p-9">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Bring your team onto one smarter route.
            </h2>

            <div className="mt-4 grid gap-2 text-xs text-white/80 sm:grid-cols-2 sm:text-sm lg:grid-cols-1 xl:grid-cols-2">
              {benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2
                    className="size-4 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />

                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Registration form */}
        <section className="relative z-10 order-1 lg:order-2">
          <RegisterForm />
        </section>
      </div>
    </main>
  );
}