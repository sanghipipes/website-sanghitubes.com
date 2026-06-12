'use client';

import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  PerspectiveCamera,
  OrbitControls,
  Float,
  ContactShadows,
  Environment,
} from '@react-three/drei';
import * as THREE from 'three';

export interface InteractiveProductModelProps {
  type: string;
  color?: string;
  metalness?: number;
  roughness?: number;
}

// Creates a shared Three.js material — called at the top level of each model component
function useMat(color: string, metalness: number, roughness: number) {
  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness,
        roughness,
        envMapIntensity: 2.5,
        clearcoat: metalness > 0.5 ? 0.8 : 0.2,
        clearcoatRoughness: 0.15,
      }),
    [color, metalness, roughness],
  );
}

// ── Shared flange disk — defined at module level so React reference is stable ──
function FlangeDisk({
  y,
  mat,
  boltMat,
}: {
  y: number;
  mat: THREE.MeshPhysicalMaterial;
  boltMat: THREE.MeshPhysicalMaterial;
}) {
  return (
    <group position={[0, y, 0]}>
      <mesh material={mat}>
        <cylinderGeometry args={[0.7, 0.7, 0.2, 48]} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} material={boltMat} position={[Math.cos(a) * 0.57, 0, Math.sin(a) * 0.57]}>
            <cylinderGeometry args={[0.035, 0.035, 0.26, 8]} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Flanged Pipe (DI/CI Double Flange) ────────────────────────────────────────
function FlangedPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f172a', metalness: 1, roughness: 0.2 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.88}>
      {/* Main barrel — elongated for realism */}
      <mesh material={mat}>
        <cylinderGeometry args={[0.42, 0.42, 3.2, 48, 1, true]} />
      </mesh>
      {/* Bevel collars at each end (transition from barrel to flange) */}
      {([-1.6, 1.6] as number[]).map((y, i) => (
        <mesh key={i} material={mat} position={[0, y, 0]}>
          <cylinderGeometry args={[0.55, 0.42, 0.12, 48]} />
        </mesh>
      ))}
      <FlangeDisk y={1.7} mat={mat} boltMat={boltMat} />
      <FlangeDisk y={-1.7} mat={mat} boltMat={boltMat} />
    </group>
  );
}

// ── CI Double Flanged Pipe ────────────────────────────────────────────────────
function CIFlangedPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#1a1a1a', metalness: 0.9, roughness: 0.3 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.88}>
      {/* Shorter, stockier barrel — CI pipes are chunkier */}
      <mesh material={mat}>
        <cylinderGeometry args={[0.45, 0.45, 2.4, 48, 1, true]} />
      </mesh>
      {/* Double bevel collar per end — heavier CI casting look */}
      {([-1.2, 1.2] as number[]).map((y, i) => (
        <group key={i}>
          <mesh material={mat} position={[0, y, 0]}>
            <cylinderGeometry args={[0.58, 0.45, 0.13, 48]} />
          </mesh>
          <mesh material={mat} position={[0, y + (i === 1 ? 0.12 : -0.12), 0]}>
            <cylinderGeometry args={[0.65, 0.58, 0.1, 48]} />
          </mesh>
        </group>
      ))}
      {/* Centre reinforcing ring — visible CI manufacturing feature */}
      <mesh material={mat} position={[0, 0, 0]}>
        <torusGeometry args={[0.48, 0.055, 16, 48]} />
      </mesh>
      <FlangeDisk y={1.43}  mat={mat} boltMat={boltMat} />
      <FlangeDisk y={-1.43} mat={mat} boltMat={boltMat} />
    </group>
  );
}

