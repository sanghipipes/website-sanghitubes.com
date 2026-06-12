# Core Design Philosophy

Build premium, cinematic, modern interfaces with intentional spacing, smooth interactions, and polished visual hierarchy.

The UI must feel like a high-end product built by an elite design agency.

Design should feel:
- Premium
- Minimal
- Futuristic
- Structured
- Spacious
- Smooth
- Interactive
- Visually cohesive

Avoid:
- Generic AI-generated layouts
- Default Tailwind styling
- Random colors
- Inconsistent spacing
- Overcrowded sections
- Flat design
- Cheap gradients
- Overuse of glassmorphism
- Abrupt animations

---

# Brand Visual Direction

Theme:
Industrial + Futuristic + Premium Engineering

Visual Style:
- Deep blue metallic tones
- Matte surfaces
- Soft reflections
- Cinematic lighting
- 3D pipeline animations
- Mechanical motion
- Subtle glow effects
- Depth-focused layouts

The website should resemble the quality level of:
- Apple
- Tesla
- SpaceX
- Stripe
- Linear
- Framer
- Vercel

---

# Typography System

## Font Families

Primary:
- Inter

Display:
- Satoshi

Monospace:
- JetBrains Mono

---

## Typography Scale

Use ONLY this scale.

| Usage | Size | Weight | Line Height |
|---|---|---|---|
| Hero Display | 80px | 700 | 1.0 |
| Hero Title | 64px | 700 | 1.05 |
| Section Heading | 48px | 700 | 1.1 |
| Heading Large | 36px | 600 | 1.2 |
| Heading Medium | 28px | 600 | 1.3 |
| Heading Small | 22px | 600 | 1.4 |
| Body Large | 20px | 400 | 1.7 |
| Body | 16px | 400 | 1.7 |
| Small Text | 14px | 400 | 1.6 |
| Caption | 12px | 400 | 1.5 |

Typography Rules:
- Never use arbitrary font sizes
- Maintain strict hierarchy
- Use generous whitespace around headings
- Body text should prioritize readability
- Headlines should feel bold and cinematic

---

# Spacing System

Use an 8px grid system ONLY.

## Allowed Spacing Values

4px
8px
12px
16px
24px
32px
40px
48px
64px
80px
96px
120px
160px

Spacing Rules:
- No random spacing values
- Large sections require breathing room
- Cards should have generous internal padding
- Maintain consistent vertical rhythm

---

# Color System

## Primary Colors

Background:
#07111F

Surface:
#0E1726

Elevated Surface:
#162235

Card Surface:
#101B2D

Primary Text:
#F8FAFC

Secondary Text:
#94A3B8

Muted Text:
#64748B

Accent Blue:
#3B82F6

Accent Hover:
#2563EB

Accent Glow:
rgba(59,130,246,0.35)

Border:
rgba(255,255,255,0.08)

Success:
#22C55E

Warning:
#F59E0B

Danger:
#EF4444

Color Rules:
- Use color tokens only
- Avoid random hex values
- Maintain high contrast
- Prioritize readability
- Keep the palette minimal and premium

---

# Layout System

## Container Widths

Small:
768px

Medium:
1024px

Large:
1280px

Ultra:
1440px

Layout Rules:
- Keep content centered
- Avoid extremely wide text blocks
- Use whitespace intentionally
- Use asymmetrical layouts carefully
- Large hero sections should feel cinematic

---

# Border Radius

Buttons:
12px

Cards:
20px

Inputs:
14px

Sections:
28px

Modals:
24px

---

# Shadows

## Standard Card Shadow

```css
box-shadow:
0 10px 30px rgba(0,0,0,0.25);
```

## Hover Shadow

```css
box-shadow:
0 20px 60px rgba(0,0,0,0.35);
```

## Glow Shadow

```css
box-shadow:
0 0 40px rgba(59,130,246,0.15);
```

Shadow Rules:
- Shadows should feel soft and layered
- Avoid harsh shadows
- Use depth subtly

---

# Animation System

Animation Style:
- Smooth
- Cinematic
- Physics-based
- Premium
- Controlled

Avoid:
- Abrupt motion
- Excessive bounce
- Cheap animations
- Hyperactive transitions

---

# Animation Timing

Fast:
150ms

Normal:
300ms

Slow:
600ms

Page Transition:
800ms

Easing:
cubic-bezier(0.22,1,0.36,1)

---

# Scroll Animation Rules

