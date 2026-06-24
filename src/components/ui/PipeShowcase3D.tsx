'use client';

import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

// Small client-side breakpoint hook (SSR-safe). Mobile = portrait-ish phones/tablets.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isMobile;
}
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  PerspectiveCamera,
  ContactShadows,
  Sparkles,
  BakeShadows,
  MeshDistortMaterial,
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

// ── helpers ──────────────────────────────────────────────────────────────────
const smoothStep = (t: number) => t * t * (3 - 2 * t);
const remap = (v: number, a: number, b: number) =>
  Math.max(0, Math.min(1, (v - a) / (b - a)));

// Trapezoid 0→1→1→0 envelope across an open window.
function envelope(p: number, s: number, ps: number, pe: number, e: number) {
  if (p <= s || p >= e) return 0;
  if (p < ps) return smoothStep(remap(p, s, ps));
  if (p <= pe) return 1;
  return 1 - smoothStep(remap(p, pe, e));
}

// ── React sub-components (hooks must live in components, not inline) ──────────

function ScrollDot({
  scrollProgress,
  center,
}: {
  scrollProgress: MotionValue<number>;
  center: number;
}) {
  const half = 0.09;
  const opacity = useTransform(
    scrollProgress,
    [Math.max(0, center - half), center, Math.min(1, center + half)],
    [0.2, 1, 0.2],
  );
  const scale = useTransform(
    scrollProgress,
    [Math.max(0, center - half), center, Math.min(1, center + half)],
    [0.5, 1.6, 0.5],
  );
  return (
    <motion.div
      style={{ opacity, scale }}
      className="h-2.5 w-2.5 rounded-full bg-primary"
    />
  );
}

function TextSection({
  scrollProgress,
  inStart,
  peakStart,
  peakEnd,
  outEnd,
  align,
  verticalAlign = 'center',
  startVisible = false,
  children,
}: {
  scrollProgress: MotionValue<number>;
  inStart: number;
  peakStart: number;
  peakEnd: number;
  outEnd: number;
  align: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'center' | 'bottom';
  startVisible?: boolean;
  children: React.ReactNode;
}) {
  // Pin opacity to 0 outside the [inStart, outEnd] window. Without an explicit
  // trailing keyframe + clamp, framer-motion lets the value climb back up past
  // outEnd, which made the hero title re-appear and overlap "BUILT TO LAST".
  const opacity = useTransform(
    scrollProgress,
    outEnd < 1
      ? [inStart, peakStart, peakEnd, outEnd, 1]
      : [inStart, peakStart, peakEnd, outEnd],
    outEnd < 1
      ? [startVisible ? 1 : 0, 1, 1, 0, 0]
      : [startVisible ? 1 : 0, 1, 1, 0],
    { clamp: true },
  );
  const blur = useTransform(
    scrollProgress,
    [inStart, peakStart],
    startVisible ? ['blur(0px)', 'blur(0px)'] : ['blur(14px)', 'blur(0px)'],
  );
  const y = useTransform(
    scrollProgress,
    [inStart, peakStart],
    startVisible ? [0, 0] : align === 'center' ? [50, 0] : align === 'right' ? [30, 0] : [-30, 0],
  );

  const vClass =
    verticalAlign === 'top' ? 'items-start pt-28' :
    verticalAlign === 'bottom' ? 'items-end pb-16' :
    'items-center';

  return (
    <div
      className={`absolute inset-0 flex ${vClass} px-8 md:px-20 ${
        align === 'center'
          ? 'justify-center'
          : align === 'right'
          ? 'justify-end'
          : 'justify-start'
      }`}
    >
      <motion.div style={{ opacity, filter: blur, y }}>{children}</motion.div>
    </div>
  );
}

// ── shell materials (functional components so each mesh gets its own instance)
function ShellMat() {
  return (
    <meshPhysicalMaterial
      color="#0b1629"
      metalness={1.0}
      roughness={0.08}
      envMapIntensity={5}
      clearcoat={1.0}
      clearcoatRoughness={0.04}
      side={THREE.DoubleSide}
      emissive="#1e293b"
      emissiveIntensity={0.18}
    />
  );
}

