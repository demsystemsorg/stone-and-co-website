"use client";

import * as React from "react";
import { createTimeline } from "animejs";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease } from "@/lib/anime/config";
import type { HeroDisplayLogoHandle, Timeline } from "./hero-display-logo-types";

/**
 * "The Seal" — Geometric Monogram (Stitch Option 01)
 *
 * S slides from left, & from right — they meet with a micro-compression bounce.
 * Gold rule draws beneath, then "STONE & CO." fades up.
 */
export const HeroDisplaySeal = React.forwardRef<HeroDisplayLogoHandle>(
  function HeroDisplaySeal(_props, ref) {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const sRef = React.useRef<HTMLSpanElement>(null);
    const ampRef = React.useRef<HTMLSpanElement>(null);
    const cRef = React.useRef<HTMLSpanElement>(null);
    const ruleRef = React.useRef<HTMLDivElement>(null);
    const wordStoneRef = React.useRef<HTMLSpanElement>(null);
    const wordAmpRef = React.useRef<HTMLSpanElement>(null);
    const wordCoRef = React.useRef<HTMLSpanElement>(null);
    const standaloneTlRef = React.useRef<ReturnType<typeof createTimeline> | null>(null);

    /** Set all child elements to hidden states via raw DOM */
    const setHiddenStates = React.useCallback(() => {
      const s = sRef.current;
      const amp = ampRef.current;
      const c = cRef.current;
      const rule = ruleRef.current;
      const wordStone = wordStoneRef.current;
      const wordAmp = wordAmpRef.current;
      const wordCo = wordCoRef.current;
      if (!s || !amp || !c || !rule || !wordStone || !wordAmp || !wordCo) return;

      s.style.opacity = "0";
      s.style.transform = "translateX(-40px) scale(0.7)";
      amp.style.opacity = "0";
      amp.style.transform = "translateX(0) scale(0.7)";
      c.style.opacity = "0";
      c.style.transform = "translateX(40px) scale(0.7)";
      rule.style.transform = "scaleX(0)";
      wordStone.style.opacity = "0";
      wordStone.style.transform = "translateY(8px)";
      wordAmp.style.opacity = "0";
      wordAmp.style.transform = "scale(0.6)";
      wordCo.style.opacity = "0";
      wordCo.style.transform = "translateY(8px)";
    }, []);

    /** Build and play a standalone animation timeline (for replay) */
    const buildAndPlay = React.useCallback(() => {
      const wrapper = wrapperRef.current;
      const s = sRef.current;
      const amp = ampRef.current;
      const c = cRef.current;
      const rule = ruleRef.current;
      const wordStone = wordStoneRef.current;
      const wordAmp = wordAmpRef.current;
      const wordCo = wordCoRef.current;
      if (!wrapper || !s || !amp || !c || !rule || !wordStone || !wordAmp || !wordCo) return;

      standaloneTlRef.current?.revert();
      setHiddenStates();
      wrapper.style.opacity = "1";

      const tl = createTimeline({
        defaults: { ease: ease.primary },
      });

      // "S" slides in from left
      tl.add(s, {
        opacity: [0, 1],
        translateX: [-40, 0],
        scale: [0.7, 1],
        duration: 500,
        ease: ease.authority,
      }, 0);

      // "&" scales up from center
      tl.add(amp, {
        opacity: [0, 1],
        scale: [0.7, 1],
        duration: 500,
        ease: ease.authority,
      }, 100);

      // "C" slides in from right
      tl.add(c, {
        opacity: [0, 1],
        translateX: [40, 0],
        scale: [0.7, 1],
        duration: 500,
        ease: ease.authority,
      }, 200);

      // Compression squeeze
      tl.add(s, {
        scaleX: [1, 0.97],
        duration: 120,
        ease: ease.smooth,
      }, 650);

      tl.add(amp, {
        scaleX: [1, 0.97],
        duration: 120,
        ease: ease.smooth,
      }, 650);

      tl.add(c, {
        scaleX: [1, 0.97],
        duration: 120,
        ease: ease.smooth,
      }, 650);

      // Elastic snapback
      tl.add(s, {
        scaleX: [0.97, 1],
        duration: 200,
        ease: ease.snap,
      }, 770);

      tl.add(amp, {
        scaleX: [0.97, 1],
        duration: 200,
        ease: ease.snap,
      }, 770);

      tl.add(c, {
        scaleX: [0.97, 1],
        duration: 200,
        ease: ease.snap,
      }, 770);

      // Gold rule draws from center
      tl.add(rule, {
        scaleX: [0, 1],
        duration: 400,
        ease: ease.inkDraw,
      }, 800);

      // "STONE" fades up
      tl.add(wordStone, {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 300,
        ease: ease.primary,
      }, 1100);

      // "&" stamps in
      tl.add(wordAmp, {
        opacity: [0, 1],
        scale: [0.6, 1],
        duration: 250,
        ease: ease.stamp,
      }, 1200);

      // "CO." fades up
      tl.add(wordCo, {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 300,
        ease: ease.primary,
      }, 1350);

      standaloneTlRef.current = tl;
    }, [setHiddenStates]);

    React.useImperativeHandle(ref, () => ({
      getWrapper: () => wrapperRef.current,
      replay: () => {
        if (prefersReducedMotion()) return;
        buildAndPlay();
      },
      registerOnTimeline: (tl: Timeline) => {
        const wrapper = wrapperRef.current;
        const s = sRef.current;
        const amp = ampRef.current;
        const c = cRef.current;
        const rule = ruleRef.current;
        const wordStone = wordStoneRef.current;
        const wordAmp = wordAmpRef.current;
        const wordCo = wordCoRef.current;

        if (!wrapper || !s || !amp || !c || !rule || !wordStone || !wordAmp || !wordCo) return;

        // Set initial hidden states (raw DOM)
        setHiddenStates();

        // Reveal wrapper
        wrapper.style.opacity = "1";

        // T=800 — "S" slides in from left
        tl.add(s, {
          opacity: [0, 1],
          translateX: [-40, 0],
          scale: [0.7, 1],
          duration: 500,
          ease: ease.authority,
        }, 800);

        // T=900 — "&" scales up from center
        tl.add(amp, {
          opacity: [0, 1],
          scale: [0.7, 1],
          duration: 500,
          ease: ease.authority,
        }, 900);

        // T=1000 — "C" slides in from right
        tl.add(c, {
          opacity: [0, 1],
          translateX: [40, 0],
          scale: [0.7, 1],
          duration: 500,
          ease: ease.authority,
        }, 1000);

        // T=1450 — Compression squeeze (S, & and C pushed together)
        tl.add(s, {
          scaleX: [1, 0.97],
          duration: 120,
          ease: ease.smooth,
        }, 1450);

        tl.add(amp, {
          scaleX: [1, 0.97],
          duration: 120,
          ease: ease.smooth,
        }, 1450);

        tl.add(c, {
          scaleX: [1, 0.97],
          duration: 120,
          ease: ease.smooth,
        }, 1450);

        // T=1570 — Elastic snapback
        tl.add(s, {
          scaleX: [0.97, 1],
          duration: 200,
          ease: ease.snap,
        }, 1570);

        tl.add(amp, {
          scaleX: [0.97, 1],
          duration: 200,
          ease: ease.snap,
        }, 1570);

        tl.add(c, {
          scaleX: [0.97, 1],
          duration: 200,
          ease: ease.snap,
        }, 1570);

        // T=1600 — Gold rule draws from center
        tl.add(rule, {
          scaleX: [0, 1],
          duration: 400,
          ease: ease.inkDraw,
        }, 1600);

        // T=1900 — "STONE" fades up
        tl.add(wordStone, {
          opacity: [0, 1],
          translateY: [8, 0],
          duration: 300,
          ease: ease.primary,
        }, 1900);

        // T=2000 — "&" stamps in
        tl.add(wordAmp, {
          opacity: [0, 1],
          scale: [0.6, 1],
          duration: 250,
          ease: ease.stamp,
        }, 2000);

        // T=2150 — "CO." fades up
        tl.add(wordCo, {
          opacity: [0, 1],
          translateY: [8, 0],
          duration: 300,
          ease: ease.primary,
        }, 2150);
      },
    }), [setHiddenStates, buildAndPlay]);

    // Reduced motion: show everything immediately
    React.useEffect(() => {
      if (!prefersReducedMotion()) return;
      const wrapper = wrapperRef.current;
      if (wrapper) wrapper.style.opacity = "1";
      [sRef, ampRef, cRef, wordStoneRef, wordAmpRef, wordCoRef].forEach((r) => {
        if (r.current) {
          r.current.style.opacity = "1";
          r.current.style.transform = "none";
        }
      });
      if (ruleRef.current) ruleRef.current.style.transform = "scaleX(1)";
    }, []);

    // Cleanup standalone timeline on unmount
    React.useEffect(() => {
      return () => {
        standaloneTlRef.current?.revert();
      };
    }, []);

    return (
      <div
        ref={wrapperRef}
        className="flex flex-col items-center gap-4 xl:gap-5 2xl:gap-6"
        style={{ opacity: 0 }}
      >
        {/* Monogram: S& at display scale — fluid sizing with clamp */}
        <div className="flex items-baseline leading-none" style={{ fontSize: "clamp(5rem, 6vw + 1rem, 8rem)" }}>
          <span
            ref={sRef}
            className="inline-block text-gold font-sans font-black tracking-tighter"
            style={{ fontSize: "inherit" }}
          >
            S
          </span>
          <span
            ref={ampRef}
            className="inline-block text-gold font-sans font-black tracking-tighter"
            style={{ fontSize: "inherit" }}
          >
            &amp;
          </span>
          <span
            ref={cRef}
            className="inline-block text-gold font-sans font-black tracking-tighter"
            style={{ fontSize: "inherit" }}
          >
            C
          </span>
        </div>

        {/* Gold separator rule — fluid width */}
        <div
          ref={ruleRef}
          className="h-[1.5px] bg-gold"
          style={{ transformOrigin: "center", width: "clamp(4rem, 5vw, 7rem)" }}
        />

        {/* Wordmark: STONE & CO. — fluid sizing */}
        <div
          className="flex items-baseline gap-[0.3em] font-sans font-medium uppercase tracking-[0.3em] text-ink leading-none"
          style={{ fontSize: "clamp(0.9rem, 1vw + 0.4rem, 1.35rem)" }}
        >
          <span ref={wordStoneRef}>STONE</span>
          <span ref={wordAmpRef} className="text-gold">&amp;</span>
          <span ref={wordCoRef}>CO.</span>
        </div>
      </div>
    );
  }
);
