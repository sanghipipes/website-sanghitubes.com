'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, Info, ChevronRight } from 'lucide-react';
import { products, categories, Product } from '@/data/products';
import { useQuote } from '@/context/QuoteContext';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/ui/FadeIn';
import { InteractiveProductModel } from '@/components/ui/InteractiveProductModel';

function getProductModelProps(product: Product) {
  const map: Record<string, { type: string; color: string; metalness: number; roughness: number }> = {
    'di-double-flange-pipe':  { type: 'flanged-pipe',    color: '#1a2535', metalness: 0.95, roughness: 0.28 },
    'di-spun-pipe-ss':        { type: 'ss-pipe',         color: '#1a2535', metalness: 0.95, roughness: 0.28 },
    'ci-double-flange-pipe':  { type: 'ci-flanged-pipe', color: '#2d2d2d', metalness: 0.60, roughness: 0.65 },
    'ci-spun-pipe-ss':        { type: 'ci-ss-pipe',      color: '#2d2d2d', metalness: 0.60, roughness: 0.65 },
    'sluice-valve':           { type: 'gate-valve',      color: '#1e3a5f', metalness: 0.92, roughness: 0.22 },
    'air-valve':              { type: 'air-valve',       color: '#1e3a5f', metalness: 0.90, roughness: 0.30 },
    'butterfly-valve':        { type: 'butterfly-valve', color: '#1e3a5f', metalness: 0.92, roughness: 0.2  },
    'non-return-valve':       { type: 'check-valve',     color: '#1e3a5f', metalness: 0.92, roughness: 0.28 },
    'di-specials':            { type: 'pipe-tee',        color: '#1a2535', metalness: 0.95, roughness: 0.28 },
    'di-flanged-bend-45':     { type: 'flanged-bend-45', color: '#2a2f38', metalness: 0.5,  roughness: 0.55 },
    'di-socket-tee':          { type: 'socket-tee',      color: '#1d4ed8', metalness: 0.35, roughness: 0.32 },
    'di-flanged-tee':         { type: 'flanged-tee',     color: '#2563eb', metalness: 0.4,  roughness: 0.35 },
    'di-flanged-cross':       { type: 'flanged-cross',   color: '#2a2f38', metalness: 0.5,  roughness: 0.55 },
    'di-collar':              { type: 'collar',          color: '#2a2f38', metalness: 0.5,  roughness: 0.55 },
    'di-flanged-spigot':      { type: 'flanged-spigot',  color: '#1d4ed8', metalness: 0.35, roughness: 0.32 },
    'di-flanged-adapter':     { type: 'flanged-adapter', color: '#2a2f38', metalness: 0.5,  roughness: 0.55 },
    'di-socket-bend-11':      { type: 'socket-bend-11',  color: '#2a2f38', metalness: 0.5,  roughness: 0.55 },
    'di-plug':                { type: 'plug',            color: '#2a2f38', metalness: 0.5,  roughness: 0.55 },
    'di-duckfoot-bend-90':    { type: 'duckfoot-bend-90',color: '#2563eb', metalness: 0.4,  roughness: 0.35 },
    'di-socket-cross':        { type: 'socket-cross',    color: '#2a2f38', metalness: 0.5,  roughness: 0.55 },
    'di-flange-socket-tee':   { type: 'flange-socket-tee',color:'#2a2f38', metalness: 0.5,  roughness: 0.55 },
    'di-socket-bend-90':      { type: 'socket-bend-90',  color: '#2563eb', metalness: 0.4,  roughness: 0.35 },
    'di-bell-mouth':          { type: 'bell-mouth',      color: '#2a2f38', metalness: 0.5,  roughness: 0.55 },
    'di-flanged-socket':      { type: 'flanged-socket',  color: '#2a2f38', metalness: 0.5,  roughness: 0.55 },
    'di-mj-collar':           { type: 'mj-collar',       color: '#2563eb', metalness: 0.4,  roughness: 0.35 },
    'di-end-cap':             { type: 'end-cap',         color: '#2a2f38', metalness: 0.5,  roughness: 0.55 },
    'di-blank-flange':        { type: 'blank-flange',    color: '#2a2f38', metalness: 0.5,  roughness: 0.55 },
    'di-puddle-pipe':         { type: 'puddle-pipe',     color: '#2563eb', metalness: 0.4,  roughness: 0.35 },
    'di-single-flange-pipe':  { type: 'flanged-spigot',  color: '#2a2f38', metalness: 0.5,  roughness: 0.55 },
    'hdpe-pipes':             { type: 'hdpe-pipe',       color: '#0f172a', metalness: 0,    roughness: 0.75 },
    'hdpe-specials':          { type: 'ef-coupler',      color: '#0f172a', metalness: 0,    roughness: 0.75 },
    'electrofusion-fittings': { type: 'ef-coupler-coiled', color: '#0f172a', metalness: 0,  roughness: 0.7  },
    'dwc-pipes':              { type: 'dwc-pipe',        color: '#111827', metalness: 0,    roughness: 0.8  },
    'opvc-pipes-fittings':    { type: 'opvc-pipe',       color: '#e2e8f0', metalness: 0,    roughness: 0.55 },
    'ms-pipes':               { type: 'ms-pipe',         color: '#2c3e50', metalness: 0.78, roughness: 0.48 },
    'ms-specials':            { type: 'pipe-tee',        color: '#2c3e50', metalness: 0.78, roughness: 0.48 },
    'gi-pipes':               { type: 'gi-pipe',         color: '#9ca3af', metalness: 0.97, roughness: 0.12 },
    'gi-specials':            { type: 'gi-elbow',        color: '#cbd5e1', metalness: 1,    roughness: 0.12 },
    'tmt-bars':               { type: 'tmt-bar',         color: '#374151', metalness: 0.85, roughness: 0.55 },
    'ms-bolts-nut-bolts':     { type: 'bolt',            color: '#9ca3af', metalness: 0.97, roughness: 0.12 },
  };
  return map[product.id] ?? { type: 'ss-pipe', color: '#cbd5e1', metalness: 1, roughness: 0.1 };
}

