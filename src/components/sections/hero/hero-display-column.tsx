"use client";

import * as React from "react";
import { animate } from "animejs";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease } from "@/lib/anime/config";
import type { HeroDisplayLogoHandle, Timeline } from "./hero-display-logo-types";

const SOLICITORS_TEXT = "SOLICITORS";

/**
 * "The Column" — Pillar Mark (Stitch Option 03)
 *
 * Gold bar draws vertically, text slides out from behind it.
 * This is the original/backup variant.
 */
export const HeroDisplayColumn = React.forwardRef<HeroDisplayLogoHandle>(
  function HeroDisplayColumn(_props, ref) {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const barRef = React.useRef<HTMLDivElement>(null);
    const stoneRef = React.useRef<HTMLSpanElement>(null);
    const ampRef = React.useRef<HTMLSpanElement>(null);
    const coRef = React.useRef<HTMLSpanElement>(null);
    const dotRef = React.useRef<HTMLSpanElement>(null);
    const solicitorsRef = React.useRef<HTMLSpanElement>(null);
    const typeAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);

    React.useImperativeHandle(ref, () => ({
      getWrapper: () => wrapperRef.current,
      replay: () => { /* TODO: standalone replay for Column variant */ },
      registerOnTimeline: (tl: Timeline) => {
        const wrapper = wrapperRef.current;
        const bar = barRef.current;
        const stone = stoneRef.current;
        const amp = ampRef.current;
        const co = coRef.current;
        const dot = dotRef.current;
        const solicitors = solicitorsRef.current;

        if (!wrapper || !bar || !stone || !amp || !co || !dot || !solicitors) return;

        // Set initial hidden states (raw DOM)
        bar.style.transform = "scaleY(0)";
        stone.style.transform = "translateX(-105%)";
        amp.style.opacity = "0";
        amp.style.clipPath = "inset(100% 0 0 0)";
        amp.style.filter = "blur(3px)";
        co.style.transform = "translateX(-105%)";
        dot.style.transform = "scale(0)";
        dot.style.opacity = "0";
        solicitors.textContent = "";

        // Reveal wrapper
        wrapper.style.opacity = "1";

        // T=800 — Gold bar draws from top
        tl.add(bar, {
          scaleY: [0, 1],
          duration: 500,
          ease: ease.inkDraw,
        }, 800);

        // T=1100 — "Stone" slides out from behind the bar
        tl.add(stone, {
          translateX: ["-105%", "0%"],
          duration: 450,
          ease: ease.authority,
        }, 1100);

        // T=1400 — "&" clip-path reveal from below + blur-to-focus
        tl.add(amp, {
          clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"],
          opacity: [0.3, 1],
          filter: ["blur(3px)", "blur(0px)"],
          duration: 600,
          ease: ease.primary,
        }, 1400);

        // T=1850 — "Co" slides out
        tl.add(co, {
          translateX: ["-105%", "0%"],
          duration: 400,
          ease: ease.authority,
        }, 1850);

        // T=2050 — "." stamps down with overshoot
        tl.add(dot, {
          scale: [0, 1],
          opacity: [0, 1],
          duration: 350,
          ease: ease.stamp,
        }, 2050);

        // T=2450 — "SOLICITORS" typewriter
        let currentIdx = 0;
        const typeState = { progress: 0 };
        typeAnimRef.current = animate(typeState, {
          progress: [0, 100],
          duration: 800,
          delay: 2450,
          ease: "linear",
          onUpdate: () => {
            const idx = Math.floor((typeState.progress / 100) * SOLICITORS_TEXT.length);
            if (idx > currentIdx && solicitors) {
              currentIdx = idx;
              solicitors.textContent = SOLICITORS_TEXT.slice(0, idx);
            }
          },
          onComplete: () => {
            if (solicitors) solicitors.textContent = SOLICITORS_TEXT;
          },
        });
      },
    }));

    // Reduced motion: show everything immediately
    React.useEffect(() => {
      if (!prefersReducedMotion()) return;
      const wrapper = wrapperRef.current;
      const solicitors = solicitorsRef.current;
      if (wrapper) wrapper.style.opacity = "1";
      if (solicitors) solicitors.textContent = SOLICITORS_TEXT;

      return () => {
        typeAnimRef.current?.revert();
      };
    }, []);

    return (
      <div
        ref={wrapperRef}
        className="flex items-center gap-4 xl:gap-6 2xl:gap-8"
        style={{ opacity: 0 }}
      >
        {/* Gold pillar bar */}
        <div
          ref={barRef}
          className="w-[2.5px] xl:w-[3px] 2xl:w-[4px] h-20 xl:h-28 2xl:h-32 bg-gold flex-shrink-0"
          style={{ transformOrigin: "top" }}
        />

        {/* Text content */}
        <div>
          <div className="flex items-baseline font-sans text-[2.5rem] xl:text-[3rem] 2xl:text-[3.5rem] font-bold tracking-tight text-ink leading-none whitespace-nowrap">
            <div className="overflow-hidden">
              <span ref={stoneRef} className="inline-block">Stone</span>
            </div>
            <span className="inline-block w-[0.22em]" />
            <span ref={ampRef} className="inline-block text-gold" style={{ opacity: 0 }}>&amp;</span>
            <span className="inline-block w-[0.22em]" />
            <div className="overflow-hidden">
              <span ref={coRef} className="inline-block">Co</span>
            </div>
            <span ref={dotRef} className="inline-block origin-bottom" style={{ opacity: 0 }}>.</span>
          </div>

          <span
            ref={solicitorsRef}
            className="block font-sans text-[0.55rem] xl:text-[0.65rem] 2xl:text-xs uppercase tracking-[0.4em] text-dim mt-1.5 pl-0.5 h-4"
            aria-label="Solicitors"
          />
        </div>
      </div>
    );
  }
);