// ── CI Socket & Spigot Pipe (lead-caulked joint) ──────────────────────────────
function CISSPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.88}>
      {/* Barrel — slightly wider than DI S&S */}
      <mesh material={mat}>
        <cylinderGeometry args={[0.42, 0.42, 2.6, 64, 1, true]} />
      </mesh>
      {/* Wide, boxy socket bell — lead-caulked joint is wider/flatter than Tyton */}
      <mesh material={mat} position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.72, 0.42, 0.45, 64]} />
      </mesh>
      {/* Flat socket top cap */}
      <mesh material={mat} position={[0, 1.525, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.05, 64]} />
      </mesh>
      {/* Collar ring at base of socket bell — CI reinforcement detail */}
      <mesh material={mat} position={[0, 1.075, 0]}>
        <torusGeometry args={[0.5, 0.045, 16, 64]} />
      </mesh>
      {/* Spigot end cap */}
      <mesh material={mat} position={[0, -1.3, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.05, 64]} />
      </mesh>
    </group>
  );
}

// ── Socket & Spigot Pipe (DI/CI Spun S&S) ────────────────────────────────────
function SSPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.88}>
      <mesh material={mat}>
        <cylinderGeometry args={[0.4, 0.4, 2.8, 64, 1, true]} />
      </mesh>
      {/* Bell / socket end */}
      <mesh material={mat} position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.56, 0.4, 0.38, 64]} />
      </mesh>
      <mesh material={mat} position={[0, 1.59, 0]}>
        <cylinderGeometry args={[0.56, 0.56, 0.1, 64, 1, true]} />
      </mesh>
      {/* Spigot end cap */}
      <mesh material={mat} position={[0, -1.4, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 64]} />
      </mesh>
    </group>
  );
}

// ── Sluice / Gate Valve ───────────────────────────────────────────────────────
function GateValve({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const wheelMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#dc2626', metalness: 0.7, roughness: 0.4 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.32; });

  return (
    <group ref={ref} scale={0.82}>
      {/* Body */}
      <mesh material={mat}>
        <boxGeometry args={[1.0, 0.85, 0.75]} />
      </mesh>
      {/* Inlet / outlet ports */}
      {([-0.7, 0.7] as const).map((x, i) => (
        <mesh key={i} material={mat} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.45, 32]} />
        </mesh>
      ))}
      {/* Port flanges */}
      {([-0.93, 0.93] as const).map((x, i) => (
        <mesh key={i} material={mat} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.45, 0.45, 0.12, 32]} />
        </mesh>
      ))}
      {/* Bonnet */}
      <mesh material={mat} position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.26, 0.32, 0.45, 16]} />
      </mesh>
      {/* Stem */}
      <mesh material={mat} position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.7, 12]} />
      </mesh>
      {/* Handwheel rim */}
      <mesh material={wheelMat} position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.038, 12, 48]} />
      </mesh>
      {/* Spokes */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} material={wheelMat} position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, (i / 4) * Math.PI * 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.88, 8]} />
        </mesh>
      ))}
      {/* Hub */}
      <mesh material={wheelMat} position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.12, 12]} />
      </mesh>
    </group>
  );
}

// ── Air Valve ─────────────────────────────────────────────────────────────────
function AirValve({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const capMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#f59e0b', metalness: 0.8, roughness: 0.3 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.5; });

  return (
    <group ref={ref} scale={0.85}>
      {/* Cylindrical body */}
      <mesh material={mat}>
        <cylinderGeometry args={[0.38, 0.38, 0.95, 32]} />
      </mesh>
      {/* Dome top — hemisphere sealing the pressure vessel */}
      <mesh material={mat} position={[0, 0.475, 0]}>
        <sphereGeometry args={[0.38, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* Orifice boss — small raised boss on dome */}
      <mesh material={mat} position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.10, 0.14, 0.16, 16]} />
      </mesh>
      {/* Orifice cap — small amber ball at very top */}
      <mesh material={capMat} position={[0, 0.96, 0]}>
        <sphereGeometry args={[0.065, 12, 12]} />
      </mesh>
      {/* Bottom collar — tapers to flange */}
      <mesh material={mat} position={[0, -0.54, 0]}>
        <cylinderGeometry args={[0.48, 0.38, 0.10, 32]} />
      </mesh>
      {/* Bottom flange */}
      <mesh material={mat} position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.12, 32]} />
      </mesh>
      {/* Inlet stub */}
      <mesh material={mat} position={[0, -0.78, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.24, 16]} />
      </mesh>
    </group>
  );
}

