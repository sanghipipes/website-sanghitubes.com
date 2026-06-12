# Sanghi Pipes & Tubes — Official Website

Corporate website for **Sanghi Tubes Private Limited**, a manufacturer and supplier of Ductile Iron Pipes, Cast Iron Pipes, Fittings, and Valves based in Kanpur, India.

Built with **Next.js 16**, **React 19**, **Three.js**, and **Framer Motion** — featuring a fully interactive 3D hero experience, scroll-driven animations, and a product quote system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion v12 |
| 3D Rendering | Three.js + React Three Fiber + Drei |
| Icons | Lucide React |
| Language | TypeScript 5 |
| Fonts | Geist Sans / Geist Mono (via next/font) |

---

## Features

- **Scroll-driven 3D hero** — A full-screen interactive pipe model that animates through 4 stages as you scroll (rise, drift, split reveal, reassemble)
- **Interactive product catalog** — 3D product models per category (pipes, valves, fittings) with orbit controls
- **Quote cart system** — Add products to a quote list, adjust quantities, and submit a request; persisted to `localStorage`
- **Container scroll showcase** — Tilted, scale-animated product dashboard card
- **Scroll progress bar** — Fixed top-of-page indicator
- **Responsive navigation** — Animated mobile menu with staggered reveal
- **Contact form** — With animated send state and embedded Google Maps
- **BIS/ISO certification highlights** — About page with company story and values

---

## Project Structure

```
sanghi-main/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout — Navbar, Footer, QuoteProvider, ScrollProgress
│   │   ├── page.tsx            # Home page — 3D hero, stats, categories, catalog, CTA
│   │   ├── globals.css         # CSS variables (light/dark), Tailwind import, custom utilities
│   │   ├── about/page.tsx      # Company story, certifications, core values
│   │   ├── contact/page.tsx    # Contact form, info cards, embedded map
│   │   ├── products/page.tsx   # Filterable product grid with 3D models
│   │   └── quote/page.tsx      # Quote cart — item list, quantity control, submit form
│   ├── components/
│   │   ├── Navbar.tsx          # Fixed nav, scroll-aware styling, mobile menu
│   │   ├── Footer.tsx          # Brand column, quick links, product links, contact info
│   │   └── ui/
│   │       ├── PipeShowcase3D.tsx            # Full-page scroll-driven 3D hero scene
│   │       ├── InteractiveProductModel.tsx   # Per-product 3D model (pipe/valve/fitting)
│   │       ├── container-scroll-animation.tsx # Tilted scroll card (catalog showcase)
│   │       ├── FadeIn.tsx                    # Scroll-triggered fade/blur/slide wrapper
│   │       ├── StaggerContainer.tsx          # Staggered child reveal container
│   │       ├── ScrollProgress.tsx            # Spring-animated top progress bar
│   │       └── Logo.tsx                      # SVG logo mark + wordmark
│   ├── context/
│   │   └── QuoteContext.tsx     # Cart state — add, remove, update quantity, clear
│   ├── data/
│   │   └── products.ts         # Product catalogue — 10 products across 6 categories
│   └── lib/
│       └── utils.ts            # cn() helper (clsx + tailwind-merge)
├── public/                     # Static assets (favicon only)
├── next.config.ts              # Image remote patterns (Unsplash, transparenttextures)
├── eslint.config.mjs           # ESLint with Next.js core-web-vitals + TypeScript rules
├── postcss.config.mjs          # PostCSS with @tailwindcss/postcss
└── tsconfig.json               # TypeScript config with @/* path alias → ./src/*
```

---

## Prerequisites

Make sure you have the following installed before getting started:

- **Node.js** v18.17 or later — [nodejs.org](https://nodejs.org)
- **npm** v9 or later (comes with Node.js)

To verify:

```bash
node -v   # should print v18.x or higher
npm -v    # should print 9.x or higher
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

This installs all packages listed in `package.json`, including Next.js, Three.js, Framer Motion, and Tailwind CSS.

### 2. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The server uses **Turbopack** for fast hot-reloads.

### 3. Build for production

```bash
npm run build
```

Outputs an optimised static build. All 6 routes are pre-rendered as static HTML.

### 4. Run the production build locally

```bash
npm run start
```

Serves the production build at [http://localhost:3000](http://localhost:3000).

### 5. Lint the codebase

```bash
npm run lint
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack hot-reload |
| `npm run build` | Create an optimised production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint across the project |

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | 3D scroll hero, stats, product categories, catalog showcase, featured products, CTA |
| `/about` | About Us | Company history, certifications, mission, quality, and customer values |
| `/products` | Products | Searchable, filterable product grid with interactive 3D models |
| `/quote` | Request a Quote | Cart view — add/remove/update products, submit contact form |
| `/contact` | Contact | Contact details, embedded Google Maps, message form |

---

## Product Catalogue

The catalogue is defined in `src/data/products.ts` and contains **10 products** across **6 categories**:

| Category | Products |
|---|---|
| Ductile Iron Pipes | K9 DI Spun Pipe, DI Double Flanged Pipe |
| Cast Iron Pipes | CI LA Pipe |
| DI Fittings | DI Flange Tee, DI MJ Collar |
| CI Fittings | CI Double Flanged Fitting |
| Valves | Ductile Iron Sluice Valve, Non Return Valve |
| Others | HDPE Round Pipe, Iron TMT Bar |

To add a new product, append an entry to the `products` array in `src/data/products.ts` following the `Product` interface.

---

## Configuration

### Image domains

External images are loaded from Unsplash and Transparent Textures. If you add new image sources, register them in `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'www.transparenttextures.com' },
    // add new domains here
  ],
},
```

### Theme / CSS variables

All design tokens (colours, radius, fonts) are defined as CSS custom properties in `src/app/globals.css`. The site ships with a dark-mode override via `@media (prefers-color-scheme: dark)`.

---

## Company Details

| | |
|---|---|
| **Company** | Sanghi Tubes Private Limited |
| **Location** | B No 79/8, Latouche Road, Kanpur — 208002, Uttar Pradesh, India |
| **Phone** | +91 7971549587 |
| **Email** | info@sanghitubes.com |
| **Working Hours** | Mon – Sat, 9:00 AM – 7:00 PM |
| **Certifications** | BIS Licensed, ISO 9001:2015 |
