'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Package } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-6 block">
            Error 404
          </span>

          <h1 className="text-[10rem] font-black leading-none tracking-tighter text-white/5 select-none">
            404
          </h1>

          <div className="-mt-12 mb-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Page Not Found
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-colors"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-colors border border-white/5"
            >
              <Package size={18} />
              View Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