// Inner component — uses useSearchParams, must be inside a Suspense boundary
function ProductsContent() {
  const searchParams = useSearchParams();
  const { addItem } = useQuote();

  // Initialise from URL params so footer/homepage links work
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    const cat = searchParams.get('cat');
    return cat && (categories as readonly string[]).includes(cat) ? cat : 'All';
  });

  const [selectedProductId, setSelectedProductId] = useState<string | null>(() => {
    return searchParams.get('id');
  });

  const [search, setSearch] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [search, activeCategory]);

  const handleAddToQuote = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <header className="mb-16">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Interactive Catalog</span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">OUR <span className="text-primary italic">PRODUCTS</span></h1>
            <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed">
              Explore our precision-engineered industrial solutions in interactive 3D. Designed for extreme durability and mission-critical performance.
            </p>
          </header>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={0.2}>
          <div className="flex flex-col lg:flex-row gap-6 mb-16">
            <div className="relative flex-grow lg:self-start">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search precision components..."
                className="w-full pl-16 pr-6 py-5 bg-card border border-border/30 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-2xl text-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {['All', ...categories].map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className={cn(
                    "relative px-8 py-5 rounded-2xl font-bold text-sm whitespace-nowrap border uppercase tracking-widest overflow-hidden transition-colors",
                    activeCategory === cat
                      ? "border-primary text-white shadow-lg shadow-primary/20"
                      : "bg-card border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {activeCategory === cat && (
                    <motion.span
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-primary -z-0"
                      style={{ borderRadius: 16 }}
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedProductId(selectedProductId === product.id ? null : product.id)}
                className={cn(
                  "group relative bg-card/50 border rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-500",
                  selectedProductId === product.id ? "border-primary/50 ring-1 ring-primary/20" : "border-border/30 hover:border-border"
                )}
              >
                <div className="aspect-[4/3] relative bg-gradient-to-br from-muted to-background overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <InteractiveProductModel {...getProductModelProps(product)} />
                  )}
                  <div className="absolute top-6 right-6">
                    <span className="bg-muted/20 backdrop-blur-md text-foreground/40 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-border/20">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border/30">
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Status</p>
                      <p className="text-xs font-bold text-green-400 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Ready to Ship
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20"
                    >
                      <ChevronRight size={24} className={cn("transition-transform duration-300", selectedProductId === product.id && "rotate-90")} />
                    </motion.div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-black mb-6 group-hover:text-primary transition-colors tracking-tight italic uppercase">
                    {product.name}
                  </h3>

                  <AnimatePresence>
                    {selectedProductId === product.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 mb-8 pt-4 border-t border-border/30">
                          <p className="text-[10px] text-primary uppercase font-black tracking-widest">Technical Specifications</p>
                          {product.specs && Object.entries(product.specs).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground font-medium">{key}</span>
                              <span className="text-foreground font-bold">{value}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-4">
                    <motion.button
                      onClick={(e) => handleAddToQuote(product, e)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className={cn(
                        "flex-grow py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-colors overflow-hidden relative",
                        addedId === product.id
                          ? "bg-green-500 text-white"
                          : "bg-foreground text-background hover:bg-primary hover:text-white"
                      )}
                    >
                      <AnimatePresence mode="wait">
                        {addedId === product.id ? (
                          <motion.span
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-center gap-1.5"
                          >
                            <Check size={14} /> Added
                          </motion.span>
                        ) : (
                          <motion.span
                            key="add"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            Add to Quote
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: 'rgb(71 85 105)' }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="px-6 py-4 bg-muted rounded-2xl text-foreground transition-colors"
                    >
                      <Info size={20} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <FadeIn>
            <div className="text-center py-32 border-2 border-dashed border-border/30 rounded-[4rem]">
              <div className="text-5xl font-black mb-6 text-muted-foreground uppercase italic">Component Not Found</div>
              <p className="text-muted-foreground text-xl">Try adjusting your filters or search terms for precision engineering.</p>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

// Suspense boundary required by Next.js 16 App Router when useSearchParams is used in a client component
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-24 min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground text-sm uppercase tracking-widest font-black">Loading catalog...</div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
