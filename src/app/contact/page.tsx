'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, AlertCircle } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerContainer';
import { TurnstileWidget } from '@/components/ui/TurnstileWidget';
import { submitContactAction } from '@/actions/contact';

export default function ContactPage() {
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState('');
  const turnstileTokenRef = useRef('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!turnstileTokenRef.current && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setError('Please complete the CAPTCHA verification.');
      return;
    }

    setSending(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitContactAction({
      firstName: formData.get('firstName') as string,
      lastName:  formData.get('lastName')  as string,
      email:     formData.get('email')     as string,
      subject:   formData.get('subject')   as string,
      message:   formData.get('message')   as string,
      turnstileToken: turnstileTokenRef.current || 'dev-bypass',
    });

    setSending(false);

    if (result.success) {
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } else {
      setError(result.error ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <FadeIn>
          <div className="max-w-3xl mb-16">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
            >
              Contact Us
            </motion.span>
            <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have questions about our products or need a custom solution? Our team is here to help.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="space-y-12">
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: <Phone />, title: 'Call Us', detail: '+91 7971549587', sub: 'Mon-Sat, 9am - 7pm' },
                {
                  icon: <Mail />,
                  title: 'Email Us',
                  detail: 'info@sanghitubes.com',
                  sub: 'Response within 24hrs',
                },
                {
                  icon: <MapPin />,
                  title: 'Visit Us',
                  detail: 'B No 79/8, Latouche Road',
                  sub: 'Kanpur, Uttar Pradesh 208002',
                },
                {
                  icon: <Clock />,
                  title: 'Working Hours',
                  detail: '09:00 AM - 07:00 PM',
                  sub: 'Closed on Sundays',
                },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className="flex gap-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 8, backgroundColor: 'rgb(59 130 246 / 0.2)' }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0"
                    >
                      {item.icon}
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-foreground font-semibold">{item.detail}</p>
                      <p className="text-sm text-muted-foreground">{item.sub}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Map */}
            <FadeIn delay={0.4} scale>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                className="w-full aspect-video rounded-3xl overflow-hidden grayscale contrast-125 border border-border shadow-lg"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14287.07204667577!2d80.3437632!3d26.4632059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c475e062c557d%3A0x6321b61ab12bd2e7!2sSanghi%20Pipes%20%26%20Tubes!5e0!3m2!1sen!2sin!4v1727783502920!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            </FadeIn>
          </div>

          {/* Contact Form */}
          <FadeIn direction="left">
            <motion.div
              whileHover={{ boxShadow: '0 32px 80px -20px rgba(59,130,246,0.15)' }}
              transition={{ duration: 0.4 }}
              className="bg-card border border-border p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'First Name', name: 'firstName', placeholder: 'John' },
                    { label: 'Last Name',  name: 'lastName',  placeholder: 'Doe'  },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-sm font-bold mb-2">{f.label}</label>
                      <input
                        required
                        type="text"
                        name={f.name}
                        placeholder={f.placeholder}
                        className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Subject</label>
                  <select
                    name="subject"
                    className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option>General Inquiry</option>
                    <option>Product Specification</option>
                    <option>Project Partnership</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Message</label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none resize-none transition-all"
                    placeholder="How can we help you today?"
                  />
                </div>

                <TurnstileWidget
                  onVerify={(token) => { turnstileTokenRef.current = token; }}
                  onExpire={() => { turnstileTokenRef.current = ''; }}
                />

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3">
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                  </div>
                )}

                <motion.button
                  whileHover={!sending ? { scale: 1.02, boxShadow: '0 12px 40px -8px rgba(59,130,246,0.4)' } : {}}
                  whileTap={!sending ? { scale: 0.97 } : {}}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  type="submit"
                  disabled={sending}
                  className="w-full py-5 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow flex items-center justify-center gap-2 overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {sent ? (
                      <motion.span
                        key="sent"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        Message Sent!
                      </motion.span>
                    ) : sending ? (
                      <motion.span
                        key="sending"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Sending...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          whileHover={{ x: 3, rotate: -20 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                          <Send size={18} />
                        </motion.div>
                        Send Message
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