// ── Butterfly Valve ───────────────────────────────────────────────────────────
function ButterflyValve({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const discMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#dc2626', metalness: 0.9, roughness: 0.15 }), []);
  const discRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.32;
    if (discRef.current) discRef.current.rotation.y = (Math.sin(state.clock.elapsedTime * 0.9) * 0.5 + 0.5) * (Math.PI / 3);
  });

  return (
    <group ref={ref} scale={0.82} rotation={[Math.PI / 12, 0, 0]}>
      {/* Body ring — slightly tilted group so disc face is visible from camera */}
      <mesh material={mat} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.66, 0.22, 24, 64]} />
      </mesh>
      {/* Pipe stub flanges — moved outward so torus ring body is clearly visible */}
      {([-1.08, 1.08] as const).map((x, i) => (
        <group key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={mat}>
            <cylinderGeometry args={[0.52, 0.52, 0.28, 32, 1, true]} />
          </mesh>
          <mesh material={mat} position={[0, -0.20, 0]}>
            <cylinderGeometry args={[0.72, 0.72, 0.12, 32]} />
          </mesh>
        </group>
      ))}
      {/* Rotating disc */}
      <mesh ref={discRef} material={discMat}>
        <cylinderGeometry args={[0.58, 0.58, 0.07, 64]} />
      </mesh>
      {/* Stem */}
      <mesh material={mat} position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.48, 12]} />
      </mesh>
      {/* Gearbox */}
      <mesh material={mat} position={[0, 1.18, 0]}>
        <boxGeometry args={[0.32, 0.28, 0.22]} />
      </mesh>
    </group>
  );
}

// ── Non-Return / Swing Check Valve ────────────────────────────────────────────
function CheckValve({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const flapMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#b91c1c', metalness: 0.9, roughness: 0.2 }), []);
  const flapRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.35;
    if (flapRef.current) flapRef.current.rotation.z = -0.35 + Math.sin(state.clock.elapsedTime * 1.1) * 0.22;
  });

  return (
    <group ref={ref} scale={0.82} rotation={[0, Math.PI / 8, 0]}>
      {/* Main body — cylinder explicitly rotated to lie horizontal */}
      <mesh material={mat} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.52, 0.52, 1.9, 48]} />
      </mesh>
      {/* End flanges — at x=±0.98, correctly capping each end of the horizontal body */}
      {([-0.98, 0.98] as const).map((x, i) => (
        <mesh key={i} material={mat} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.7, 0.7, 0.16, 48]} />
        </mesh>
      ))}
      {/* Bonnet — dome sitting on top of the body */}
      <mesh material={mat} position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.24, 0.30, 0.30, 16]} />
      </mesh>
      <mesh material={mat} position={[0, 0.73, 0]}>
        <sphereGeometry args={[0.24, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* Swing flap — red disc, rotated to face the flow direction */}
      <mesh ref={flapRef} material={flapMat} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 32]} />
      </mesh>
    </group>
  );
}