function OPVCShellMat() {
  // Light, plastic-like oriented-PVC body
  return (
    <meshPhysicalMaterial
      color="#d8dee7"
      metalness={0.08}
      roughness={0.34}
      envMapIntensity={1.6}
      clearcoat={0.6}
      clearcoatRoughness={0.22}
      side={THREE.DoubleSide}
      emissive="#aab4c4"
      emissiveIntensity={0.12}
    />
  );
}

// ── 3D hero pipe — rendered once per pipe (DI left, OPVC right) ────────────────
function HeroPipe({
  scrollProgress,
  baseX,
  variant,
  openWindow,
  baseScale = 1.5,
}: {
  scrollProgress: MotionValue<number>;
  baseX: number;
  variant: 'di' | 'opvc';
  openWindow: [number, number, number, number];
  baseScale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const internalRef = useRef<THREE.Group>(null);
  const flowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const boltMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1e2d3d', metalness: 1, roughness: 0.2 }),
    [],
  );

  const flowColor = variant === 'di' ? '#1e40af' : '#0ea5e9';
  const lightColor = variant === 'di' ? '#60a5fa' : '#38bdf8';
  const Shell = variant === 'di' ? ShellMat : OPVCShellMat;

  useFrame((state, delta) => {
    const p = scrollProgress.get();
    const clock = state.clock.getElapsedTime();
    const g = groupRef.current;
    if (!g) return;

    if (lightRef.current) {
      lightRef.current.position.y = Math.sin(clock * 0.7) * 5;
      lightRef.current.intensity = 1.6 + Math.sin(clock * 1.6) * 0.6;
    }

    const openAmt = envelope(p, openWindow[0], openWindow[1], openWindow[2], openWindow[3]);

    // Stays in its own lane — opens in place, never drifts across the page.
    g.position.x = baseX;
    g.position.y = 0;
    g.scale.setScalar(baseScale * (1 + openAmt * 0.08));
    g.rotation.y += delta * (0.22 - openAmt * 0.14);

    // Half-shells slide straight apart — a clean vertical split that opens fully.
    const split = openAmt * 1.8;
    if (leftRef.current) leftRef.current.position.x = -split;
    if (rightRef.current) rightRef.current.position.x = split;

    if (internalRef.current) {
      internalRef.current.children.forEach((c) => {
        if (c instanceof THREE.Mesh)
          (c.material as THREE.MeshStandardMaterial).opacity = openAmt * 0.95;
      });
    }
    if (flowRef.current)
      (flowRef.current.material as THREE.MeshStandardMaterial).opacity = openAmt * 1.0;
  });

  return (
    <group ref={groupRef}>
      <pointLight ref={lightRef} intensity={1.6} color={lightColor} distance={14} />

      {/* Two half-shells that split apart in place */}
      <mesh ref={leftRef} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 6, 64, 1, false, 0, Math.PI]} />
        <Shell />
      </mesh>
      <mesh ref={rightRef} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 6, 64, 1, false, 0, Math.PI]} />
        <Shell />
      </mesh>

      {variant === 'di' ? (
        /* DI — flanges + bolts at both ends */
        ([-3, 3] as number[]).map((y, idx) => (
          <group key={idx} position={[0, y, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.78, 0.78, 0.42, 64]} />
              <ShellMat />
            </mesh>
            {Array.from({ length: 12 }).map((_, j) => (
              <mesh
                key={j}
                position={[
                  Math.cos((j / 12) * Math.PI * 2) * 0.66,
                  0,
                  Math.sin((j / 12) * Math.PI * 2) * 0.66,
                ]}
              >
                <cylinderGeometry args={[0.034, 0.034, 0.48, 10]} />
                <primitive object={boltMat} attach="material" />
              </mesh>
            ))}
          </group>
        ))
      ) : (
        /* OPVC — push-fit bell socket + blue pressure band (no flanges) */
        <>
          <mesh position={[0, 3.08, 0]} castShadow>
            <cylinderGeometry args={[0.74, 0.52, 0.62, 64]} />
            <OPVCShellMat />
          </mesh>
          <mesh position={[0, 3.42, 0]}>
            <cylinderGeometry args={[0.74, 0.74, 0.12, 64]} />
            <OPVCShellMat />
          </mesh>
          {/* Blue pressure-class band */}
          <mesh position={[0, 2.1, 0]}>
            <cylinderGeometry args={[0.515, 0.515, 0.34, 64]} />
            <meshStandardMaterial color="#2563eb" metalness={0.2} roughness={0.5} emissive="#1d4ed8" emissiveIntensity={0.25} />
          </mesh>
          {/* Spigot chamfer at the bottom */}
          <mesh position={[0, -3.04, 0]}>
            <cylinderGeometry args={[0.46, 0.5, 0.18, 64]} />
            <OPVCShellMat />
          </mesh>
        </>
      )}

      {/* Internal structure — revealed during the split */}
      <group ref={internalRef}>
        {/* Dark inner bore liner — gives the open a deep, professional "look inside" */}
        <mesh>
          <cylinderGeometry args={[0.44, 0.44, 5.86, 64, 1, true]} />
          <meshStandardMaterial
            color="#060d1a"
            metalness={0.6}
            roughness={0.5}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Emissive scan wireframe */}
        <mesh>
          <cylinderGeometry args={[0.47, 0.47, 5.9, 64]} />
          <meshStandardMaterial
            color={flowColor}
            emissive={flowColor}
            emissiveIntensity={6}
            transparent
            opacity={0}
            wireframe
          />
        </mesh>
      </group>

      {/* Animated liquid flow */}
      <mesh ref={flowRef}>
        <cylinderGeometry args={[0.35, 0.35, 5.82, 32, 16]} />
        <MeshDistortMaterial
          color={flowColor}
          emissive={flowColor}
          emissiveIntensity={5}
          speed={6}
          distort={0.45}
          radius={1}
          transparent
          opacity={0}
        />
      </mesh>

      {/* HUD scan rings */}
      {([1.8, 0, -1.8] as number[]).map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.53, 0.006, 16, 128]} />
          <meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={8} />
        </mesh>
      ))}
    </group>
  );
}