Use:
- Fade reveals
- Scale reveals
- Parallax movement
- Layered scrolling
- Sticky sections
- Horizontal scroll transitions
- Cinematic camera motion
- 3D object transforms
- Depth-based movement
- Smooth reveal timing

Scroll Experience:
- The website should feel immersive
- Motion should guide attention
- Sections should transition naturally
- Animations must maintain 60fps performance

Avoid:
- Janky motion
- Random floating elements
- Excessive rotation
- Motion without purpose

---

# 3D Website Direction

The homepage should feel like an immersive 3D engineering showcase.

3D Experience Rules:
- Use cinematic camera movement
- Use realistic metallic materials
- Pipes should move smoothly with scroll
- Add depth and perspective
- Product reveals should emerge from darkness
- Scroll should feel physically connected to the scene

Visual Inspiration:
- Apple AirPods product page
- Tesla vehicle reveal pages
- Samsung launch microsites
- SpaceX web experiences

Avoid:
- Cartoon-style 3D
- Bright neon overload
- Overly playful motion
- Cheap WebGL aesthetics

---

# Component System

## Buttons

Primary Button:
- Solid accent background
- White text
- Medium shadow
- Slight hover lift
- Smooth transition

Secondary Button:
- Transparent background
- Soft border
- Surface hover effect

Button Rules:
- Buttons should feel tactile
- Include hover states
- Include active states
- Never use default browser styling

---

# Cards

Card Rules:
- Elevated surfaces
- Soft borders
- Large padding
- Layered depth
- Smooth hover animation
- Subtle lighting

Avoid:
- Flat cards
- Thin borders
- Cramped layouts

---

# Forms

Form Rules:
- Large input fields
- Strong focus states
- Accessible contrast
- Clear labels
- Spacious layout
- Smooth interaction feedback

---

# Navigation

Navbar Rules:
- Minimal and clean
- Slight backdrop blur
- Transparent on hero
- Smooth transition on scroll
- Sticky positioning
- Spacious spacing

Mobile Menu:
- Fullscreen overlay
- Smooth slide animation
- Large clickable items

---

# Hero Section Rules

Hero sections should:
- Fill most of the viewport
- Feel cinematic
- Use layered depth
- Include strong typography
- Include immersive visuals
- Guide the eye naturally

Avoid:
- Cluttered hero content
- Too many buttons
- Excessive text

---

# Section Design Rules

Each section should:
- Have a clear purpose
- Feel visually distinct
- Transition smoothly
- Use proper spacing
- Maintain visual hierarchy

Alternate between:
- Dark surfaces
- Elevated surfaces
- Cinematic image sections

---

# Images & Media

Image Rules:
- Use cinematic imagery
- Use realistic lighting
- Maintain consistent aspect ratios
- Avoid low-quality stock images
- Use overlays subtly

Video Rules:
- Smooth autoplay loops
- No distracting motion
- Use cinematic cuts

---

# Responsive Design

Mobile-first approach.

## Breakpoints

sm:
640px

md:
768px

lg:
1024px

xl:
1280px

2xl:
1536px

Responsive Rules:
- Preserve spacing hierarchy
- Scale typography proportionally
- Simplify animations on mobile
- Optimize performance carefully

---

# Performance Rules

Requirements:
- Maintain smooth scrolling
- Optimize animation performance
- Lazy load heavy assets
- Minimize layout shifts
- Use GPU-accelerated transforms
- Avoid unnecessary re-renders

Preferred:
- Framer Motion
- GSAP
- React Three Fiber

---

# Preferred Tech Stack

Frontend:
- Next.js
- TypeScript
- TailwindCSS

Animation:
- Framer Motion
- GSAP

3D:
- React Three Fiber
- Drei

UI:
- shadcn/ui
- 21st.dev

Icons:
- Lucide Icons

State:
- Zustand

Backend:
- Supabase

Auth:
- Clerk or Supabase Auth

Deployment:
- Vercel

---

# Code Standards

Code Rules:
- Build reusable components
- Use semantic naming
- Keep folder structure clean
- Avoid duplicated styles
- Prefer composition over repetition
- Keep components modular
- Use proper TypeScript typing

---

# Final Quality Benchmark

The final website should feel like:
- A premium industrial-tech product
- A modern engineering brand
- A cinematic interactive experience

Every interaction should feel:
- Smooth
- Intentional
- Refined
- High-end
- Fluid

The user should immediately feel:
“This looks expensive.”