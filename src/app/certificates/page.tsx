'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Award, Factory, X, CheckCircle2 } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerContainer';

interface Cert {
  badge: string;
  standard: string;
  title: string;
  body: string;
  since: string;
  note: string;
  highlight: string;
}

interface CertCategory {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bg: string;
  border: string;
  glow: string;
  badgeColor: string;
  highlightBg: string;
  certs: Cert[];
}

const certCategories: CertCategory[] = [
  {
    id: 'quality',
    label: 'Quality Management',
    Icon: ShieldCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    glow: 'rgba(16,185,129,0.22)',
    badgeColor: 'bg-emerald-500',
    highlightBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    certs: [
      {
        badge: 'ISO',
        standard: 'ISO 9001 : 2015',
        title: 'Quality Management System',
        body: 'International Organization for Standardization',
        since: '2010',
        note: 'Full QMS covering product design, raw material procurement, manufacturing, testing, and dispatch. Audited annually by an accredited third-party certification body. Scope includes all DI Double Flange Pipes, DI Specials, and CI Pipes manufactured at our Kanpur facility.',
        highlight: 'Globally Recognised',
      },
    ],
  },
  {
    id: 'standards',
    label: 'Bureau of Indian Standards',
    Icon: Factory,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    glow: 'rgba(59,130,246,0.22)',
    badgeColor: 'bg-blue-500',
    highlightBg: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    certs: [
      {
        badge: 'BIS',
        standard: 'IS 8329 / IS 1536',
        title: 'BIS Approved Manufacturer',
        body: 'Bureau of Indian Standards',
        since: '2004',
        note: 'BIS licence covering manufacture of Ductile Iron Double Flange Pipes (IS:8329) and Cast Iron Spun Pipes (IS:1536). Every pipe produced under this licence carries the ISI mark and is independently verified by BIS inspectors at our Kanpur facility.',
        highlight: 'ISI Marked',
      },
    ],
  },
  {
    id: 'government',
    label: 'Government Programme Approvals',
    Icon: Award,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    glow: 'rgba(245,158,11,0.22)',
    badgeColor: 'bg-amber-500',
    highlightBg: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
    certs: [
      {
        badge: 'BLW',
        standard: 'BLW Approved',
        title: 'Banaras Locomotive Works Approved',
        body: 'Indian Railways — BLW, Varanasi',
        since: '2012',
        note: 'Approved supplier to Banaras Locomotive Works (BLW) — a production unit of Indian Railways. Approval covers supply of pipes and tubes for railway infrastructure, maintenance, and manufacturing facility requirements, subject to BLW vendor audit and product qualification testing.',
        highlight: 'Railway Approved',
      },
      {
        badge: 'JJM',
        standard: 'JJM Approved',
        title: 'Jal Jeevan Mission Approved',
        body: 'Ministry of Jal Shakti, Govt. of India',
        since: '2020',
        note: 'Products approved for use under the Jal Jeevan Mission — the Government of India\'s flagship programme to provide tap water connections to every rural household. Approval covers DI and CI pipes for rural water supply schemes across participating states.',
        highlight: 'Govt. Mission Listed',
      },
      {
        badge: 'AMR',
        standard: 'AMRUT 2.0 Approved',
        title: 'AMRUT 2.0 Approved Supplier',
        body: 'Ministry of Housing & Urban Affairs, Govt. of India',
        since: '2021',
        note: 'Approved supplier under AMRUT 2.0 (Atal Mission for Rejuvenation and Urban Transformation), the urban infrastructure development programme focused on water supply and sewerage networks in cities and towns. Our pipe products meet the procurement norms and technical specifications mandated under AMRUT 2.0.',
        highlight: 'Urban Mission Listed',
      },
    ],
  },
];

const stats = [
  { value: '5',   label: 'Active Certifications' },
  { value: '3',   label: 'Standards Bodies'       },
  { value: '15+', label: 'Years Certified'        },
  { value: '100%',label: 'Audit Pass Rate'        },
];