// ── camera that gently zooms as the user scrolls ──────────────────────────────
function DynamicCamera({ scrollProgress, isMobile }: { scrollProgress: MotionValue<number>; isMobile: boolean }) {
  const ref = useRef<THREE.PerspectiveCamera>(null);
  // On narrow portrait phones the camera sits farther back so both pipe lanes
  // stay framed (the FOV is vertical, so a narrow screen sees less width).
  const zNear = isMobile ? 15.8 : 13.2;
  const zFar = isMobile ? 15.0 : 12.2;
  useFrame(() => {
    if (!ref.current) return;
    const p = scrollProgress.get();
    ref.current.fov = THREE.MathUtils.lerp(44, 40, p);
    ref.current.position.z = THREE.MathUtils.lerp(zNear, zFar, p);
    ref.current.updateProjectionMatrix();
  });
  return <PerspectiveCamera ref={ref} makeDefault position={[0, 0, zNear]} fov={44} />;
}

function Scene({ scrollProgress, isDark, isMobile }: { scrollProgress: MotionValue<number>; isDark: boolean; isMobile: boolean }) {
  const fogColor  = isDark ? '#020617' : '#c8d5e8';
  const bgColor   = isDark ? '#010410' : '#e8eef8';
  const gridColor = isDark ? '#0a1428' : '#a8bdd4';

  // On mobile the lanes move closer to centre and the pipes shrink a touch so
  // both fit a narrow portrait frame; on desktop the wide full-screen layout stays.
  const laneX = isMobile ? 1.85 : 3.4;
  const pipeScale = isMobile ? 1.1 : 1.5;

  return (
    <>
      <DynamicCamera scrollProgress={scrollProgress} isMobile={isMobile} />
      <fog attach="fog" args={[fogColor, 8, 32]} />
      <ambientLight intensity={0.14} />
      {/* Key — crisp studio spotlight */}
      <spotLight
        position={[20, 22, 22]}
        angle={0.22}
        penumbra={1}
        intensity={11}
        castShadow={!isMobile}
        shadow-mapSize={[2048, 2048]}
      />
      {/* Cool fills for that polished, electric-blue product look */}
      <pointLight position={[-16, 10, -10]} intensity={5} color="#3b82f6" />
      <pointLight position={[16, -10, 10]} intensity={5} color="#1d4ed8" />
      <pointLight position={[0, 16, 6]} intensity={3.5} color="#ffffff" />
      {/* Rim / back light — separates the pipes from the dark backdrop */}
      <spotLight position={[0, 6, -18]} angle={0.6} penumbra={1} intensity={9} color="#60a5fa" />

      {/* Double Flange pipe — left, opens during beat 2 */}
      <group position={[-laneX, 0, 0]}>
        <HeroPipe scrollProgress={scrollProgress} baseX={0} variant="di" openWindow={[0.16, 0.24, 0.40, 0.48]} baseScale={pipeScale} />
      </group>
      {/* OPVC pipe — right, opens during beat 3 */}
      <group position={[laneX, 0, 0]}>
        <HeroPipe scrollProgress={scrollProgress} baseX={0} variant="opvc" openWindow={[0.52, 0.60, 0.74, 0.82]} baseScale={pipeScale} />
      </group>

      <Sparkles count={isMobile ? 24 : 80} scale={16} size={3} speed={0.4} opacity={0.24} color="#60a5fa" />
      {!isMobile && <Sparkles count={40} scale={22} size={1.5} speed={0.25} opacity={0.1} color="#ffffff" />}

      {/* Inner Suspense so the HDR download never blocks the outer page.tsx Suspense boundary. */}
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
      {/* Ground shadow is desktop-only — on mobile its per-frame offscreen render
          composites poorly on iOS Safari and shows as a flickering dark blob. */}
      {!isMobile && <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={34} blur={2.5} far={6} />}

      {/* Background pillar grid */}
      <group position={[0, 0, -18]}>
        {Array.from({ length: 14 }).map((_, i) => (
          <mesh key={i} position={[(i - 6.5) * 9, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.12, 50, 0.12]} />
            <meshStandardMaterial color={gridColor} transparent opacity={0.22} />
          </mesh>
        ))}
      </group>

      <mesh position={[0, 0, -28]} scale={160}>
        <planeGeometry />
        <meshStandardMaterial color={bgColor} />
      </mesh>
    </>
  );
}

