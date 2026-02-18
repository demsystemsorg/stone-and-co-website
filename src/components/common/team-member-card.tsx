"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { cardHoverVariants } from "@/styles/animations";

export interface TeamMemberCardProps {
  name: string;
  title: string;
  image: string;
  specializations: string[];
  href: string;
}

export function TeamMemberCard({
  name,
  title,
  image,
  specializations,
  href,
}: TeamMemberCardProps) {
  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
    >
      <Link
        href={href}
        className="group block bg-white rounded-lg overflow-hidden border border-neutral-200 hover:border-gold-400 hover:shadow-md transition-all"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
          <Image
            src={image}
            alt={name}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              "grayscale group-hover:grayscale-0",
              "group-hover:scale-105"
            )}
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display text-lg font-semibold text-neutral-900 mb-1">
            {name}
          </h3>
          <p className="text-sm text-neutral-600 mb-3">{title}</p>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {specializations.slice(0, 2).map((spec) => (
              <Badge key={spec} variant="gold" size="sm">
                {spec}
              </Badge>
            ))}
          </div>

          {/* Link */}
          <div className="flex items-center text-sm font-medium text-gold-500 group-hover:text-gold-400">
            <span>View profile</span>
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