// ── Pipe Elbow / DI Specials ──────────────────────────────────────────────────
function PipeElbow({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  // 90° elbow: torus arc (XY plane), offset so it's centered
  return (
    <group ref={ref} scale={0.9} position={[-0.28, -0.28, 0]}>
      {/* Curved section */}
      <mesh material={mat}>
        <torusGeometry args={[0.58, 0.24, 24, 64, Math.PI / 2]} />
      </mesh>
      {/* Horizontal stub */}
      <mesh material={mat} position={[0.58 + 0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.76, 32]} />
      </mesh>
      {/* Horizontal flange */}
      <mesh material={mat} position={[0.58 + 0.78, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.13, 48]} />
      </mesh>
      {/* Vertical stub */}
      <mesh material={mat} position={[0, 0.58 + 0.38, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.76, 32]} />
      </mesh>
      {/* Vertical flange */}
      <mesh material={mat} position={[0, 0.58 + 0.78, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.13, 48]} />
      </mesh>
    </group>
  );
}

// ── HDPE Pipe ─────────────────────────────────────────────────────────────────
function HDPEPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const stripeMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#2563eb', metalness: 0, roughness: 0.6 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.88} rotation={[Math.PI / 10, 0, 0]}>
      {/* Main barrel */}
      <mesh material={mat}>
        <cylinderGeometry args={[0.44, 0.44, 3.0, 48, 1, true]} />
      </mesh>
      {/* Blue longitudinal stripes */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
        <mesh key={i} material={stripeMat}
          position={[Math.cos(angle) * 0.453, 0, Math.sin(angle) * 0.453]}>
          <boxGeometry args={[0.022, 3.0, 0.022]} />
        </mesh>
      ))}
      {/* End rings */}
      {([-1.5, 1.5] as const).map((y, i) => (
        <mesh key={i} material={mat} position={[0, y, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 0.04, 48]} />
        </mesh>
      ))}
    </group>
  );
}

// ── Electrofusion Coupler ─────────────────────────────────────────────────────
function EFCoupler({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const wireMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#60a5fa',
    metalness: 1,
    roughness: 0.1,
    emissive: '#3b82f6',
    emissiveIntensity: 0.8,
  }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.45; });

  return (
    <group ref={ref} scale={0.9} rotation={[Math.PI / 8, 0, 0]}>
      {/* Body */}
      <mesh material={mat}>
        <cylinderGeometry args={[0.52, 0.52, 1.75, 48, 1, true]} />
      </mesh>
      {/* Embedded EF coil rings */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} material={wireMat} position={[0, -0.72 + i * 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.014, 8, 48]} />
        </mesh>
      ))}
      {/* End rings */}
      {([-0.875, 0.875] as const).map((y, i) => (
        <mesh key={i} material={mat} position={[0, y, 0]}>
          <cylinderGeometry args={[0.52, 0.52, 0.055, 48]} />
        </mesh>
      ))}
      {/* Terminal pins */}
      {([-0.14, 0.14] as const).map((x, i) => (
        <mesh key={i} material={wireMat} position={[x, 0.89, 0.51]}>
          <cylinderGeometry args={[0.038, 0.038, 0.16, 8]} />
        </mesh>
      ))}
    </group>
  );
}

// ── DWC (Double Wall Corrugated) Pipe ─────────────────────────────────────────
function DWCPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const outerMat = useMat(color, metalness, roughness);
  const innerMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#e2e8f0', metalness: 0, roughness: 0.55 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.38; });

  return (
    <group ref={ref} scale={0.88} rotation={[Math.PI / 10, 0, 0]}>
      {/* Smooth inner wall */}
      <mesh material={innerMat}>
        <cylinderGeometry args={[0.33, 0.33, 2.6, 48, 1, true]} />
      </mesh>
      {/* Corrugated outer rings */}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={i} material={outerMat} position={[0, -1.14 + i * 0.175, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.088, 12, 48]} />
        </mesh>
      ))}
    </group>
  );
}

