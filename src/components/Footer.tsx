'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from './ui/Logo';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const colVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
  },
};

const quickLinks = [
  { label: 'Home',          href: '/'             },
  { label: 'About Us',      href: '/about'         },
  { label: 'Our Products',  href: '/products'      },
  { label: 'Certificates',  href: '/certificates'  },
  { label: 'Our Clients',   href: '/clients'       },
  { label: 'Request Quote', href: '/quote'         },
  { label: 'Contact Us',    href: '/contact'       },
];

const productLinks = [
  { label: 'DI Double Flange Pipes', href: '/products?cat=DI Pipes' },
  { label: 'Cast Iron Pipes', href: '/products?cat=CI Pipes' },
  { label: 'DI Specials & Fittings', href: '/products?cat=DI Specials' },
  { label: 'Industrial Valves', href: '/products?cat=Valves' },
];

const contactItems = [
  {
    icon: <MapPin size={18} className="text-primary shrink-0 mt-1" />,
    text: 'B No 79/8, Latouche Road, Kanpur - 208002, Uttar Pradesh, India',
  },
  { icon: <Phone size={18} className="text-primary shrink-0" />, text: '+91 7971549587' },
  { icon: <Mail size={18} className="text-primary shrink-0" />, text: 'info@sanghitubes.com' },
];

export const Footer = () => {
  return (
    <footer className="bg-background text-foreground/80 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.05 },
          },
        }}
        className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
      >
        {/* Brand Column */}
        <motion.div variants={colVariants} className="space-y-6">
          <Logo />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sanghi Pipes &amp; Tubes is a manufacturer of Centrifugally Cast Ductile Iron Double Flange
            Pipes and OPVC Pipes. BIS Licensed. Serving India&apos;s infrastructure with 50+ years of
            industry expertise.
          </p>
          <div className="flex gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.2, rotate: 8, backgroundColor: 'rgb(59 130 246)' }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="p-2 bg-muted rounded-full"
            >
              <Globe size={18} />
            </motion.a>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={colVariants}>
          <h4 className="text-foreground font-bold mb-6 text-lg">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </motion.div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Product Categories */}
        <motion.div variants={colVariants}>
          <h4 className="text-foreground font-bold mb-6 text-lg">Product Categories</h4>
          <ul className="space-y-4 text-sm">
            {productLinks.map((link) => (
              <li key={link.href}>
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </motion.div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div variants={colVariants}>
          <h4 className="text-foreground font-bold mb-6 text-lg">Contact Info</h4>
          <ul className="space-y-4 text-sm">
            {contactItems.map((item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3"
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                {item.icon}
                <span>{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="border-t border-border py-8 text-center text-xs text-muted-foreground"
      >
        <p>© {new Date().getFullYear()} Sanghi Pipes &amp; Tubes. All Rights Reserved.</p>
      </motion.div>
    </footer>
  );
};
