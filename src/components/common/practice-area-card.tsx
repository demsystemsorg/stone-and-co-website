"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface PracticeAreaCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
  featured?: boolean;
}

export function PracticeAreaCard({ title, description, href }: PracticeAreaCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 p-8 md:p-9 bg-surface hover:bg-bg transition-colors duration-200 h-full"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif font-semibold text-[1.3rem] leading-[1.2] text-ink">
          {title}
        </h3>
        <ArrowRight
          className="w-[18px] h-[18px] text-gold-soft group-hover:text-gold group-hover:translate-x-[3px] transition-all duration-200 shrink-0"
          strokeWidth={1.5}
        />
      </div>
      <p className="text-[0.85rem] text-dim leading-[1.6]">{description}</p>
    </Link>
  );
}