// ── OPVC Pipe ─────────────────────────────────────────────────────────────────
function OPVCPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  // Industry OPVC: light grey/cream body
  const bodyColor = color === '#cbd5e1' || color === '#e2e8f0' ? color : '#dde3ea';
  const mat = useMat(bodyColor, metalness, roughness);
  // Blue-grey pressure-class band (characteristic of OPVC)
  const bandMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#4b80a0', metalness: 0, roughness: 0.6 }), []);
  // Rubber ring seal (dark grey)
  const sealMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#374151', metalness: 0, roughness: 0.85 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.38; });

  return (
    <group ref={ref} scale={0.88}>
      {/* Main barrel */}
      <mesh material={mat}>
        <cylinderGeometry args={[0.41, 0.41, 2.6, 48, 1, true]} />
      </mesh>
      {/* Push-fit socket end (bell) — flares out at the top */}
      <mesh material={mat} position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.54, 0.41, 0.36, 48]} />
      </mesh>
      {/* Socket rim cap */}
      <mesh material={mat} position={[0, 1.62, 0]}>
        <cylinderGeometry args={[0.54, 0.54, 0.08, 48, 1, true]} />
      </mesh>
      {/* Rubber ring groove inside bell */}
      <mesh material={sealMat} position={[0, 1.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.435, 0.038, 12, 48]} />
      </mesh>
      {/* Pressure-class colour band near bell end */}
      <mesh material={bandMat} position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.415, 0.415, 0.1, 48]} />
      </mesh>
      {/* Spigot end cap */}
      <mesh material={mat} position={[0, -1.3, 0]}>
        <cylinderGeometry args={[0.41, 0.41, 0.05, 48]} />
      </mesh>
    </group>
  );
}

// ── TMT Rebar ─────────────────────────────────────────────────────────────────
function TMTBar({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const ribMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#9ca3af', metalness: 0.85, roughness: 0.35 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.35; });

  return (
    <group ref={ref} rotation={[Math.PI / 2.8, 0, 0]} scale={0.9}>
      {/* Bar core */}
      <mesh material={mat}>
        <cylinderGeometry args={[0.17, 0.17, 3.4, 16]} />
      </mesh>
      {/* Transverse ribs */}
      {Array.from({ length: 17 }).map((_, i) => (
        <mesh key={i} material={ribMat} position={[0, -1.55 + i * 0.194, 0]} rotation={[Math.PI / 5, 0, 0]}>
          <torusGeometry args={[0.18, 0.033, 8, 24]} />
        </mesh>
      ))}
      {/* Longitudinal rib lines */}
      {[0, Math.PI].map((angle, i) => (
        <mesh key={i} material={ribMat} position={[Math.cos(angle) * 0.19, 0, Math.sin(angle) * 0.19]}>
          <boxGeometry args={[0.02, 3.4, 0.02]} />
        </mesh>
      ))}
    </group>
  );
}

// ── Hex Bolt & Nut ────────────────────────────────────────────────────────────
function HexBolt({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const nutMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#6b7280', metalness: 0.95, roughness: 0.12 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.5; });

  return (
    <group ref={ref} scale={0.85}>
      {/* Hex head */}
      <mesh material={mat} position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.38, 6]} />
      </mesh>
      {/* Bearing face chamfer */}
      <mesh material={mat} position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.24, 0.31, 0.09, 24]} />
      </mesh>
      {/* Shank */}
      <mesh material={mat} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.46, 24]} />
      </mesh>
      {/* Thread helix (approximated as rings) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} material={mat} position={[0, 0.63 - i * 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.205, 0.013, 6, 24]} />
        </mesh>
      ))}
      {/* Washer */}
      <mesh material={nutMat} position={[0, -0.63, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.055, 32]} />
      </mesh>
      {/* Hex nut */}
      <mesh material={nutMat} position={[0, -0.84, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.27, 6]} />
      </mesh>
    </group>
  );
}

