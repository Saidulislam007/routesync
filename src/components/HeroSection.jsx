"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, Fuel, MapPin, Navigation, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const metrics = [
  { icon: Users, value: "2.4K+", label: "Employees connected" },
  { icon: Fuel, value: "32%", label: "Average fuel saved" },
  { icon: Clock3, value: "4 min", label: "Average trip match" },
];
const glass = "border border-white/70 bg-white/90 shadow-[0_24px_50px_-12px_rgba(4,30,22,0.25)] backdrop-blur-xl dark:border-[#3FCB9B]/20 dark:bg-[#101E19]/90";

export default function HeroSection() {
  const reducedMotion = useReducedMotion();
  const stageRef = useRef(null);
  const pointerInside = useRef(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 85, damping: 24 });
  const rotateY = useSpring(rawY, { stiffness: 85, damping: 24 });
  const headingX = useTransform(rotateX, (value) => value * 0.13);
  const headingY = useTransform(rotateY, (value) => value * 0.13);
  const [saved, setSaved] = useState(0);

  // Pause idle animation when the scene is off screen or the tab is hidden.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reducedMotion) return;
    let frame = 0;
    let visible = false;
    const tick = (time) => {
      if (!pointerInside.current) {
        rawX.set(Math.cos(time / 2300) * 2);
        rawY.set(Math.sin(time / 2900) * 3);
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(stage);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [rawX, rawY, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (time) => {
        const progress = Math.min(1, (time - start) / 1500);
        setSaved(Math.round(12480 * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, 650);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); };
  }, [reducedMotion]);

  const tilt = (event) => {
    if (reducedMotion || event.pointerType !== "mouse") return;
    pointerInside.current = true;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
    const y = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
    rawX.set(-y * 13);
    rawY.set(x * 15);
  };
  const resetTilt = () => {
    pointerInside.current = false;
    rawX.set(0);
    rawY.set(0);
  };
  const reveal = (delay = 0) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  });
  const float = (distance, duration) => reducedMotion ? {} : {
    animate: { y: [0, -distance, 0] },
    transition: { duration, repeat: Infinity, ease: "easeInOut" },
  };

  return (
    <section id="home" className="relative isolate overflow-hidden bg-[#F3F7F5] px-5 pb-10 pt-12 text-[#0B1512] sm:px-6 sm:pb-14 sm:pt-16 lg:px-10 lg:pt-20 xl:px-14 dark:bg-[#070D0B] dark:text-[#EAF3EF]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div {...float(35, 16)} className="absolute -right-32 -top-40 size-[520px] rounded-full bg-[#5FE3B4]/20 blur-[85px] dark:bg-[#0E8F6E]/15" />
        <motion.div {...float(25, 20)} className="absolute -bottom-48 -left-32 size-[420px] rounded-full bg-[#E8A33D]/10 blur-[85px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,143,110,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(14,143,110,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-[1.02fr_1fr] lg:gap-10 xl:gap-16">
        <div className="relative z-10 max-w-2xl [perspective:1000px]">
          <motion.div {...reveal()} className="inline-flex items-center gap-2 rounded-full border border-[#0E8F6E]/25 bg-white/70 px-3.5 py-2 text-xs font-semibold text-[#075C46] backdrop-blur-sm sm:text-sm dark:bg-[#101E19]/70 dark:text-[#3FCB9B]">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full rounded-full bg-[#0E8F6E]/50 motion-safe:animate-ping" /><span className="relative size-2 rounded-full bg-[#0E8F6E]" /></span>
            Smart office mobility for Bangladesh
          </motion.div>

          <motion.h1 style={{ rotateX: reducedMotion ? 0 : headingX, rotateY: reducedMotion ? 0 : headingY, transformStyle: "preserve-3d" }} className="mt-6 text-[clamp(2.5rem,6vw,5.4rem)] font-extrabold leading-[1.02] tracking-[-0.055em] drop-shadow-[0_18px_28px_rgba(4,30,22,0.12)]">
            {["One route.", "More people.", "Less cost."].map((line, index) => (
              <span key={line} className="block overflow-hidden pb-1 [perspective:800px]">
                <motion.span initial={reducedMotion ? false : { y: "110%", rotateX: -35, opacity: 0 }} animate={{ y: 0, rotateX: 0, opacity: 1 }} transition={{ duration: 0.85, delay: 0.08 + index * 0.13, ease: [0.22, 1, 0.36, 1] }} className={`inline-block origin-bottom ${index === 1 ? "bg-gradient-to-r from-[#075C46] via-[#0E8F6E] to-[#65CDA8] bg-clip-text text-transparent dark:from-[#3FCB9B] dark:via-[#5FE3B4] dark:to-[#D2E7AE]" : ""}`}>{line}</motion.span>
              </span>
            ))}
          </motion.h1>
          <motion.p {...reveal(0.4)} className="mt-5 max-w-[46ch] text-base leading-7 text-[#4B5A55] sm:text-lg sm:leading-8 dark:text-[#9FB3AC]">RouteSync matches nearby employee trip requests, creates shared rides, and helps companies reduce vehicles, fuel use, and travel stress.</motion.p>
          <motion.div {...reveal(0.5)} className="mt-7 flex flex-col gap-3 sm:flex-row">
            <motion.a href="/trips#request-trip" whileHover={reducedMotion ? undefined : { y: -3, scale: 1.02 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }} className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#0E8F6E] to-[#075C46] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(14,143,110,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E8F6E] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#070D0B]">Request a shared trip <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-1" aria-hidden="true" /></motion.a>
            <motion.a href="/how-it-works" whileHover={reducedMotion ? undefined : { y: -3 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }} className="inline-flex min-h-13 items-center justify-center rounded-2xl border border-[#DCE6E1] bg-white/70 px-6 text-sm font-semibold text-[#0B1512] backdrop-blur-sm transition-colors hover:border-[#0E8F6E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E8F6E] focus-visible:ring-offset-2 dark:border-[#1D2E28] dark:bg-[#101E19]/70 dark:text-[#EAF3EF] dark:focus-visible:ring-offset-[#070D0B]">See how matching works</motion.a>
          </motion.div>
          <motion.div {...reveal(0.6)} className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-[#4B5A55] sm:text-sm dark:text-[#9FB3AC]">
            {["Emergency trip priority", "Verified company access", "Real-time confirmation"].map((item) => <span key={item} className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 shrink-0 text-[#0E8F6E] dark:text-[#3FCB9B]" aria-hidden="true" />{item}</span>)}
          </motion.div>
        </div>

        <motion.div {...reveal(0.2)} className="relative mx-auto w-full max-w-[650px] px-2 pb-12 pt-8 sm:px-4 sm:pb-16 lg:justify-self-end">
          <div ref={stageRef} onPointerMove={tilt} onPointerLeave={resetTilt} onPointerCancel={resetTilt} className="relative aspect-[1.12] w-full [perspective:1400px]">
            <motion.div style={{ rotateX: reducedMotion ? 0 : rotateX, rotateY: reducedMotion ? 0 : rotateY, transformStyle: "preserve-3d" }} className="absolute inset-0 motion-safe:will-change-transform">
              <div aria-hidden="true" className="absolute inset-x-4 inset-y-6 rounded-[2rem] bg-gradient-to-br from-[#0E8F6E] to-[#063528] shadow-[0_40px_70px_-25px_rgba(4,30,22,0.4)] [transform:translateZ(-45px)_rotate(-5deg)]" />
              <div className="absolute inset-x-3 inset-y-4 overflow-hidden rounded-[1.8rem] border-4 border-white/80 bg-[#DCE6E1] shadow-[0_30px_65px_-20px_rgba(4,30,22,0.35)] [transform:translateZ(0px)] sm:rounded-[2.1rem] dark:border-[#1D2E28]">
                <Image src="/images/routesync-commute.webp" alt="Bangladeshi office employees sharing a company shuttle in Dhaka" fill priority unoptimized sizes="(max-width: 640px) 90vw, (max-width: 1024px) 600px, 45vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#031A12]/65 via-transparent to-transparent" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />
              </div>

              <div className="absolute -left-1 -top-3 w-[32%] min-w-[92px] max-w-[185px] [transform:translateZ(50px)] sm:-left-4 sm:-top-4">
                <motion.div {...float(7, 5.5)} className="overflow-hidden rounded-2xl border-4 border-[#F3F7F5] shadow-[0_20px_40px_-12px_rgba(4,30,22,0.4)] dark:border-[#101E19]">
                  <div className="relative aspect-[4/3]"><Image src="/images/routesync-dhaka-route.webp" alt="Company shuttle travelling through a Dhaka business district" fill unoptimized sizes="(max-width: 640px) 30vw, 185px" className="object-cover" /></div>
                </motion.div>
              </div>

              <div className="absolute right-0 top-0 [transform:translateZ(75px)] sm:right-2 sm:top-2">
                <motion.div {...float(9, 4.8)} className={`${glass} rounded-2xl px-3 py-2.5 text-right sm:px-5 sm:py-3.5`}>
                  <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#4B5A55] sm:text-[11px] dark:text-[#9FB3AC]">Today saved</p>
                  <p className="mt-1 text-lg font-extrabold tabular-nums text-[#075C46] sm:text-2xl dark:text-[#3FCB9B]">৳ {(reducedMotion ? 12480 : saved).toLocaleString("en-US")}</p>
                </motion.div>
              </div>

              <div className="absolute bottom-[12%] left-0 max-w-[87%] [transform:translateZ(60px)] sm:left-2">
                <motion.div {...float(6, 6)} className={`${glass} flex items-center gap-2.5 rounded-2xl p-3 sm:gap-3 sm:p-4`}>
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0E8F6E] to-[#075C46] text-white sm:size-11"><Navigation className="size-[18px]" aria-hidden="true" /></span>
                  <div><p className="text-[10px] text-[#4B5A55] sm:text-xs dark:text-[#9FB3AC]">Shared route</p><p className="mt-0.5 text-xs font-bold sm:text-sm">Uttara → Motijheel</p></div>
                  <span className="rounded-full bg-[#0E8F6E]/15 px-2 py-1 text-[9px] font-bold text-[#075C46] sm:ml-2 sm:text-[11px] dark:text-[#3FCB9B]">4 matched</span>
                </motion.div>
              </div>

              <div className="absolute -bottom-5 right-0 w-[57%] max-w-[285px] [transform:translateZ(85px)] sm:-bottom-6 sm:right-2">
                <motion.div {...float(10, 5.8)} className={`${glass} flex items-center gap-2.5 rounded-2xl p-2.5 sm:p-3`}>
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-xl sm:size-14"><Image src="/images/routesync-shared-team.webp" alt="Bangladeshi colleagues enjoying a shared office commute" fill unoptimized sizes="56px" className="object-cover" /></div>
                  <div className="min-w-0"><p className="text-[11px] font-bold sm:text-sm">Trip matched!</p><p className="mt-1 flex items-center gap-1 text-[9px] text-[#4B5A55] sm:text-xs dark:text-[#9FB3AC]"><MapPin className="size-3 shrink-0 text-[#0E8F6E]" />3 nearby colleagues</p></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div {...reveal(0.65)} className="mx-auto mt-10 grid max-w-[1440px] grid-cols-1 divide-y divide-[#DCE6E1] overflow-hidden rounded-2xl border border-[#DCE6E1] bg-white/65 shadow-sm backdrop-blur-md sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:mt-14 dark:divide-[#1D2E28] dark:border-[#1D2E28] dark:bg-[#101E19]/65">
        {metrics.map(({ icon: Icon, value, label }) => <div key={label} className="flex items-center gap-3 px-5 py-4 sm:justify-center sm:px-4 lg:py-5"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#0E8F6E]/10 text-[#075C46] dark:text-[#3FCB9B]"><Icon className="size-5" aria-hidden="true" /></span><div><p className="text-lg font-bold tracking-tight">{value}</p><p className="text-xs text-[#4B5A55] sm:text-[11px] lg:text-xs dark:text-[#9FB3AC]">{label}</p></div></div>)}
      </motion.div>
    </section>
  );
}
