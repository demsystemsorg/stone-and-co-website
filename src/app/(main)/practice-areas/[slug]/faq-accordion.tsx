"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { FAQ } from "@/types/practice-area";

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [isOpen, setIsOpen] = React.useState(index === 0);

  return (
    <div className="border-b border-line last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="font-serif text-[1.1rem] font-medium text-ink group-hover:text-gold-deep transition-colors pr-4">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gold flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-dim text-[0.95rem] leading-[1.7] pb-6 pr-8">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  return (
    <div>
      {faqs.map((faq, index) => (
        <FAQItem key={index} faq={faq} index={index} />
      ))}
    </div>
  );
}
