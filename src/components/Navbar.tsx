'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Phone } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useQuote } from '@/context/QuoteContext';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

const navLinks = [
  { name: 'Home',         href: '/'             },
  { name: 'About',        href: '/about'         },
  { name: 'Products',     href: '/products'      },
  { name: 'Certificates', href: '/certificates'  },
  { name: 'Clients',      href: '/clients'       },
  { name: 'Contact',      href: '/contact'       },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useQuote();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 py-4",
        scrolled
          ? "bg-background/90 backdrop-blur-2xl border-b border-border/30 py-3"
          : pathname === '/'
            ? "bg-transparent text-white"
            : "bg-background/50 backdrop-blur-md border-b border-border/30"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.div key={link.name} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link
                href={link.href}
                className={cn(
                  "text-xs font-black uppercase tracking-[0.2em] transition-all",
                  pathname === link.href
                    ? "text-primary"
                    : scrolled || pathname !== '/'
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-white/60 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <ThemeToggle />
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              href="/quote"
              className={cn(
                "relative p-2 transition-colors",
                scrolled || pathname !== '/'
                  ? "text-muted-foreground hover:text-primary"
                  : "text-white/60 hover:text-white"
              )}
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </motion.div>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="tel:+919839030844"
            className="flex items-center gap-3 bg-foreground text-background px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/20"
          >
            <Phone size={14} />
            <span>Call Us</span>
          </motion.a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <Link href="/quote" className="relative p-2 text-foreground/80">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="text-foreground">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="md:hidden bg-background border-t border-border mt-3 overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.07, delayChildren: 0.1 },
                },
              }}
              className="flex flex-col p-4 gap-4"
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.name}
                  variants={{
                    hidden: { opacity: 0, x: -18, filter: 'blur(4px)' },
                    show: {
                      opacity: 1,
                      x: 0,
                      filter: 'blur(0px)',
                      transition: { duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] },
                    },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-semibold block",
                      pathname === link.href ? "text-primary" : "text-foreground/80"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -18, filter: 'blur(4px)' },
                  show: {
                    opacity: 1,
                    x: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] },
                  },
                }}
              >
                <a
                  href="tel:+919839030844"
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-bold"
                >
                  <Phone size={18} />
                  Call Us Now
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
