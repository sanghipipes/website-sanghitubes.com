'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, HardHat, Wrench, LayoutGrid, MapPin, Package } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerContainer';

interface Client {
  abbr: string;
  name: string;
  sub: string;
  sector: string;
  color: string;
  bg: string;
}

interface FeaturedProject {
  client: string;
  project: string;
  location: string;
  spec: string;
  abbr: string;
  sector: string;
  accentFrom: string;
  accentColor: string;
}

const allClients: Client[] = [
  // EPC & Infrastructure
  { abbr: 'SP',    name: 'Shapoorji Pallonji & Co.',        sub: 'EPC Conglomerate',  sector: 'EPC & Infrastructure', color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
  { abbr: 'NCC',   name: 'NCC Limited',                     sub: 'Infrastructure',    sector: 'EPC & Infrastructure', color: 'text-cyan-400',    bg: 'bg-cyan-500/10'    },
  { abbr: 'ATC',   name: 'ATC Projects Pvt Ltd',            sub: 'Project Contractor',sector: 'EPC & Infrastructure', color: 'text-indigo-400',  bg: 'bg-indigo-500/10'  },
  { abbr: 'EIL',   name: 'Eagle Infra India Ltd',           sub: 'Infrastructure',    sector: 'EPC & Infrastructure', color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
  { abbr: 'GVPR',  name: 'GVPR Engineers Limited',          sub: 'Engineering & EPC', sector: 'EPC & Infrastructure', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { abbr: 'EMS',   name: 'EMS Limited',                     sub: 'Engineering',       sector: 'EPC & Infrastructure', color: 'text-teal-400',    bg: 'bg-teal-500/10'    },
  { abbr: 'ERCON', name: 'Ercon Composites',                sub: 'Composites & Infra',sector: 'EPC & Infrastructure', color: 'text-sky-400',     bg: 'bg-sky-500/10'     },
  { abbr: 'OPGC',  name: 'OPGCPL',                          sub: 'Power & Infrastructure',sector: 'EPC & Infrastructure', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  // Construction
  { abbr: 'BKC',   name: 'B.K. Construction & Co.',         sub: 'Construction',      sector: 'Construction',         color: 'text-purple-400',  bg: 'bg-purple-500/10'  },
  { abbr: 'KRAM',  name: 'Kram Infracon Pvt Ltd',           sub: 'Infracon',          sector: 'Construction',         color: 'text-rose-400',    bg: 'bg-rose-500/10'    },
  { abbr: 'CRBN',  name: 'Carbyne Infra Pvt Ltd',           sub: 'Infrastructure',    sector: 'Construction',         color: 'text-violet-400',  bg: 'bg-violet-500/10'  },
  { abbr: 'HMS',   name: 'HMS Pvt Ltd',                     sub: 'Construction',      sector: 'Construction',         color: 'text-pink-400',    bg: 'bg-pink-500/10'    },
  { abbr: 'PDAS',  name: 'P. Das Infrastructure Pvt Ltd',   sub: 'Infrastructure',    sector: 'Construction',         color: 'text-lime-400',    bg: 'bg-lime-500/10'    },
  { abbr: 'SDKR',  name: 'Sudhakara Infratech Pvt Ltd',     sub: 'Infratech',         sector: 'Construction',         color: 'text-green-400',   bg: 'bg-green-500/10'   },
  { abbr: 'SKMR',  name: 'SKMR',                            sub: 'Construction',      sector: 'Construction',         color: 'text-yellow-400',  bg: 'bg-yellow-500/10'  },
  { abbr: 'RKE',   name: 'RK Engineers Pvt Ltd',            sub: 'Engineering',       sector: 'Construction',         color: 'text-red-400',     bg: 'bg-red-500/10'     },
  { abbr: 'RWT',   name: 'Rean Watertech Pvt Ltd',          sub: 'Water Technology',  sector: 'Construction',         color: 'text-cyan-300',    bg: 'bg-cyan-400/10'    },
  { abbr: 'NPSS',  name: 'NPSS Const Pvt Ltd',              sub: 'Construction',      sector: 'Construction',         color: 'text-blue-300',    bg: 'bg-blue-400/10'    },
  { abbr: 'BNKO',  name: 'Banko Construction Pvt Ltd',      sub: 'Construction',      sector: 'Construction',         color: 'text-orange-300',  bg: 'bg-orange-400/10'  },
];

const featuredProjects: FeaturedProject[] = [
  {
    client: 'Shapoorji Pallonji & Co.',
    project: 'Water Transmission Main & Pump House Works',
    location: 'Uttar Pradesh',
    spec: 'DI Double Flange Pipes · DN 300–800 · K9 Pressure Class',
    abbr: 'SP',
    sector: 'EPC & Infrastructure',
    accentFrom: 'from-blue-500/8',
    accentColor: 'text-blue-400',
  },
  {
    client: 'NCC Limited',
    project: 'Water Supply Pipeline Laying Project',
    location: 'Multiple States, India',
    spec: 'DI Spun Pipes (S&S) · DN 150–600 · K9 / K12',
    abbr: 'NCC',
    sector: 'EPC & Infrastructure',
    accentFrom: 'from-cyan-500/8',
    accentColor: 'text-cyan-400',
  },
  {
    client: 'GVPR Engineers Limited',
    project: 'Rural Water Distribution Infrastructure',
    location: 'Central & North India',
    spec: 'DI Double Flange Pipes · DN 80–400 · K9',
    abbr: 'GVPR',
    sector: 'EPC & Infrastructure',
    accentFrom: 'from-emerald-500/8',
    accentColor: 'text-emerald-400',
  },
];

const tabs = [
  { label: 'All',                  icon: LayoutGrid },
  { label: 'EPC & Infrastructure', icon: HardHat    },
  { label: 'Construction',         icon: Wrench     },
];

const sectorStats = [
  { value: '19+',  label: 'Key Contractors'   },
  { value: '15+',  label: 'States Served'     },
  { value: '200+', label: 'Projects Delivered'},
  { value: '50+',  label: 'Years of Service'  },
];

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All'
    ? allClients
    : allClients.filter((c) => c.sector === activeTab);

  return (
    <div className="bg-background min-h-screen text-foreground">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="pt-40 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn>
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-5 block">
              Our Clientele
            </span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] mb-6">
              Our Esteemed <span className="text-primary not-italic">Clientele</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Trusted by India&apos;s most critical water authorities, infrastructure firms, and
              government bodies for over five decades.
            </p>
          </FadeIn>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {sectorStats.map((s, i) => (
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

      {/* ── Featured Projects ──────────────────────────────────────────────────── */}
      <section className="pb-24 max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <Package size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold mb-0.5">
                Highlight Projects
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Featured Client Projects</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-border/40 to-transparent ml-4" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((fp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
              whileHover={{ y: -6 }}
              className={`relative bg-gradient-to-br ${fp.accentFrom} to-card/80 border border-border/30 rounded-[2rem] p-7 overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/[0.02] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="flex items-start justify-between mb-6">
                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-muted/20 border border-border/20 ${fp.accentColor}`}>
                  {fp.abbr}
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{fp.sector}</span>
              </div>

              <h3 className="text-lg font-black text-foreground uppercase tracking-tight leading-tight mb-2">
                {fp.client}
              </h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{fp.project}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin size={12} className={fp.accentColor} />
                  <span>{fp.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Package size={12} className={fp.accentColor} />
                  <span>{fp.spec}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── All Clients ───────────────────────────────────────────────────────── */}
      <section className="pb-32 max-w-7xl mx-auto px-6">

        {/* Tab bar */}
        <FadeIn>
          <div className="flex flex-wrap gap-2 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                  activeTab === tab.label
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-card/60 border border-border/30 text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Client grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((client) => (
                <StaggerItem key={`${client.abbr}-${client.sub}`}>
                  <motion.div
                    whileHover={{ y: -5, borderColor: 'rgba(59,130,246,0.35)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="group bg-card/60 border border-border/30 rounded-2xl p-5 flex flex-col items-center text-center gap-4 cursor-default"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${client.bg} border border-border/20 flex items-center justify-center`}
                    >
                      <span className={`text-[10px] font-black uppercase tracking-tight ${client.color} leading-tight text-center px-0.5`}>
                        {client.abbr}
                      </span>
                    </div>
                    <div>
                      <p className="text-foreground font-bold text-sm leading-tight mb-1">{client.name}</p>
                      <p className="text-muted-foreground text-xs">{client.sub}</p>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${client.bg} ${client.color} border border-border/20`}>
                      {client.sector}
                    </span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </motion.div>
        </AnimatePresence>

        {/* Footer CTA */}
        <FadeIn>
          <div className="mt-20 text-center bg-muted/20 border border-border/30 rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-primary/10 blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                Join Our Clientele
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">
                Ready to Partner <span className="text-primary not-italic">With Us?</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Get in touch with our technical team for project specifications, pricing, and delivery timelines.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/contact"
                  className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                >
                  Get a Quote <ArrowRight size={16} />
                </Link>
                <Link
                  href="/products"
                  className="flex items-center gap-3 bg-muted/20 border border-border/30 text-foreground px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-muted/40 transition-colors"
                >
                  View Products <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
