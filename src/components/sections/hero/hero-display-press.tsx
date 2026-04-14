"use client";

import * as React from "react";
import { animate } from "animejs";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease } from "@/lib/anime/config";
import type { HeroDisplayLogoHandle, Timeline } from "./hero-display-logo-types";

/**
 * "The Press" — Letterpress Frame (Stitch Option 04)
 *
 * Gold border draws clockwise, then S, &, C stamp in like a letterpress.
 */
export const HeroDisplayPress = React.forwardRef<HeroDisplayLogoHandle>(
  function HeroDisplayPress(_props, ref) {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const borderTopRef = React.useRef<HTMLDivElement>(null);
    const borderRightRef = React.useRef<HTMLDivElement>(null);
    const borderBottomRef = React.useRef<HTMLDivElement>(null);
    const borderLeftRef = React.useRef<HTMLDivElement>(null);
    const letterSRef = React.useRef<HTMLSpanElement>(null);
    const letterAmpRef = React.useRef<HTMLSpanElement>(null);
    const letterCRef = React.useRef<HTMLSpanElement>(null);
    const subtitleRef = React.useRef<HTMLSpanElement>(null);
    const typeAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);

    React.useImperativeHandle(ref, () => ({
      getWrapper: () => wrapperRef.current,
      replay: () => { /* TODO: standalone replay for Press variant */ },
      registerOnTimeline: (tl: Timeline) => {
        const wrapper = wrapperRef.current;
        const bTop = borderTopRef.current;
        const bRight = borderRightRef.current;
        const bBottom = borderBottomRef.current;
        const bLeft = borderLeftRef.current;
        const letterS = letterSRef.current;
        const letterAmp = letterAmpRef.current;
        const letterC = letterCRef.current;
        const subtitle = subtitleRef.current;

        if (!wrapper || !bTop || !bRight || !bBottom || !bLeft || !letterS || !letterAmp || !letterC || !subtitle) return;

        // Set initial hidden states (raw DOM)
        bTop.style.transform = "scaleX(0)";
        bRight.style.transform = "scaleY(0)";
        bBottom.style.transform = "scaleX(0)";
        bLeft.style.transform = "scaleY(0)";
        letterS.style.opacity = "0";
        letterS.style.transform = "scale(1.15) translateY(-6px)";
        letterAmp.style.opacity = "0";
        letterAmp.style.transform = "scale(1.15) translateY(-6px)";
        letterC.style.opacity = "0";
        letterC.style.transform = "scale(1.15) translateY(-6px)";
        subtitle.textContent = "";

        // Reveal wrapper
        wrapper.style.opacity = "1";

        // T=800 — Top border draws left→right
        tl.add(bTop, {
          scaleX: [0, 1],
          duration: 350,
          ease: ease.smooth,
        }, 800);

        // T=1050 — Right border draws top→bottom
        tl.add(bRight, {
          scaleY: [0, 1],
          duration: 300,
          ease: ease.smooth,
        }, 1050);

        // T=1250 — Bottom border draws right→left
        tl.add(bBottom, {
          scaleX: [0, 1],
          duration: 300,
          ease: ease.smooth,
        }, 1250);

        // T=1450 — Left border draws bottom→top
        tl.add(bLeft, {
          scaleY: [0, 1],
          duration: 300,
          ease: ease.smooth,
        }, 1450);

        // T=1600 — "S" stamps down
        tl.add(letterS, {
          opacity: [0, 1],
          scale: [1.15, 1],
          translateY: [-6, 0],
          duration: 300,
          ease: ease.stamp,
        }, 1600);

        // T=1750 — "&" stamps down
        tl.add(letterAmp, {
          opacity: [0, 1],
          scale: [1.15, 1],
          translateY: [-6, 0],
          duration: 300,
          ease: ease.stamp,
        }, 1750);

        // T=1900 — "C" stamps down
        tl.add(letterC, {
          opacity: [0, 1],
          scale: [1.15, 1],
          translateY: [-6, 0],
          duration: 300,
          ease: ease.stamp,
        }, 1900);

        // T=2150 — "SOLICITORS" typewriter
        const SOLICITORS_TEXT = "SOLICITORS";
        let currentIdx = 0;
        const typeState = { progress: 0 };
        typeAnimRef.current = animate(typeState, {
          progress: [0, 100],
          duration: 800,
          delay: 2150,
          ease: "linear",
          onUpdate: () => {
            const idx = Math.floor((typeState.progress / 100) * SOLICITORS_TEXT.length);
            if (idx > currentIdx && subtitle) {
              currentIdx = idx;
              subtitle.textContent = SOLICITORS_TEXT.slice(0, idx);
            }
          },
          onComplete: () => {
            if (subtitle) subtitle.textContent = SOLICITORS_TEXT;
          },
        });
      },
    }));

    // Reduced motion: show everything immediately
    React.useEffect(() => {
      if (!prefersReducedMotion()) return;
      const wrapper = wrapperRef.current;
      if (wrapper) wrapper.style.opacity = "1";
      [borderTopRef, borderRightRef, borderBottomRef, borderLeftRef].forEach((r) => {
        if (r.current) r.current.style.transform = "none";
      });
      [letterSRef, letterAmpRef, letterCRef].forEach((r) => {
        if (r.current) {
          r.current.style.opacity = "1";
          r.current.style.transform = "none";
        }
      });
      if (subtitleRef.current) subtitleRef.current.textContent = "SOLICITORS";

      return () => {
        typeAnimRef.current?.revert();
      };
    }, []);

    return (
      <div
        ref={wrapperRef}
        className="flex flex-col items-center"
        style={{ opacity: 0 }}
      >
        {/* Frame with individually animated borders */}
        <div className="relative px-10 py-8 xl:px-14 xl:py-10 2xl:px-16 2xl:py-12">
          {/* Top edge: draws left→right */}
          <div
            ref={borderTopRef}
            className="absolute top-0 left-0 right-0 h-[1px] bg-gold"
            style={{ transformOrigin: "left" }}
          />
          {/* Right edge: draws top→bottom */}
          <div
            ref={borderRightRef}
            className="absolute top-0 right-0 bottom-0 w-[1px] bg-gold"
            style={{ transformOrigin: "top" }}
          />
          {/* Bottom edge: draws right→left */}
          <div
            ref={borderBottomRef}
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold"
            style={{ transformOrigin: "right" }}
          />
          {/* Left edge: draws bottom→top */}
          <div
            ref={borderLeftRef}
            className="absolute bottom-0 left-0 top-0 w-[1px] bg-gold"
            style={{ transformOrigin: "bottom" }}
          />

          {/* Letters: S & C */}
          <div className="flex items-baseline font-sans font-black tracking-tighter text-ink text-[3.5rem] xl:text-[4.5rem] 2xl:text-[5rem] leading-none">
            <span ref={letterSRef}>S</span>
            <span ref={letterAmpRef} className="text-gold">&amp;</span>
            <span ref={letterCRef}>C</span>
          </div>
        </div>

        {/* Subtitle beneath frame */}
        <span
          ref={subtitleRef}
          className="block text-center mt-3 xl:mt-4 font-sans text-[0.55rem] xl:text-[0.65rem] 2xl:text-xs uppercase tracking-[0.4em] text-dim h-4"
          aria-label="Solicitors"
        />
      </div>
    );
  }
);