// ── main export ───────────────────────────────────────────────────────────────
const STAGE_CENTERS = [0.05, 0.31, 0.62, 0.9] as const;

export const PipeShowcase3D = () => {
  const { resolvedTheme } = useTheme();
  // Initialise from the class next-themes applies BEFORE paint, so the WebGL scene
  // matches the user's theme on the first client render (no dark→light flash on load).
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true,
  );
  useEffect(() => { setIsDark(resolvedTheme !== 'light'); }, [resolvedTheme]);

  const isMobile = useIsMobile();

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <div ref={containerRef} className="h-[450vh] w-full bg-background relative">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">

        {/* 3D Canvas */}
        <Canvas
          shadows={!isMobile}
          dpr={isMobile ? [1, 1.25] : [1, 1.5]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.toneMappingExposure = 1.18;
          }}
        >
          <Scene scrollProgress={scrollYProgress} isDark={isDark} isMobile={isMobile} />
          {!isMobile && <BakeShadows />}
        </Canvas>

        {/* Dot-grid overlay */}
        <div className={`absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(59,130,246,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.055)_1px,transparent_1px)] bg-[size:80px_80px] ${isMobile ? '' : '[mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]'}`} />

        {/* Scroll-driven text overlays */}
        <div className="absolute inset-0 pointer-events-none">

          {/* 1 — Hero: centered on screen, visible from the start, gone by 14% */}
          <TextSection
            scrollProgress={scrollYProgress}
            inStart={0} peakStart={0.001} peakEnd={0.04} outEnd={0.14}
            align="center"
            verticalAlign="center"
            startVisible
          >
            <div className="text-center">
              <h1 className="text-[3rem] md:text-[6rem] font-black text-white mix-blend-difference tracking-[-0.05em] uppercase italic leading-[0.85]">
                SANGHI TUBES
                <br />
                <span className="stroke-text text-transparent not-italic block mt-2">
                  PRIVATE LIMITED
                </span>
              </h1>
              <div className="flex items-center justify-center gap-8 mt-6">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                <span className="text-primary font-black tracking-[0.7em] md:tracking-[1em] uppercase text-xs md:text-sm">
                  Precision // Resilience // Quality
                </span>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              </div>
            </div>
          </TextSection>

          {/* 2 — Double Flanged Pipe specs (left, by the DI pipe) */}
          <TextSection
            scrollProgress={scrollYProgress}
            inStart={0.15} peakStart={0.22} peakEnd={0.40} outEnd={0.48}
            align="left"
          >
            <div className="max-w-md">
              <div className="flex items-center gap-5 mb-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary font-black text-lg italic">01</span>
                </div>
                <div className="h-px w-40 bg-gradient-to-r from-primary/50 to-transparent" />
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-foreground mb-6 italic uppercase tracking-tighter leading-none">
                Double
                <br />
                <span className="text-primary not-italic">Flanged</span>
              </h2>
              <p className="text-muted-foreground text-xl mb-4 leading-relaxed font-medium">
                20+ Years of Experience in flanging of pipes
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Tensile Strength', val: '420 MPa' },
                  { label: 'Yield Strength', val: '300 MPa' },
                  { label: 'Pressure Class', val: 'K9 / K12' },
                  { label: 'Standard', val: 'IS 8329' },
                ].map((s) => (
                  <div key={s.label} className="border-l-2 border-primary/30 pl-5">
                    <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-1">
                      {s.label}
                    </div>
                    <div className="text-xl font-black text-foreground italic">{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </TextSection>

          {/* 3 — OPVC Pipe specs (right, by the OPVC pipe — same overlay layout as the
              Double Flanged section, no card, so the pipe + opening animation show through) */}
          <TextSection
            scrollProgress={scrollYProgress}
            inStart={0.50} peakStart={0.58} peakEnd={0.74} outEnd={0.82}
            align="right"
          >
            <div className="max-w-md">
              <div className="flex items-center gap-5 mb-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary font-black text-lg italic">02</span>
                </div>
                <div className="h-px w-40 bg-gradient-to-r from-primary/50 to-transparent" />
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-foreground mb-6 italic uppercase tracking-tighter leading-none">
                OPVC
                <br />
                <span className="text-primary not-italic">Pipes</span>
              </h2>
              <p className="text-muted-foreground text-xl mb-4 leading-relaxed font-medium">
                India&apos;s next-generation water pipe — oriented PVC with a superior
                strength-to-weight ratio and rubber-ring push-fit joints.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Standard', val: 'IS 16647' },
                  { label: 'Pressure', val: 'PN 12.5–25' },
                  { label: 'Size Range', val: 'DN 110–250' },
                  { label: 'Joint', val: 'Push-fit RR' },
                ].map((s) => (
                  <div key={s.label} className="border-l-2 border-primary/30 pl-5">
                    <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-1">
                      {s.label}
                    </div>
                    <div className="text-xl font-black text-foreground italic">{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </TextSection>

          {/* 4 — Final stats */}
          <TextSection
            scrollProgress={scrollYProgress}
            inStart={0.84} peakStart={0.90} peakEnd={0.97} outEnd={1.0}
            align="center"
          >
            <div className="text-center">
              <h2 className="text-[5rem] md:text-[10rem] font-black text-white mix-blend-difference mb-8 tracking-tighter uppercase italic leading-[0.85]">
                BUILT
                <br />
                <span className="text-primary not-italic">TO LAST</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-14 max-w-3xl mx-auto font-light uppercase tracking-tight leading-tight">
                50+ Years of Industry Excellence.
                <br />
                <span className="text-foreground font-bold italic">20+ Years of Double Flanged Pipe Manufacturing.</span>
              </p>
              <div className="flex flex-wrap justify-center gap-14">
                {[
                  { l: 'Industry Experience', v: '50+ Years' },
                  { l: 'Quality Audits', v: '100%' },
                  { l: 'Service Life', v: '100+ Years' },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="text-4xl md:text-5xl font-black text-foreground mb-2 italic tracking-tighter">
                      {s.v}
                    </div>
                    <div className="text-xs text-muted-foreground font-black uppercase tracking-[0.3em]">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TextSection>
        </div>

        {/* Stage progress dots — right edge */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30 pointer-events-none">
          {STAGE_CENTERS.map((center, i) => (
            <ScrollDot key={i} scrollProgress={scrollYProgress} center={center} />
          ))}
        </div>

        {/* Scroll cue (fades out immediately after first scroll) */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
        >
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.4em]">
            Scroll to Explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="h-10 w-px bg-gradient-to-b from-primary/60 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
};