// ── GI Pipe (Galvanized — shiny silver) ───────────────────────────────────────
function GIPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const threadMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#d1d5db', metalness: 0.95, roughness: 0.1 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.88} rotation={[Math.PI / 10, 0, 0]}>
      <mesh material={mat}>
        <cylinderGeometry args={[0.38, 0.38, 2.9, 48, 1, true]} />
      </mesh>
      {/* Threaded end sections */}
      {([-1.35, 1.35] as const).map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          {Array.from({ length: 6 }).map((_, j) => (
            <mesh key={j} material={threadMat} position={[0, j * 0.07 - 0.175, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.385, 0.012, 6, 32]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ── GI Elbow (malleable iron screwed fitting — threaded ends, no flanges) ─────
function GIElbow({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const threadMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#d1d5db', metalness: 0.95, roughness: 0.1,
  }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.9} position={[-0.28, -0.28, 0]}>
      {/* Curved section at origin — same coordinate system as PipeElbow */}
      <mesh material={mat}>
        <torusGeometry args={[0.58, 0.22, 24, 48, Math.PI / 2]} />
      </mesh>
      {/* Horizontal arm */}
      <mesh material={mat} position={[0.90, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.64, 32]} />
      </mesh>
      {/* Horizontal thread rings at arm end */}
      {([1.25, 1.31, 1.37, 1.43, 1.49] as const).map((x, i) => (
        <mesh key={i} material={threadMat} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.225, 0.013, 6, 24]} />
        </mesh>
      ))}
      {/* Vertical arm */}
      <mesh material={mat} position={[0, 0.90, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.64, 32]} />
      </mesh>
      {/* Vertical thread rings at arm end */}
      {([1.25, 1.31, 1.37, 1.43, 1.49] as const).map((y, i) => (
        <mesh key={i} material={threadMat} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.225, 0.013, 6, 24]} />
        </mesh>
      ))}
    </group>
  );
}

// ── HDPE Elbow (PE socket ends — no flanges) ──────────────────────────────────
function HDPEElbow({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.9} position={[-0.28, -0.28, 0]}>
      {/* Curved section — same coordinate system as PipeElbow */}
      <mesh material={mat}>
        <torusGeometry args={[0.58, 0.24, 24, 64, Math.PI / 2]} />
      </mesh>
      {/* Horizontal stub */}
      <mesh material={mat} position={[0.96, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.76, 32]} />
      </mesh>
      {/* Horizontal socket end — slight taper (HDPE butt-fusion, no flange) */}
      <mesh material={mat} position={[1.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.24, 0.16, 32]} />
      </mesh>
      {/* Vertical stub */}
      <mesh material={mat} position={[0, 0.96, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.76, 32]} />
      </mesh>
      {/* Vertical socket end */}
      <mesh material={mat} position={[0, 1.38, 0]}>
        <cylinderGeometry args={[0.28, 0.24, 0.16, 32]} />
      </mesh>
    </group>
  );
}

// ── Pipe Tee (DI flanged T-junction — three flanged ports) ────────────────────
function PipeTee({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#0f172a', metalness: 1, roughness: 0.2,
  }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.38; });

  const PIPE_R = 0.24;
  const ARM_LEN = 0.70;
  const FLANGE_R = 0.40;
  const FLANGE_H = 0.13;
  const BOLT_R = 0.32;

  // +Y (top run), -Y (bottom run), +X (side branch)
  const armRots: [number, number, number][] = [
    [0, 0, 0],
    [0, 0, Math.PI],
    [0, 0, -Math.PI / 2],
  ];

  return (
    <group ref={ref} scale={0.80} rotation={[Math.PI / 8, Math.PI / 5, 0]}>
      {/* Central junction sphere */}
      <mesh material={mat}>
        <sphereGeometry args={[PIPE_R * 1.35, 32, 32]} />
      </mesh>
      {armRots.map((rot, ai) => (
        <group key={ai} rotation={rot}>
          <mesh material={mat} position={[0, ARM_LEN / 2, 0]}>
            <cylinderGeometry args={[PIPE_R, PIPE_R, ARM_LEN, 32]} />
          </mesh>
          <mesh material={mat} position={[0, ARM_LEN + FLANGE_H / 2, 0]}>
            <cylinderGeometry args={[FLANGE_R, FLANGE_R, FLANGE_H, 48]} />
          </mesh>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <mesh key={i} material={boltMat}
                position={[Math.cos(a) * BOLT_R, ARM_LEN + FLANGE_H / 2, Math.sin(a) * BOLT_R]}>
                <cylinderGeometry args={[0.028, 0.028, 0.20, 8]} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

// ── MS Pipe (Mild Steel — bevelled ends, raw dark steel) ──────────────────────
function MSPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const bevelMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#3d3d3d', metalness: 0.75, roughness: 0.5,
    envMapIntensity: 2.5, clearcoat: 0.3, clearcoatRoughness: 0.2,
  }), []);
  const boreMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#1a1a1a', metalness: 0.6, roughness: 0.7, envMapIntensity: 1.0,
  }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.88} rotation={[Math.PI / 10, 0, 0]}>
      {/* Main barrel — open-ended raw steel cylinder */}
      <mesh material={mat}>
        <cylinderGeometry args={[0.38, 0.38, 3.0, 48, 1, true]} />
      </mesh>
      {/* Bevel collar at each end — angled chamfer for weld-prep (30–35°) */}
      {([-1.5, 1.5] as const).map((y, i) => (
        <mesh key={i}
          material={bevelMat}
          position={[0, y + (i === 0 ? 0.03 : -0.03), 0]}
          rotation={[i === 0 ? 0 : Math.PI, 0, 0]}
        >
          <cylinderGeometry args={[0.43, 0.38, 0.06, 48]} />
        </mesh>
      ))}
      {/* Annular bore face — shows the pipe wall cross-section at each end */}
      {([-1.53, 1.53] as const).map((y, i) => (
        <mesh key={i} material={boreMat} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.29, 0.38, 48]} />
        </mesh>
      ))}
    </group>
  );
}

