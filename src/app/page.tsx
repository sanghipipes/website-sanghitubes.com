'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Factory, Award, CheckCircle2,
  Layers, Droplets, Gauge, Wrench, Waves, Zap, TrendingUp, Settings,
} from 'lucide-react';
import { products } from '@/data/products';
import { FadeIn } from '@/components/ui/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerContainer';
import { PipeShowcase3D } from '@/components/ui/PipeShowcase3D';
import { InteractiveProductModel } from '@/components/ui/InteractiveProductModel';
import { TrustedBrandsMarquee } from '@/components/ui/TrustedBrandsMarquee';

// Clientele preview on homepage — subset of /clients allClients (kept in sync)
const homepageClients = [
  { abbr: 'SP',    name: 'Shapoorji Pallonji & Co.', sector: 'EPC & Infrastructure', color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
  { abbr: 'NCC',   name: 'NCC Limited',              sector: 'EPC & Infrastructure', color: 'text-cyan-400',    bg: 'bg-cyan-500/10'    },
  { abbr: 'GVPR',  name: 'GVPR Engineers Ltd',       sector: 'EPC & Infrastructure', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { abbr: 'ATC',   name: 'ATC Projects Pvt Ltd',     sector: 'EPC & Infrastructure', color: 'text-indigo-400',  bg: 'bg-indigo-500/10'  },
  { abbr: 'EMS',   name: 'EMS Limited',              sector: 'EPC & Infrastructure', color: 'text-teal-400',    bg: 'bg-teal-500/10'    },
  { abbr: 'BKC',   name: 'B.K. Construction & Co.',  sector: 'Construction',         color: 'text-purple-400',  bg: 'bg-purple-500/10'  },
  { abbr: 'KRAM',  name: 'Kram Infracon Pvt Ltd',    sector: 'Construction',         color: 'text-rose-400',    bg: 'bg-rose-500/10'    },
  { abbr: 'RKE',   name: 'RK Engineers Pvt Ltd',     sector: 'Construction',         color: 'text-red-400',     bg: 'bg-red-500/10'     },
  { abbr: 'RWT',   name: 'Rean Watertech Pvt Ltd',   sector: 'Construction',         color: 'text-cyan-300',    bg: 'bg-cyan-400/10'    },
  { abbr: 'BNKO',  name: 'Banko Construction',       sector: 'Construction',         color: 'text-orange-300',  bg: 'bg-orange-400/10'  },
];

// Category cards — distinct images per category
const categoryCards = [
  {
    name: 'DI Pipes',
    image: '/categories/di-pipes.png',
    desc: 'Ductile Iron Double Flange & S&S Pipes',
  },
  {
    name: 'CI Pipes',
    image: '/categories/ci-pipes.png',
    desc: 'Centrifugally Cast Grey Iron Pipes',
  },
  {
    name: 'Valves & Specials',
    image: '/categories/valves-specials.png',
    desc: 'Sluice, Butterfly & Air Valves',
  },
];

// Why Choose Us cards
const whyChooseCards = [
  {
    icon: Factory,
    title: '20+ Years DF Manufacturing',
    desc: 'Industry-leading expertise in Flanging of centrifugally casted ductile iron/ cast iron pipes - precision engineered to IS:8329.',
  },
  {
    icon: ShieldCheck,
    title: 'BIS & ISO Certified',
    desc: 'Bureau of Indian Standards licensed. ISO 9001:2015 certified. Every product meets the strictest quality benchmarks.',
  },
  {
    icon: Award,
    title: 'Government Approved',
    desc: 'Trusted by Indian Government departments and municipal water authorities for critical infrastructure projects.',
  },
  {
    icon: Settings,
    title: 'Modern Facility',
    desc: 'State-of-the-art Flanging facility in Kanpur, equipped for precision manufacturing at scale.',
  },
  {
    icon: Zap,
    title: 'OPVC Innovation',
    desc: 'Pioneering next-generation pipe technology. OPVC pressure pipes — launching 2026 for India\'s water networks.',
  },
  {
    icon: TrendingUp,
    title: '50+ Years Industry Legacy',
    desc: 'Decades of accumulated knowledge, trusted relationships, and manufacturing heritage behind every product we deliver.',
  },
];

export default function Home() {

  return (
    <div className="bg-background">
      {/* 3D Hero Section */}
      <Suspense
        fallback={
          <div className="h-[450vh] w-full bg-background relative">
            <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(59,130,246,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.055)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
              <div className="absolute inset-0 flex items-center justify-center px-8">
                <div className="text-center relative z-10">
                  <span className="text-primary font-black tracking-[1em] uppercase text-xs md:text-sm mb-4 block">
                    Precision // Resilience // Quality
                  </span>
                  <h1 className="text-[3rem] md:text-[6rem] font-black text-white tracking-[-0.05em] uppercase italic leading-[0.85]">
                    SANGHI TUBES
                    <br />
                    <span className="stroke-text text-transparent not-italic block mt-2">
                      PRIVATE LIMITED
                    </span>
                  </h1>
                  <div className="flex items-center justify-center gap-8 mt-5">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                    <p className="text-sm text-slate-400 font-light tracking-[0.5em] uppercase">Double Flanged Pipes &amp; OPVC Pipes</p>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                  </div>
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <PipeShowcase3D />
      </Suspense>

      {/* Stats Banner */}
      <section className="relative z-30 bg-background">
        <div className="max-w-6xl mx-auto px-4 -mt-32 pb-20">
          <StaggerContainer
            className="py-16 bg-primary text-primary-foreground rounded-[3rem] shadow-[0_0_100px_rgba(59,130,246,0.3)] overflow-hidden relative"
            staggerChildren={0.15}
          >
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 md:gap-12 relative z-10 px-5 sm:px-8 md:px-12">
              {[
                { label: 'Years Experience', value: '50+' },
                { label: 'Products In Range', value: '500+' },
                { label: 'Clients Globally', value: '1200+' },
                { label: 'Quality Standards', value: 'BIS/ISO' },
              ].map((stat, i) => (
                <StaggerItem key={i} className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 italic tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] opacity-80 font-black">{stat.label}</div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      <div className="bg-background text-foreground">

        {/* ── Why Choose Us ─────────────────────────────────────────────────────── */}
        <section className="py-32 max-w-7xl mx-auto px-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-primary to-transparent" />
          <FadeIn>
            <div className="text-center mb-20">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Manufacturing Authority</span>
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">
                Why Choose <span className="text-primary not-italic">Sanghi</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Five decades of industry knowledge. Twenty years of double flanged pipe manufacturing. One trusted name.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseCards.map((card, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -8, borderColor: 'rgba(59,130,246,0.4)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="group bg-card/60 border border-border/30 rounded-[2rem] p-8 h-full flex flex-col gap-5 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-4 bg-primary/10 border border-primary/20 rounded-2xl w-fit"
                  >
                    <card.icon className="text-primary" size={28} />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-black text-foreground mb-2 uppercase tracking-tight">{card.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ── Trusted Brands Marquee ────────────────────────────────────────────── */}
        <TrustedBrandsMarquee />

        {/* ── Flagship Products Callout ──────────────────────────────────────────── */}
        <section className="py-20 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/40 to-background pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Flagship Products</span>
                <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase italic">
                  Our Core <span className="text-primary not-italic">Expertise</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Industry-defining products built from decades of manufacturing precision.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* DI Double Flange Pipe */}
              <FadeIn direction="right">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                  className="group relative bg-card/70 border border-border/50 rounded-[2.5rem] overflow-hidden hover:border-primary/40 transition-colors duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* 3D model */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-muted to-background relative overflow-hidden">
                    <InteractiveProductModel type="flanged-pipe" color="#1a2535" metalness={0.95} roughness={0.28} />
                    <div className="absolute top-6 left-6">
                      <span className="bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                        20+ Years Manufacturing
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="text-[10px] font-black text-primary mb-2 uppercase tracking-[0.2em]">DI Pipes · IS:8329</div>
                    <h3 className="text-3xl font-black text-foreground uppercase italic tracking-tight mb-3">
                      Double Flanged Pipes
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Centrifugally cast Ductile Iron Double Flange Pipes — our core manufacturing
                      expertise. Precision-machined flanged ends for leak-proof seating in pump houses,
                      bridge crossings, and critical installations. K9 &amp; K12 pressure classes.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {[
                        { l: 'Size Range', v: 'DN 80–600' },
                        { l: 'Pressure', v: 'K9 / K12' },
                        { l: 'Lining', v: 'Bitumen / Epoxy' },
                      ].map((s) => (
                        <div key={s.l} className="text-center p-3 bg-muted/20 rounded-xl border border-border/30">
                          <div className="text-xs font-black text-foreground mb-1">{s.v}</div>
                          <div className="text-[9px] text-muted-foreground uppercase tracking-widest">{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/products?id=di-double-flange-pipe"
                      className="flex items-center gap-3 text-primary font-black uppercase text-xs tracking-widest hover:gap-5 transition-all"
                    >
                      View Product <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              </FadeIn>

              {/* OPVC Pipe */}
              <FadeIn direction="left">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                  className="group relative bg-card/70 border border-border/50 rounded-[2.5rem] overflow-hidden hover:border-blue-400/40 transition-colors duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* 3D model */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-muted to-background relative overflow-hidden">
                    <InteractiveProductModel type="opvc-pipe" color="#e2e8f0" metalness={0} roughness={0.55} />
                    {/* Launching badge */}
                    <div className="absolute top-6 left-6">
                      <motion.span
                        animate={{ opacity: [1, 0.6, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="bg-blue-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full flex items-center gap-2"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        Launching 2026
                      </motion.span>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-3xl font-black text-foreground uppercase italic tracking-tight mb-3">
                      OPVC Pipes
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Oriented PVC pressure pipes — superior strength-to-weight ratio versus
                      conventional uPVC, with rubber ring push-fit joints for fast installation.
                      India&apos;s next-generation water distribution solution, backed by Sanghi&apos;s
                      manufacturing heritage.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {[
                        { l: 'Size Range', v: 'DN 110–250' },
                        { l: 'Pressure', v: 'PN 12.5 / 16 / 20 / 25' },
                        { l: 'Joint', v: 'Push-fit RR' },
                      ].map((s) => (
                        <div key={s.l} className="text-center p-3 bg-muted/20 rounded-xl border border-border/30">
                          <div className="text-xs font-black text-foreground mb-1">{s.v}</div>
                          <div className="text-[9px] text-muted-foreground uppercase tracking-widest">{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/products?id=opvc-pipes-fittings"
                      className="flex items-center gap-3 text-blue-400 font-black uppercase text-xs tracking-widest hover:gap-5 transition-all"
                    >
                      Learn More <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Featured Categories ────────────────────────────────────────────────── */}
        <section className="py-32 max-w-7xl mx-auto px-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-primary to-transparent" />
          <FadeIn>
            <div className="text-center mb-20">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Product Categories</span>
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">
                Our <span className="text-primary not-italic">Full Range</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                End-to-end solutions for fluid transportation and industrial infrastructure — from pipe to valve.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {categoryCards.map((cat) => (
              <StaggerItem key={cat.name}>
                <motion.div
                  whileHover="hovered"
                  initial="idle"
                  className="group relative h-[500px] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl border border-border/30 hover:border-primary/20 transition-colors duration-500"
                >
                  <motion.div
                    variants={{ idle: { opacity: 0.4 }, hovered: { opacity: 0.15 } }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-muted z-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
                  <motion.div
                    variants={{ idle: { scale: 1 }, hovered: { scale: 1.1 } }}
                    transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </motion.div>
                  <div className="absolute bottom-0 left-0 p-8 z-30">
                    <motion.h3
                      variants={{ idle: { y: 0 }, hovered: { y: -4 } }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-bold text-foreground mb-1"
                    >
                      {cat.name}
                    </motion.h3>
                    <p className="text-muted-foreground text-sm mb-3">{cat.desc}</p>
                    <Link
                      href={`/products?cat=${cat.name}`}
                      className="text-primary font-semibold flex items-center gap-2 text-sm"
                    >
                      View Range
                      <motion.div
                        variants={{ idle: { x: 0 }, hovered: { x: 5 } }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        <ArrowRight size={18} />
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ── Esteemed Clientele Preview ────────────────────────────────────────── */}
        <section className="py-32 max-w-7xl mx-auto px-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-primary to-transparent" />
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Industry Trust</span>
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">
                Our Esteemed <span className="text-primary not-italic">Clientele</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Trusted by India&apos;s most critical water authorities, infrastructure firms, and government bodies.
              </p>
            </div>
          </FadeIn>

          <div className="relative">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {homepageClients.map((client, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ y: -5, borderColor: 'rgba(59,130,246,0.35)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="group bg-card/60 border border-border/30 rounded-2xl p-5 flex flex-col items-center text-center gap-4"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${client.bg} border border-border/20 flex items-center justify-center`}>
                      <span className={`text-[9px] font-black uppercase tracking-tight ${client.color} leading-tight text-center px-0.5`}>
                        {client.abbr}
                      </span>
                    </div>
                    <div>
                      <p className="text-foreground font-bold text-sm leading-tight mb-1">{client.name}</p>
                      <p className="text-muted-foreground text-xs">{client.sector}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            {/* Bottom fade to hint at "more" */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          </div>

          <div className="text-center mt-12">
            <Link
              href="/clients"
              className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-primary/20"
            >
              View All Clients <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ── Trust Section ──────────────────────────────────────────────────────── */}
        <section className="py-32 bg-muted/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
            <FadeIn direction="right">
              <div>
                <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-6 block">Legacy of Excellence</span>
                <h2 className="text-5xl font-black mb-8 italic tracking-tighter uppercase leading-[0.9]">
                  Built on <span className="text-primary not-italic">Trust</span> and Quality
                </h2>
                <p className="text-muted-foreground mb-12 leading-relaxed text-xl font-medium">
                  Sanghi Pipes &amp; Tubes has received the prestigious Licence from the Bureau of
                  Indian Standards. We are recognised as one of India&apos;s most reliable manufacturers
                  of Centrifugally Cast D.I. / C.I. Double Flange Pipes — now expanding into OPVC
                  with the same commitment to engineering precision.
                </p>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { icon: <ShieldCheck className="text-primary" size={32} />, title: 'Certified Quality', desc: 'BIS and ISO certified products' },
                    { icon: <Factory className="text-primary" size={32} />, title: 'Modern Facility', desc: 'State-of-the-art centrifugal casting' },
                    { icon: <Award className="text-primary" size={32} />, title: 'Industry Leader', desc: '50+ years of industry presence' },
                    { icon: <CheckCircle2 className="text-primary" size={32} />, title: 'Govt. Approved', desc: 'Trusted by Indian Govt. departments' },
                  ].map((feature, i) => (
                    <StaggerItem key={i} className="flex gap-6 group">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-4 bg-background rounded-2xl shadow-xl border border-border/30 h-fit group-hover:border-primary/50 transition-colors"
                      >
                        {feature.icon}
                      </motion.div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground font-medium">{feature.desc}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </FadeIn>

            <FadeIn direction="left" className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-3xl" />
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80"
                  alt="Sanghi Pipes & Tubes manufacturing facility"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </FadeIn>
          </div>
        </section>

        {/* ── Catalog Scroll Showcase ────────────────────────────────────────────── */}
        <section className="py-32 bg-background overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="text-primary font-bold tracking-[0.3em] uppercase text-xs block"
              >
                6 Categories · 18 Products
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="text-5xl md:text-7xl font-black text-foreground italic tracking-tighter uppercase leading-[0.85]"
              >
                500+ Parts. <br />
                <span className="text-primary not-italic">One Trusted</span> <br />
                Source.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="text-muted-foreground text-lg mt-2 max-w-2xl mx-auto leading-relaxed"
              >
                Supplying water utilities, municipalities, and infrastructure contractors across India.
                BIS-licensed pipes, fittings, and precision valves — ISO 9001 certified,
                every batch tested, and ready for dispatch.
              </motion.p>
            </div>
            <div className="border border-border/30 rounded-[2rem] bg-card p-4 md:p-6 flex flex-col gap-3 md:gap-4">

              {/* Chrome bar */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center justify-between shrink-0"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="text-muted-foreground text-[10px] font-mono ml-3 hidden md:block">
                    sanghi-industries.com · Est. 1975 · BIS Licensed Manufacturer
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 bg-primary/15 text-primary text-[9px] font-black rounded-full uppercase tracking-widest border border-primary/20">
                    BIS Licensed
                  </span>
                  <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[9px] font-black rounded-full uppercase tracking-widest border border-green-500/20">
                    ISO 9001:2015
                  </span>
                </div>
              </motion.div>

              {/* Category cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 flex-1 min-h-0">
                {[
                  {
                    Icon: Layers,
                    cat: 'DI Pipes',
                    spec: 'DN 80–1200 mm',
                    isStd: 'IS 8329',
                    gradient: 'from-blue-500/8 to-transparent',
                    accent: 'text-blue-400',
                    accentBg: 'bg-blue-400/10',
                    accentGlow: 'rgba(59,130,246,0.35)',
                    items: ['D.I. Double Flange Pipe', 'D.I. Spun Pipe (S&S)'],
                  },
                  {
                    Icon: Droplets,
                    cat: 'CI Pipes',
                    spec: 'DN 80–600 mm',
                    isStd: 'IS 1536',
                    gradient: 'from-slate-500/8 to-transparent',
                    accent: 'text-slate-300',
                    accentBg: 'bg-slate-300/10',
                    accentGlow: 'rgba(203,213,225,0.3)',
                    items: ['C.I. Double Flange Pipe', 'C.I. Spun Pipe (S&S)'],
                  },
                  {
                    Icon: Gauge,
                    cat: 'Valves',
                    spec: 'DN 50–1200 mm',
                    isStd: 'IS 14846',
                    gradient: 'from-violet-500/8 to-transparent',
                    accent: 'text-violet-400',
                    accentBg: 'bg-violet-400/10',
                    accentGlow: 'rgba(167,139,250,0.4)',
                    items: ['Sluice Valve', 'Air Valve', 'Butterfly Valve', 'Non-Return Valve'],
                  },
                  {
                    Icon: Wrench,
                    cat: 'CI/DI Specials',
                    spec: 'DN 80–1200 mm',
                    isStd: 'IS 9523',
                    gradient: 'from-indigo-500/8 to-transparent',
                    accent: 'text-indigo-400',
                    accentBg: 'bg-indigo-400/10',
                    accentGlow: 'rgba(129,140,248,0.4)',
                    items: ['Bends (11°–90°)', 'Tees & Reducers', 'Flanged Adaptors', 'Dismantling Joints', 'M.J. Collar'],
                  },
                  {
                    Icon: Waves,
                    cat: 'OPVC & HDPE',
                    spec: 'DN 20–630 mm',
                    isStd: 'IS 16647 / IS 4984',
                    gradient: 'from-emerald-500/8 to-transparent',
                    accent: 'text-emerald-400',
                    accentBg: 'bg-emerald-400/10',
                    accentGlow: 'rgba(52,211,153,0.4)',
                    items: ['HDPE Pipes & Specials', 'Electrofusion Fittings', 'DWC Pipes', 'OPVC Pipes', 'OPVC Specials'],
                  },
                  {
                    Icon: Factory,
                    cat: 'Others',
                    spec: 'NB 15–1600 mm',
                    isStd: 'IS 1879 / IS 1239',
                    gradient: 'from-orange-500/8 to-transparent',
                    accent: 'text-orange-400',
                    accentBg: 'bg-orange-400/10',
                    accentGlow: 'rgba(251,146,60,0.4)',
                    items: ['M.S. Pipes & Specials', 'G.I. Pipes & Specials', 'TMT Bars', 'MS Bolts', 'G.I. Bolts'],
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                    whileHover={{ scale: 1.02, borderColor: item.accentGlow }}
                    className={`rounded-xl bg-gradient-to-br ${item.gradient}
                                border border-border/30 flex flex-col
                                transition-colors cursor-default overflow-hidden relative`}
                  >
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-primary/5 pointer-events-none" />

                    {/* Header */}
                    <div className="relative z-10 p-2.5 md:p-3 flex items-start justify-between gap-1 border-b border-border/20">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className={`p-1 rounded-md ${item.accentBg} shrink-0`}>
                          <item.Icon size={10} className={item.accent} />
                        </div>
                        <h4 className="text-foreground font-bold text-[10px] md:text-xs leading-tight truncate">
                          {item.cat}
                        </h4>
                      </div>
                      <span className={`text-[8px] font-black shrink-0 ${item.accent} bg-transparent border ${item.accentBg.replace('bg-', 'border-').replace('/10', '/30')} rounded px-1 py-0.5`}>
                        {item.items.length}
                      </span>
                    </div>

                    {/* Sub-products */}
                    <div className="relative z-10 flex-1 p-2.5 md:p-3 flex flex-wrap gap-1 content-start">
                      {item.items.map((name) => (
                        <span
                          key={name}
                          className="text-[7px] md:text-[8px] bg-muted/40 border border-border/30 rounded px-1.5 py-0.5 text-muted-foreground leading-tight"
                        >
                          {name}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 p-2.5 md:p-3 border-t border-border/20 flex items-center justify-between">
                      <span className="text-[8px] md:text-[9px] text-muted-foreground font-mono">{item.spec}</span>
                      <span className="text-[7px] md:text-[8px] font-mono text-primary/70 border border-primary/20 rounded px-1">{item.isStd}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 shrink-0">
                {[
                  { label: 'Experience', value: '50+ Years' },
                  { label: 'Products', value: '500+' },
                  { label: 'Clients', value: '1,200+' },
                  { label: 'Certified', value: 'BIS/ISO' },
                  { label: 'Lead Time', value: '7–14 Days' },
                  { label: 'Working Days', value: 'Mon–Sat' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.045, duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="bg-muted/20 border border-border/20 rounded-xl p-2 md:p-3 text-center"
                  >
                    <div className="text-foreground font-black text-xs md:text-sm">{stat.value}</div>
                    <div className="text-muted-foreground text-[8px] md:text-[9px] uppercase tracking-widest mt-0.5">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── CTA Section ────────────────────────────────────────────────────────── */}
        <section className="py-24 px-4">
          <FadeIn>
            <motion.div
              whileHover="hovered"
              initial="idle"
              className="max-w-7xl mx-auto bg-card rounded-[2rem] p-12 md:p-20 relative overflow-hidden text-center md:text-left border border-border/30 hover:border-primary/20 transition-colors duration-500"
            >
              <motion.div
                variants={{
                  idle: { opacity: 0.6, scale: 1 },
                  hovered: { opacity: 1, scale: 1.3 },
                }}
                transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[120px] pointer-events-none"
              />
              <motion.div
                variants={{
                  idle: { opacity: 0 },
                  hovered: { opacity: 0.4 },
                }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-secondary/15 blur-[100px] pointer-events-none"
              />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  Ready to start your next <br /> infrastructure project?
                </h2>
                <p className="text-muted-foreground text-lg mb-10 max-w-xl">
                  Get in touch with our technical experts for customised solutions and competitive pricing on
                  DI Double Flange Pipes, OPVC Pipes, and the full Sanghi range.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <motion.div
                    whileHover={{ scale: 1.06, boxShadow: '0 16px 40px -8px rgba(249,115,22,0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Link
                      href="/contact"
                      className="bg-secondary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-secondary/20 block"
                    >
                      Get a Quote
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.06, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <a
                      href="tel:+917971549587"
                      className="bg-muted/50 backdrop-blur-md text-foreground border border-border px-8 py-4 rounded-xl font-bold text-lg block"
                    >
                      Call Us
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </section>
      </div>
    </div>
  );
}