export default function CertificatesPage() {
  const [selected, setSelected] = useState<Cert | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    if (selected) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selected]);

  return (
    <div className="bg-background min-h-screen text-foreground">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="pt-40 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn>
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-5 block">
              Standards &amp; Accreditation
            </span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] mb-6">
              Quality You Can <span className="text-primary not-italic">Trust</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Every Sanghi product is manufactured under the strictest international and national
              quality frameworks — independently verified and continuously audited.
            </p>
          </FadeIn>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="bg-card/60 border border-border/30 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl font-black text-primary mb-1 italic tracking-tighter">{s.value}</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certificate Categories ─────────────────────────────────────────────── */}
      <section className="pb-32 max-w-7xl mx-auto px-6">
        {certCategories.map((cat, ci) => (
          <div key={cat.id} className="mb-24">
            <FadeIn>
              <div className="flex items-center gap-4 mb-12">
                <div className={`p-3 rounded-2xl ${cat.bg} border ${cat.border}`}>
                  <cat.Icon size={24} className={cat.color} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold mb-0.5">
                    Category {String(ci + 1).padStart(2, '0')}
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">{cat.label}</h2>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-border/40 to-transparent ml-4" />
              </div>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.certs.map((cert, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ y: -6, boxShadow: `0 20px 60px -12px ${cat.glow}` }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    onClick={() => setSelected(cert)}
                    className={`group relative bg-card/60 border border-border/30 hover:${cat.border} rounded-[2rem] p-8 cursor-pointer flex flex-col gap-5 overflow-hidden transition-colors duration-300`}
                  >
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                      <span className="text-[80px] font-black text-foreground/[0.04] uppercase rotate-[-20deg] tracking-widest leading-none">
                        {cert.badge}
                      </span>
                    </div>

                    {/* Hover gradient */}
                    <div className={`absolute inset-0 ${cat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <span className={`text-lg md:text-xl font-black uppercase tracking-[0.18em] px-4 py-2 rounded-xl shadow-lg ring-1 ring-white/20 ${cat.badgeColor} text-white`}>
                        {cert.badge}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-lg border ${cat.highlightBg}`}>
                        {cert.highlight}
                      </span>
                    </div>

                    <div className="relative z-10">
                      <div className="font-mono text-xs text-muted-foreground mb-2 tracking-widest uppercase">
                        {cert.standard}
                      </div>
                      <h3 className="text-lg font-black text-foreground uppercase tracking-tight leading-tight mb-2">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">{cert.body}</p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-4 border-t border-border/30">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <CheckCircle2 size={14} className={cat.color} />
                        <span>Since {cert.since}</span>
                      </div>
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        className={`text-[10px] font-black uppercase tracking-widest ${cat.color} group-hover:underline`}
                      >
                        View Details →
                      </motion.span>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        ))}
      </section>

      {/* ── Cert Detail Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative bg-card border border-border/30 rounded-[2.5rem] max-w-xl w-full p-8 md:p-12 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Certificate frame decorations */}
              <div className="absolute inset-3 border border-border/20 rounded-[2rem] pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 blur-[60px] pointer-events-none" />

              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span className="text-[120px] font-black text-foreground/[0.04] uppercase rotate-[-15deg] tracking-widest leading-none">
                  {selected.badge}
                </span>
              </div>

              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 p-2 bg-muted/30 border border-border/30 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors z-10"
              >
                <X size={18} />
              </button>

              {/* Seal */}
              <div className="relative z-10 flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-primary/40 flex items-center justify-center bg-primary/5">
                    <div className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center">
                      <span className="text-xl font-black text-primary">{selected.badge}</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border border-dashed border-primary/20"
                  />
                </div>
              </div>

              <div className="relative z-10 text-center mb-8">
                <div className="font-mono text-xs text-muted-foreground tracking-[0.25em] uppercase mb-2">
                  {selected.standard}
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-2">
                  {selected.title}
                </h2>
                <p className="text-sm text-muted-foreground">{selected.body}</p>
              </div>

              <div className="relative z-10 bg-muted/20 border border-border/30 rounded-2xl p-6 mb-6">
                <p className="text-foreground/80 leading-relaxed text-sm">{selected.note}</p>
              </div>

              <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>Active since {selected.since}</span>
                </div>
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-primary font-bold uppercase tracking-widest">
                  {selected.highlight}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
