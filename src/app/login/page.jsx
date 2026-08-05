import AuthHeader from "@/components/AuthHeader";
import LoginForm from "@/components/LoginForm";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Log in | RouteSync",
  description: "Log in to RouteSync and manage your shared company trips.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen mt-20 bg-background text-foreground">
      <AuthHeader />
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <section className="flex items-center justify-center px-4 pb-12 pt-24 sm:px-8 lg:px-12 xl:px-20">
          <LoginForm />
        </section>

        <section className="relative hidden min-h-screen overflow-hidden p-5 lg:block">
          <div className="relative h-full min-h-[680px] overflow-hidden rounded-[2rem] bg-slate-900">
            <Image src="/images/routesync-login.webp" alt="Bangladeshi professional arriving for a shared company commute" fill priority unoptimized sizes="55vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-slate-950/10" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-white xl:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold backdrop-blur-md">
                <ShieldCheck className="size-4 text-emerald-400" /> Verified company access
              </div>
              <blockquote className="mt-5 max-w-xl text-2xl font-semibold leading-snug tracking-[-0.025em] xl:text-3xl">“One login connects every employee to smarter, safer, shared office travel.”</blockquote>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/75">
                {["Secure access", "Live trip status", "Emergency priority"].map((item) => <span key={item} className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-400" />{item}</span>)}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}