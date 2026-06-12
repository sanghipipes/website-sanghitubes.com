'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeItem {
  abbr: string;
  name: string;
  color: string;
  bg: string;
}

const row1Items: MarqueeItem[] = [
  { abbr: 'UPJN',      name: 'U.P. Jal Nigam',                      color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
  { abbr: 'MES',       name: 'Military Engineer Services',           color: 'text-olive-400',   bg: 'bg-stone-500/10'   },
  { abbr: 'IR',        name: 'Indian Railways',                      color: 'text-orange-400',  bg: 'bg-orange-500/10'  },
  { abbr: 'MUNI',      name: 'Municipal Corporations',               color: 'text-teal-400',    bg: 'bg-teal-500/10'    },
  { abbr: 'SWSB',      name: 'State Water Supply Boards',            color: 'text-cyan-400',    bg: 'bg-cyan-500/10'    },
  { abbr: 'RNN',       name: 'U.P. Rajkiya Nirman Nigam',            color: 'text-indigo-400',  bg: 'bg-indigo-500/10'  },
  { abbr: 'NHAI',      name: 'NHAI',                                 color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
];

const row2Items: MarqueeItem[] = [
  { abbr: 'CPWD',      name: 'Central Public Works Dept.',           color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { abbr: 'JJM',       name: 'Jal Jeevan Mission',                   color: 'text-sky-400',     bg: 'bg-sky-500/10'     },
  { abbr: 'MPJN',      name: 'M.P. Jal Nigam',                       color: 'text-purple-400',  bg: 'bg-purple-500/10'  },
  { abbr: 'AMR 2.0',   name: 'Amrut 2.0',                            color: 'text-rose-400',    bg: 'bg-rose-500/10'    },
  { abbr: 'IAF',       name: 'Indian Air Force',                     color: 'text-violet-400',  bg: 'bg-violet-500/10'  },
  { abbr: 'NAVY',      name: 'Indian Navy',                          color: 'text-blue-300',    bg: 'bg-blue-400/10'    },
  { abbr: 'PHED',      name: 'PHED',                                 color: 'text-green-400',   bg: 'bg-green-500/10'   },
];

function MarqueeRow({ items, reverse = false }: { items: MarqueeItem[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-2">
      <div
        className="flex gap-4 w-max"
        style={{ animation: `${reverse ? 'marquee-reverse' : 'marquee'} 38s linear infinite` }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl border border-border/20 ${item.bg} shrink-0`}
          >
            <span
              className={`text-[10px] font-black uppercase tracking-[0.12em] px-2 py-0.5 rounded-md bg-muted/20 border border-border/20 ${item.color}`}
            >
              {item.abbr}
            </span>
            <span className="text-sm font-semibold text-foreground/80 whitespace-nowrap">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrustedBrandsMarquee() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.04] to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-48 bg-primary/8 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 mb-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center"
        >
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
            Certified &amp; Trusted
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase italic mb-5">
            Our Trusted <span className="text-primary not-italic">Brands</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Certified by India&apos;s top standards bodies. Partnered with the nation&apos;s leading
            water and infrastructure authorities.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 space-y-5">
        <MarqueeRow items={row1Items} />
        <MarqueeRow items={row2Items} reverse />
      </div>

      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />
    </section>
  );
}
