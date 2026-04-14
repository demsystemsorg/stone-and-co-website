"use client";

import * as React from "react";
import Image from "next/image";

const IMAGES = [
  "/images/hero/london-thames.jpg",
  "/images/hero/st-pauls.jpg",
  "/images/hero/city-skyline.jpg",
];

const INTERVAL = 8000; // ms per image

export function HeroCarousel() {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % IMAGES.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Crossfading images */}
      {IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0"
          style={{
            opacity: active === i ? 1 : 0,
            transition: "opacity 2.5s ease",
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            style={{ filter: "saturate(0.25)" }}
            quality={50}
            sizes="100vw"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gradient overlay: nearly opaque left (copy), less opaque right (logo) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.94) 45%, rgba(255,255,255,0.87) 100%)",
        }}
      />
    </div>
  );
}
