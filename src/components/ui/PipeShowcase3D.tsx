'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { useTheme } from 'next-themes';
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
  const opacity = useTransform(
    scrollProgress,
    [inStart, peakStart, peakEnd, outEnd],
    [startVisible ? 1 : 0, 1, 1, 0],
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

// ── shared shell material (functional component so each mesh gets own instance)
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

// ── 3D pipe model ─────────────────────────────────────────────────────────────
function PipeModel({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const internalRef = useRef<THREE.Group>(null);
  const flowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // pre-build a single boltMat instance
  const boltMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1e2d3d', metalness: 1, roughness: 0.2 }),
    [],
  );

  useFrame((state, delta) => {
    const p = scrollProgress.get();
    const clock = state.clock.getElapsedTime();

    if (lightRef.current) {
      lightRef.current.position.y = Math.sin(clock * 0.7) * 5;
      lightRef.current.intensity = 1.8 + Math.sin(clock * 1.6) * 0.7;
    }

    if (!groupRef.current) return;
    const g = groupRef.current;

    // Stage 0 — Visible and rotating from the start (0 → 0.2)
    if (p < 0.2) {
      g.position.y = 0;
      g.position.x = 0;
      g.scale.setScalar(THREE.MathUtils.lerp(1.0, 1.2, smoothStep(remap(p, 0, 0.2))));
      g.rotation.z = 0;
      g.rotation.y += delta * 0.25;
    }
    // Stage 1 — Drift left & scale up (0.2 → 0.42)
    else if (p < 0.42) {
      const t = smoothStep(remap(p, 0.2, 0.42));
      g.position.x = THREE.MathUtils.lerp(0, -1.8, t);
      g.position.y = 0;
      g.scale.setScalar(THREE.MathUtils.lerp(1.2, 1.65, t));
      g.rotation.y += delta * 0.18;
    }
    // Stage 2 — Drift right + split reveal (0.42 → 0.72)
    else if (p < 0.72) {
      const t = smoothStep(remap(p, 0.42, 0.72));
      g.position.x = THREE.MathUtils.lerp(-1.8, 2.8, t);
      g.position.y = THREE.MathUtils.lerp(0, -0.4, t);
      g.scale.setScalar(1.65);
      g.rotation.y += delta * 0.06;

      const split = smoothStep(remap(p, 0.48, 0.68)) * 2.1;
      if (leftRef.current) leftRef.current.position.x = -split;
      if (rightRef.current) rightRef.current.position.x = split;

      const iOp = smoothStep(remap(p, 0.5, 0.7));
      if (internalRef.current) {
        internalRef.current.children.forEach((c) => {
          if (c instanceof THREE.Mesh)
            (c.material as THREE.MeshStandardMaterial).opacity = iOp * 0.8;
        });
      }
      if (flowRef.current)
        (flowRef.current.material as THREE.MeshStandardMaterial).opacity = iOp * 0.9;
    }
    // Stage 3 — Reassemble & zoom to centre (0.72 → 1.0)
    else {
      const t = smoothStep(remap(p, 0.72, 1.0));
      g.position.x = THREE.MathUtils.lerp(2.8, 0, t);
      g.position.y = THREE.MathUtils.lerp(-0.4, 0, t);
      g.scale.setScalar(THREE.MathUtils.lerp(1.65, 1.0, t));
      g.rotation.y += delta * (0.1 + t * 0.35);

      const cf = 0.07;
      if (leftRef.current) leftRef.current.position.x *= 1 - cf;
      if (rightRef.current) rightRef.current.position.x *= 1 - cf;
      if (internalRef.current) {
        internalRef.current.children.forEach((c) => {
          if (c instanceof THREE.Mesh) {
            const m = c.material as THREE.MeshStandardMaterial;
            m.opacity = Math.max(0, m.opacity * (1 - cf));
          }
        });
      }
      if (flowRef.current) {
        const m = flowRef.current.material as THREE.MeshStandardMaterial;
        m.opacity = Math.max(0, m.opacity * (1 - cf));
      }
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight ref={lightRef} intensity={1.8} color="#60a5fa" distance={14} />

      {/* Two half-shells that split apart */}
      <mesh ref={leftRef} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 6, 64, 1, false, 0, Math.PI]} />
        <ShellMat />
      </mesh>
      <mesh ref={rightRef} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 6, 64, 1, false, 0, Math.PI]} />
        <ShellMat />
      </mesh>

      {/* Flanges at both ends */}
      {([-3, 3] as number[]).map((y, idx) => (
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
      ))}

      {/* Internal structure — revealed during split */}
      <group ref={internalRef}>
        <mesh>
          <cylinderGeometry args={[0.47, 0.47, 5.9, 64]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={5}
            transparent
            opacity={0}
            wireframe
          />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.39, 0.39, 5.86, 32]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#60a5fa"
            emissiveIntensity={3}
            transparent
            opacity={0}
          />
        </mesh>
      </group>

      {/* Animated liquid flow */}
      <mesh ref={flowRef}>
        <cylinderGeometry args={[0.35, 0.35, 5.82, 32, 16]} />
        <MeshDistortMaterial
          color="#1e40af"
          emissive="#3b82f6"
          emissiveIntensity={3}
          speed={6}
          distort={0.45}
          radius={1}
          transparent
          opacity={0}
        />
      </mesh>

      {/* HUD scan rings */}
      {([2.4, 1.2, 0, -1.2, -2.4] as number[]).map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh>
            <torusGeometry args={[0.53, 0.006, 16, 128]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.55, 0.57, 64]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={2}
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── camera that zooms in as the user scrolls ──────────────────────────────────
function DynamicCamera({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const ref = useRef<THREE.PerspectiveCamera>(null);
  useFrame(() => {
    if (!ref.current) return;
    const p = scrollProgress.get();
    ref.current.fov = THREE.MathUtils.lerp(38, 27, p);
    ref.current.position.z = THREE.MathUtils.lerp(9, 6.8, p);
    ref.current.updateProjectionMatrix();
  });
  return <PerspectiveCamera ref={ref} makeDefault position={[0, 0, 9]} fov={38} />;
}

function Scene({ scrollProgress, isDark }: { scrollProgress: MotionValue<number>; isDark: boolean }) {
  const fogColor  = isDark ? '#020617' : '#c8d5e8';
  const bgColor   = isDark ? '#010410' : '#e8eef8';
  const gridColor = isDark ? '#0a1428' : '#a8bdd4';

  return (
    <>
      <DynamicCamera scrollProgress={scrollProgress} />
      <fog attach="fog" args={[fogColor, 6, 28]} />
      <ambientLight intensity={0.1} />
      <spotLight
        position={[20, 20, 20]}
        angle={0.15}
        penumbra={1}
        intensity={8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-15, 10, -10]} intensity={4} color="#3b82f6" />
      <pointLight position={[15, -10, 10]} intensity={4} color="#1d4ed8" />
      <pointLight position={[0, 15, 5]} intensity={3} color="#ffffff" />

      <PipeModel scrollProgress={scrollProgress} />

      <Sparkles count={100} scale={14} size={3} speed={0.4} opacity={0.28} color="#60a5fa" />
      <Sparkles count={50} scale={20} size={1.5} speed={0.25} opacity={0.1} color="#ffffff" />

      {/* Inner Suspense so the HDR download never blocks the outer page.tsx Suspense boundary.
          The canvas renders immediately; env map layers in once the network fetch completes. */}
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
      <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={30} blur={2.5} far={6} />

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
const STAGE_CENTERS = [0.05, 0.31, 0.57, 0.87] as const;

export const PipeShowcase3D = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <div ref={containerRef} className="h-[450vh] w-full bg-background relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* 3D Canvas */}
        <Canvas
          shadows
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.shadowMap.type = THREE.PCFShadowMap;
          }}
        >
          <Scene scrollProgress={scrollYProgress} isDark={isDark} />
          <BakeShadows />
        </Canvas>

        {/* Dot-grid overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(59,130,246,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.055)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />

        {/* Scroll-driven text overlays */}
        <div className="absolute inset-0 pointer-events-none">

          {/* 1 — Hero: visible from the start, fades slowly and is fully gone by 18% (when DI Pipe section starts) */}
          <TextSection
            scrollProgress={scrollYProgress}
            inStart={0} peakStart={0.001} peakEnd={0.04} outEnd={0.15}
            align="center"
            verticalAlign="top"
            startVisible
          >
            <div className="text-center">
              <span className="text-primary font-black tracking-[1em] uppercase text-xs md:text-sm mb-4 block">
                Precision // Resilience // Quality
              </span>
              <h1 className="text-[3rem] md:text-[6rem] font-black text-white mix-blend-difference tracking-[-0.05em] uppercase italic leading-[0.85]">
                SANGHI
                <br />
                <span className="stroke-text text-transparent not-italic block mt-2">
                  PIPES & TUBES
                </span>
              </h1>
              <div className="flex items-center justify-center gap-8 mt-5">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                <p className="text-sm text-muted-foreground font-light tracking-[0.5em] uppercase">
                  Double Flanged Pipes &amp; OPVC Pipes
                </p>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              </div>
            </div>
          </TextSection>

          {/* 2 — Double Flanged Pipe specs */}
          <TextSection
            scrollProgress={scrollYProgress}
            inStart={0.18} peakStart={0.24} peakEnd={0.38} outEnd={0.45}
            align="left"
          >
            <div className="max-w-xl">
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
                20+ years of centrifugal casting expertise. Our DI Double Flange Pipes combine
                tensile strength with precision-machined flanged ends — engineered for pump houses,
                bridge crossings, and critical installations.
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

          {/* 3 — Internal analysis panel: stays fully visible through pipe reassembly */}
          <TextSection
            scrollProgress={scrollYProgress}
            inStart={0.44} peakStart={0.50} peakEnd={0.74} outEnd={0.88}
            align="right"
          >
            <div className="max-w-sm bg-background/85 backdrop-blur-2xl p-8 rounded-[2rem] border border-border/30 shadow-2xl relative">
              <div className="absolute top-0 right-8 px-4 py-1 bg-primary rounded-b-xl text-[9px] font-black uppercase tracking-widest italic">
                Internal Scan
              </div>
              <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter mb-1 mt-4">
                Molecular{' '}
                <span className="text-primary not-italic">Integrity</span>
              </h3>
              <p className="text-muted-foreground text-xs font-medium mb-6">
                Scanning structural layers...
              </p>
              <div className="space-y-5">
                {[
                  { label: 'Casting Density', p: 98 },
                  { label: 'Lining Adhesion', p: 95 },
                  { label: 'Joint Tolerance', p: 99 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1.5 text-[8px] font-black uppercase tracking-widest">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-primary font-mono">{item.p}%</span>
                    </div>
                    <div className="h-0.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.p}%` }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
                  <div className="text-[8px] text-primary font-black uppercase tracking-widest mb-1">
                    Coating
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Bitumen · ISO 8179-1
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
                  <div className="text-[8px] text-primary font-black uppercase tracking-widest mb-1">
                    Joint
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">Push-on Tyton</div>
                </div>
              </div>
            </div>
          </TextSection>

          {/* 4 — Final stats: starts after section 3 fades, no overlap with section 1 */}
          <TextSection
            scrollProgress={scrollYProgress}
            inStart={0.83} peakStart={0.90} peakEnd={0.97} outEnd={1.0}
            align="center"
          >
            <div className="text-center">
              <h2 className="text-[5rem] md:text-[10rem] font-black text-white mix-blend-difference mb-8 tracking-tighter uppercase italic leading-[0.85]">
                BUILT
                <br />
                <span className="text-primary not-italic">TO LAST</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-14 max-w-3xl mx-auto font-light uppercase tracking-tight leading-tight">
                50+ Years of Industry Excellence.{' '}
                <span className="text-foreground font-bold italic">20+ Years of Double Flanged Pipe Manufacturing.</span>
              </p>
              <div className="flex flex-wrap justify-center gap-14">
                {[
                  { l: 'Industry Experience', v: '50+ Yrs' },
                  { l: 'Quality Audits', v: '100%' },
                  { l: 'Service Life', v: '100+ Yrs' },
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
