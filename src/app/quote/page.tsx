'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowLeft, Send, CheckCircle2, ShoppingBag, AlertCircle } from 'lucide-react';
import { useQuote } from '@/context/QuoteContext';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/ui/FadeIn';
import { TurnstileWidget } from '@/components/ui/TurnstileWidget';
import { submitQuoteAction } from '@/actions/quote';

export default function QuotePage() {
  const { items, removeItem, updateQuantity, clearCart, itemCount } = useQuote();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState('');
  const turnstileTokenRef = useRef('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!turnstileTokenRef.current && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setError('Please complete the CAPTCHA verification.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitQuoteAction({
      customerName: formData.get('fullName')    as string,
      companyName:  formData.get('companyName') as string,
      email:        formData.get('email')       as string,
      phone:        formData.get('phone')       as string,
      message:      formData.get('message')     as string ?? '',
      items: items.map((item) => ({
        productId:   item.id,
        productName: item.name,
        quantity:    item.quantity,
      })),
      turnstileToken: turnstileTokenRef.current || 'dev-bypass',
    });

    setIsLoading(false);

    if (result.success) {
      setIsSubmitted(true);
      clearCart();
    } else {
      setError(result.error ?? 'Something went wrong. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-md bg-card border border-border p-12 rounded-3xl shadow-xl"
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 18 }}
            className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 size={48} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Quote Requested!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="text-muted-foreground mb-8"
          >
            Thank you for your interest. Our technical team will review your selection and contact you
            with a detailed estimate within 24 hours.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            <Link
              href="/products"
              className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform"
            >
              Browse More Products
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-md"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
            className="w-20 h-20 bg-muted text-muted-foreground/30 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <ShoppingBag size={40} />
          </motion.div>
          <h1 className="text-3xl font-bold mb-4">Your Quote List is Empty</h1>
          <p className="text-muted-foreground mb-8">
            You haven&apos;t added any products to your quote list yet. Browse our catalog to find
            solutions for your project.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/products"
              className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold"
            >
              Explore Products
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <FadeIn>
          <div className="flex items-center gap-4 mb-8">
            <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.9 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Link href="/products" className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                <ArrowLeft size={24} />
              </Link>
            </motion.div>
            <h1 className="text-4xl font-bold">Request a Quote</h1>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* List Section */}
          <FadeIn className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/30">
                <h2 className="font-bold flex items-center gap-2">
                  Selected Items{' '}
                  <span className="text-sm font-normal text-muted-foreground">({itemCount})</span>
                </h2>
              </div>
              <div className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: 24, filter: 'blur(4px)', transition: { duration: 0.25 } }}
                      transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="p-6 flex flex-col sm:flex-row sm:items-center gap-6"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="w-20 h-20 bg-muted rounded-xl shrink-0 flex items-center justify-center font-black text-2xl text-muted-foreground/20"
                      >
                        {item.name[0]}
                      </motion.div>
                      <div className="flex-grow">
                        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                          {item.category}
                        </div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-border rounded-lg bg-muted/30 p-1">
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-md transition-all font-bold"
                          >
                            -
                          </motion.button>
                          <span className="w-10 text-center font-bold">{item.quantity}</span>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-md transition-all font-bold"
                          >
                            +
                          </motion.button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.15, color: 'rgb(239 68 68)' }}
                          whileTap={{ scale: 0.85 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="p-6 bg-muted/30 border-t border-border">
                <motion.button
                  whileHover={{ color: 'rgb(239 68 68)' }}
                  onClick={clearCart}
                  className="text-sm font-bold text-muted-foreground transition-colors"
                >
                  Clear All Items
                </motion.button>
              </div>
            </div>
          </FadeIn>

          {/* Form Section */}
          <FadeIn delay={0.15}>
            <div className="bg-card border border-border p-8 rounded-3xl shadow-lg sticky top-32">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Full Name',     name: 'fullName',    type: 'text',  placeholder: 'John Doe' },
                  { label: 'Company Name',  name: 'companyName', type: 'text',  placeholder: 'Acme Construction' },
                  { label: 'Email Address', name: 'email',       type: 'email', placeholder: 'john@company.com' },
                  { label: 'Phone Number',  name: 'phone',       type: 'tel',   placeholder: '+91 00000 00000' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-bold mb-2">{field.label}</label>
                    <input
                      required={field.name !== 'companyName'}
                      name={field.name}
                      type={field.type}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-bold mb-2">Project Details (Optional)</label>
                  <textarea
                    name="message"
                    rows={3}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none transition-all"
                    placeholder="Tell us about your project requirements..."
                  />
                </div>

                <TurnstileWidget
                  onVerify={(token) => { turnstileTokenRef.current = token; }}
                  onExpire={() => { turnstileTokenRef.current = ''; }}
                />

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                  </div>
                )}

                <motion.button
                  whileHover={!isLoading ? { scale: 1.02, boxShadow: '0 12px 40px -8px rgba(249,115,22,0.4)' } : {}}
                  whileTap={!isLoading ? { scale: 0.97 } : {}}
                  disabled={isLoading}
                  type="submit"
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={cn(
                    'w-full py-4 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 transition-opacity',
                    isLoading && 'opacity-70 pointer-events-none'
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Processing...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="submit"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                      >
                        <Send size={18} /> Submit Quote Request
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
                <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest">
                  Secure & Confidential Transmission
                </p>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
