'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, CheckCircle2, Factory, Zap } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerContainer';

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <FadeIn>
          <div className="max-w-3xl mb-6">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
            >
              Our Story
            </motion.span>
            <h1 className="text-5xl font-bold mb-8">
              50+ Years of Manufacturing Excellence.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Sanghi Pipes &amp; Tubes, based in Kanpur, Uttar Pradesh, is a specialist manufacturer
              of Centrifugally Cast D.I. / C.I. Double Flange Pipes — and an emerging producer of
              OPVC pressure pipes for India&apos;s next generation of water infrastructure.
            </p>
          </div>
        </FadeIn>

        {/* Animated divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
          style={{ originX: 0 }}
          className="h-px bg-gradient-to-r from-primary via-primary/40 to-transparent mb-20"
        />

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <FadeIn direction="right">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-3xl" />
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                className="relative overflow-hidden rounded-[2rem] shadow-2xl"
              >
                <motion.img
                  initial={{ scale: 1.08 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                  src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&q=80"
                  alt="Our Facility"
                  className="w-full"
                />
              </motion.div>
            </div>
          </FadeIn>

          <FadeIn direction="left">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  With over 20 years of focused expertise in Flanging, we manufacture
                  D.I. / C.I. Double Flange Pipes to IS:8329 at our dedicated facility
                  in Kanpur. Every pipe is precision-machined for leak-proof flanged seating, built
                  for pump houses, bridge crossings, and critical water infrastructure.
                </p>
                <p>
                  As a recipient of the prestigious Licence from the Bureau of Indian Standards,
                  we are recognised as one of India&apos;s most reliable manufacturers of Centrifugally
                  Cast D.I. / C.I. Double Flange Pipes. In 2026, we are expanding our capabilities with the
                  launch of OPVC (Oriented PVC) pressure pipes — combining our legacy of manufacturing
                  precision with next-generation pipe technology.
                </p>
                <StaggerContainer className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    'Bureau of Indian Standards (BIS) Licensed',
                    'ISO 9001:2015 Certified',
                    'Govt. Approved Supplier',
                    'OPVC Pipes — Launching 2026',
                  ].map((cert) => (
                    <StaggerItem key={cert}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                        className="flex items-center gap-3 text-foreground font-bold"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                          <CheckCircle2 className="text-primary" size={20} />
                        </motion.div>
                        <span>{cert}</span>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Values */}
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
              What We Stand For
            </span>
            <h2 className="text-4xl font-bold">Our Core Values</h2>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            {
              icon: <Factory className="text-primary" size={40} />,
              title: '20+ Years DI Manufacturing',
              desc: 'Two decades of Manufacturing expertise. Our Double Flanged Pipes set the standard for precision and reliability in India.',
            },
            {
              icon: <Target className="text-primary" size={40} />,
              title: 'Our Mission',
              desc: 'To build India\'s infrastructure with precision-engineered pipes that outlast generations — combining legacy expertise with modern technology.',
            },
            {
              icon: <Shield className="text-primary" size={40} />,
              title: 'Uncompromising Quality',
              desc: 'BIS Licensed and ISO 9001:2015 certified. Every pipe is tested from raw material through final inspection before it leaves our facility.',
            },
            {
              icon: <Zap className="text-primary" size={40} />,
              title: 'OPVC Innovation',
              desc: 'Launching in 2026 — Oriented PVC pressure pipes offering superior strength-to-weight ratio for next-generation water distribution networks.',
            },
          ].map((v, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -10, boxShadow: '0 24px 60px -12px rgba(0,0,0,0.2)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="p-10 bg-card border border-border rounded-3xl h-full shadow-sm transition-colors hover:border-primary/30"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="mb-6 inline-block"
                >
                  {v.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