// ── Dispatch model by type ─────────────────────────────────────────────────────
function ModelGeometry({ type, color = '#cbd5e1', metalness = 1, roughness = 0.2 }: InteractiveProductModelProps) {
  const p = { color, metalness, roughness };
  switch (type) {
    case 'flanged-pipe':    return <FlangedPipe {...p} />;
    case 'ci-flanged-pipe': return <CIFlangedPipe {...p} />;
    case 'ss-pipe':         return <SSPipe {...p} />;
    case 'ci-ss-pipe':      return <CISSPipe {...p} />;
    case 'gate-valve':      return <GateValve {...p} />;
    case 'air-valve':       return <AirValve {...p} />;
    case 'butterfly-valve': return <ButterflyValve {...p} />;
    case 'check-valve':     return <CheckValve {...p} />;
    case 'pipe-elbow':      return <PipeElbow {...p} />;
    case 'hdpe-pipe':       return <HDPEPipe {...p} />;
    case 'ef-coupler':      return <EFCoupler {...p} />;
    case 'dwc-pipe':        return <DWCPipe {...p} />;
    case 'opvc-pipe':       return <OPVCPipe {...p} />;
    case 'tmt-bar':         return <TMTBar {...p} />;
    case 'bolt':            return <HexBolt {...p} />;
    case 'gi-pipe':         return <GIPipe {...p} />;
    case 'ms-pipe':         return <MSPipe {...p} />;
    case 'hdpe-elbow':      return <HDPEElbow {...p} />;
    case 'pipe-tee':        return <PipeTee {...p} />;
    case 'gi-elbow':        return <GIElbow {...p} />;
    default:
      return (
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.4, 0.4, 3, 64]} />
          <meshPhysicalMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>
      );
  }
}

export const InteractiveProductModel = ({ type, color, metalness, roughness }: InteractiveProductModelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Only create the WebGL Canvas once the card is visible — prevents Chrome's
  // 8-context limit from evicting the first products when 20 canvases mount at once.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '150px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing">
      {visible && (
      <Canvas
        shadows
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => { gl.shadowMap.type = THREE.PCFShadowMap; }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
        <ambientLight intensity={0.35} />
        <spotLight position={[10, 10, 10]} intensity={2.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1.2} color="#3b82f6" />
        <pointLight position={[5, 5, -5]} intensity={0.6} color="#60a5fa" />

        <Float speed={1.4} rotationIntensity={0} floatIntensity={0.45}>
          <ModelGeometry type={type} color={color} metalness={metalness} roughness={roughness} />
        </Float>

        <OrbitControls enableZoom={false} autoRotate={false} makeDefault rotateSpeed={0.5} />
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>
        <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={15} blur={3} far={4} />
      </Canvas>
      )}
    </div>
  );
};
