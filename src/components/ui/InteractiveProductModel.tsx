'use client';

import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, events as createPointerEvents } from '@react-three/fiber';
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

// R3F connects pointer-event listeners in an async callback that runs after the
// WebGL context finishes configuring. Because product canvases are lazily
// mounted/unmounted as cards scroll or get filtered, a card can unmount before
// that callback fires — leaving the event target null and crashing inside
// connect() (`Cannot read properties of null (reading 'addEventListener')`).
// Wrap the default events manager so connect simply no-ops when the target is
// missing; everything else (OrbitControls, hover, etc.) behaves normally.
const safePointerEvents = (store: Parameters<typeof createPointerEvents>[0]) => {
  const manager = createPointerEvents(store);
  const origConnect = manager.connect?.bind(manager);
  return {
    ...manager,
    connect: (target: HTMLElement) => {
      if (target && origConnect) origConnect(target);
    },
  };
};

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

// Dark interior material for hollow pipe bores — a deep, matte shade derived from the
// pipe colour, double-sided so the inner wall and end-rims render from any angle.
function useBoreMat(color: string) {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color).multiplyScalar(0.45),
        roughness: 0.9,
        metalness: 0.2,
        side: THREE.DoubleSide,
      }),
    [color],
  );
}

// ── Shared flange disk — defined at module level so React reference is stable ──
// When `boreR`/`boreMat` are supplied the flange face is annular (open bore through the
// centre) so the pipe reads as genuinely hollow; otherwise it stays a solid disk.
function FlangeDisk({
  y,
  mat,
  boltMat,
  boreR,
  boreMat,
}: {
  y: number;
  mat: THREE.MeshPhysicalMaterial;
  boltMat: THREE.MeshPhysicalMaterial;
  boreR?: number;
  boreMat?: THREE.Material;
}) {
  // Double-sided clone of the flange material so the annular face renders from any angle.
  const faceMat = useMemo(() => {
    const m = mat.clone();
    m.side = THREE.DoubleSide;
    return m;
  }, [mat]);
  return (
    <group position={[0, y, 0]}>
      {boreR != null && boreMat ? (
        <>
          {/* Outer rim of the flange ring */}
          <mesh material={mat}>
            <cylinderGeometry args={[0.7, 0.7, 0.2, 48, 1, true]} />
          </mesh>
          {/* Bore wall through the flange */}
          <mesh material={boreMat}>
            <cylinderGeometry args={[boreR, boreR, 0.2, 48, 1, true]} />
          </mesh>
          {/* Annular front/back faces showing the bolt-flange face with a hole */}
          {([0.1, -0.1] as number[]).map((dy, i) => (
            <mesh key={i} material={faceMat} position={[0, dy, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[boreR, 0.7, 48]} />
            </mesh>
          ))}
        </>
      ) : (
        <mesh material={mat}>
          <cylinderGeometry args={[0.7, 0.7, 0.2, 48]} />
        </mesh>
      )}
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

// ── Reusable hollow pipe barrel ───────────────────────────────────────────────
// Outer wall + dark inner bore wall (visible looking into the pipe) + an annular rim at
// each open end showing wall thickness. Generalises the open-barrel + bore-face pattern
// already used by MSPipe so every pipe model reads as a real, hollow length of pipe.
function HollowBarrel({
  outerR,
  innerR,
  height,
  segments = 48,
  mat,
  boreMat,
  openTop = true,
  openBottom = true,
}: {
  outerR: number;
  innerR: number;
  height: number;
  segments?: number;
  mat: THREE.MeshPhysicalMaterial;
  boreMat: THREE.Material;
  openTop?: boolean;
  openBottom?: boolean;
}) {
  return (
    <group>
      {/* Outer wall */}
      <mesh material={mat}>
        <cylinderGeometry args={[outerR, outerR, height, segments, 1, true]} />
      </mesh>
      {/* Inner bore wall */}
      <mesh material={boreMat}>
        <cylinderGeometry args={[innerR, innerR, height, segments, 1, true]} />
      </mesh>
      {/* Annular rim at each open end */}
      {openTop && (
        <mesh material={boreMat} position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[innerR, outerR, segments]} />
        </mesh>
      )}
      {openBottom && (
        <mesh material={boreMat} position={[0, -height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[innerR, outerR, segments]} />
        </mesh>
      )}
    </group>
  );
}

// ── Flanged Pipe (DI/CI Double Flange) ────────────────────────────────────────
function FlangedPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  // White cement-mortar lining (DI pipes are cement-lined inside)
  const boreMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#eef1f4', emissive: '#b9c1cc', emissiveIntensity: 0.6, roughness: 0.9, metalness: 0, side: THREE.DoubleSide }), []);
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f172a', metalness: 1, roughness: 0.2 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.88}>
      {/* Main barrel — elongated for realism, hollow bore */}
      <HollowBarrel outerR={0.42} innerR={0.35} height={3.2} mat={mat} boreMat={boreMat} />
      {/* Bevel collars at each end (transition from barrel to flange) — open so bore stays clear */}
      {([-1.6, 1.6] as number[]).map((y, i) => (
        <mesh key={i} material={mat} position={[0, y, 0]}>
          <cylinderGeometry args={[0.55, 0.42, 0.12, 48, 1, true]} />
        </mesh>
      ))}
      <FlangeDisk y={1.7} mat={mat} boltMat={boltMat} boreR={0.35} boreMat={boreMat} />
      <FlangeDisk y={-1.7} mat={mat} boltMat={boltMat} boreR={0.35} boreMat={boreMat} />
    </group>
  );
}

// ── CI Double Flanged Pipe ────────────────────────────────────────────────────
function CIFlangedPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  // White cement-mortar lining (CI pipes are cement-lined inside)
  const boreMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#eef1f4', emissive: '#b9c1cc', emissiveIntensity: 0.6, roughness: 0.9, metalness: 0, side: THREE.DoubleSide }), []);
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#1a1a1a', metalness: 0.9, roughness: 0.3 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.88}>
      {/* Shorter, stockier barrel — CI pipes are chunkier, hollow bore */}
      <HollowBarrel outerR={0.45} innerR={0.38} height={2.4} mat={mat} boreMat={boreMat} />
      {/* Double bevel collar per end — heavier CI casting look, open so bore stays clear */}
      {([-1.2, 1.2] as number[]).map((y, i) => (
        <group key={i}>
          <mesh material={mat} position={[0, y, 0]}>
            <cylinderGeometry args={[0.58, 0.45, 0.13, 48, 1, true]} />
          </mesh>
          <mesh material={mat} position={[0, y + (i === 1 ? 0.12 : -0.12), 0]}>
            <cylinderGeometry args={[0.65, 0.58, 0.1, 48, 1, true]} />
          </mesh>
        </group>
      ))}
      <FlangeDisk y={1.43}  mat={mat} boltMat={boltMat} boreR={0.38} boreMat={boreMat} />
      <FlangeDisk y={-1.43} mat={mat} boltMat={boltMat} boreR={0.38} boreMat={boreMat} />
    </group>
  );
}

// ── CI Socket & Spigot Pipe (lead-caulked joint) ──────────────────────────────
function CISSPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.88}>
      {/* Barrel — slightly wider than DI S&S, hollow bore (open spigot end) */}
      <HollowBarrel outerR={0.42} innerR={0.35} height={2.6} segments={64} mat={mat} boreMat={boreMat} openTop={false} />
      {/* Wide, boxy socket bell — lead-caulked joint, hollow socket showing the bore */}
      <mesh material={mat} position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.72, 0.42, 0.45, 64, 1, true]} />
      </mesh>
      {/* Inner socket bore wall */}
      <mesh material={boreMat} position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.45, 64, 1, true]} />
      </mesh>
      {/* Seat shoulder at base of socket */}
      <mesh material={mat} position={[0, 1.075, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.5, 64]} />
      </mesh>
      {/* Flat socket top rim (wide annular face) */}
      <mesh material={mat} position={[0, 1.525, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.72, 64]} />
      </mesh>
    </group>
  );
}

// ── Socket & Spigot Pipe (DI/CI Spun S&S) ────────────────────────────────────
function SSPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.88}>
      {/* Barrel — hollow bore, open at the spigot end */}
      <HollowBarrel outerR={0.4} innerR={0.33} height={2.8} segments={64} mat={mat} boreMat={boreMat} openTop={false} />
      {/* Bell / socket end — hollow flared socket showing the bore */}
      <mesh material={mat} position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.56, 0.4, 0.4, 64, 1, true]} />
      </mesh>
      {/* Inner socket bore wall */}
      <mesh material={boreMat} position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.47, 0.47, 0.4, 64, 1, true]} />
      </mesh>
      {/* Seat shoulder at base of socket */}
      <mesh material={mat} position={[0, 1.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.33, 0.47, 64]} />
      </mesh>
      {/* Top mouth rim */}
      <mesh material={mat} position={[0, 1.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.47, 0.56, 64]} />
      </mesh>
    </group>
  );
}

// ── Sluice / Gate Valve ───────────────────────────────────────────────────────
function GateValve({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f172a', metalness: 1, roughness: 0.25 }), []);
  const stemMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#cbd5e1', metalness: 1, roughness: 0.22 }), []);
  const bronzeMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#b58a4e', metalness: 1, roughness: 0.32 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.32; });

  return (
    <group ref={ref} scale={0.6} position={[0, -0.42, 0]} rotation={[0, Math.PI / 8, 0]}>
      {/* ── Body — horizontal flow barrel + oval belly ── */}
      <mesh material={mat} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 1.36, 48]} />
      </mesh>
      <mesh material={mat} scale={[1, 1.08, 1]}>
        <sphereGeometry args={[0.58, 40, 28]} />
      </mesh>
      {/* End flanges — raised face + ring of bolt holes */}
      {([-0.82, 0.82] as const).map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh material={mat} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.7, 0.7, 0.16, 48]} />
          </mesh>
          <mesh material={mat} position={[x > 0 ? 0.1 : -0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.5, 0.5, 0.06, 40]} />
          </mesh>
          {Array.from({ length: 8 }).map((_, j) => {
            const a = (j / 8) * Math.PI * 2;
            return (
              <mesh key={j} material={boltMat}
                position={[0, Math.cos(a) * 0.57, Math.sin(a) * 0.57]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.045, 0.045, 0.2, 10]} />
              </mesh>
            );
          })}
        </group>
      ))}
      {/* ── Foot pads at the base ── */}
      {([-0.6, 0.6] as const).map((x, i) => (
        <mesh key={`ft${i}`} material={mat} position={[x, -0.66, 0]}>
          <boxGeometry args={[0.22, 0.1, 0.42]} />
        </mesh>
      ))}
      {/* ── Bolted body↔bonnet joint: oval flange + protruding hex bolts ── */}
      <mesh material={mat} position={[0, 0.42, 0]}>
        <boxGeometry args={[0.92, 0.14, 0.62]} />
      </mesh>
      {([-0.46, 0.46] as const).map((x, i) => (
        <mesh key={`je${i}`} material={mat} position={[x, 0.42, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.14, 28]} />
        </mesh>
      ))}
      {([[0.36, 0.34], [-0.36, 0.34], [0.36, -0.34], [-0.36, -0.34]] as [number, number][]).map(([bx, bz], i) => (
        <mesh key={`jb${i}`} material={boltMat} position={[bx, 0.42, bz]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 6]} />
        </mesh>
      ))}
      {/* ── Bonnet dome (bell) + neck ── */}
      <mesh material={mat} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.34, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh material={mat} position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.2, 28]} />
      </mesh>
      {/* ── Bronze gland nut ── */}
      <mesh material={bronzeMat} position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.12, 24]} />
      </mesh>
      {/* ── Silver yoke frame: two legs + top bridge ── */}
      {([-0.12, 0.12] as const).map((x, i) => (
        <mesh key={`yl${i}`} material={stemMat} position={[x, 1.3, 0]}>
          <boxGeometry args={[0.05, 0.5, 0.05]} />
        </mesh>
      ))}
      <mesh material={stemMat} position={[0, 1.54, 0]}>
        <boxGeometry args={[0.34, 0.07, 0.12]} />
      </mesh>
      {/* ── Silver threaded stem through the yoke ── */}
      <mesh material={stemMat} position={[0, 1.32, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.72, 12]} />
      </mesh>
      {/* ── Solid dished handwheel (blue) ── */}
      <mesh material={mat} position={[0, 1.76, 0]}>
        <cylinderGeometry args={[0.46, 0.3, 0.1, 40]} />
      </mesh>
      <mesh material={mat} position={[0, 1.74, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.055, 14, 48]} />
      </mesh>
      {/* centre hub + stem nut */}
      <mesh material={mat} position={[0, 1.82, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.12, 20]} />
      </mesh>
      <mesh material={boltMat} position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.06, 6]} />
      </mesh>
    </group>
  );
}

// ── Air Valve ─────────────────────────────────────────────────────────────────
function AirValve({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);

  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f172a', metalness: 1, roughness: 0.25 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.5; });

  return (
    <group ref={ref} scale={0.62} position={[0, 0.02, 0]}>
      {/* ── Flanged inlet end at the bottom ── */}
      <mesh material={mat} position={[0, -1.18, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.16, 24]} />
      </mesh>
      <mesh material={mat} position={[0, -1.06, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.12, 40]} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={`bb${i}`} material={boltMat} position={[Math.cos(a) * 0.4, -1.06, Math.sin(a) * 0.4]}>
            <cylinderGeometry args={[0.035, 0.035, 0.16, 10]} />
          </mesh>
        );
      })}
      {/* ── Tall central riser neck ── */}
      <mesh material={mat} position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.27, 0.34, 0.8, 32]} />
      </mesh>
      {/* Saddle widening out to the chambers */}
      <mesh material={mat} position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.78, 0.4, 0.4, 40]} />
      </mesh>
      {/* ── Two oval pot-chambers (rounded cylinders) splaying wide ── */}
      {([-0.4, 0.4] as number[]).map((x, ci) => (
        <mesh key={`ch${ci}`} material={mat} position={[x, 0.16, 0]}>
          <capsuleGeometry args={[0.4, 0.34, 12, 28]} />
        </mesh>
      ))}
      {/* ── Stacked oval split-flange joint (two parallel plates with a gap) ── */}
      {([0.6, 0.74] as number[]).map((y, fi) => (
        <group key={`fl${fi}`}>
          <mesh material={mat} position={[0, y, 0]}>
            <boxGeometry args={[1.3, 0.1, 0.66]} />
          </mesh>
          {([-0.65, 0.65] as number[]).map((x, j) => (
            <mesh key={j} material={mat} position={[x, y, 0]}>
              <cylinderGeometry args={[0.33, 0.33, 0.1, 28]} />
            </mesh>
          ))}
        </group>
      ))}
      {/* ── Oval top cover plate ── */}
      <mesh material={mat} position={[0, 0.86, 0]}>
        <boxGeometry args={[1.22, 0.1, 0.6]} />
      </mesh>
      {([-0.61, 0.61] as number[]).map((x, i) => (
        <mesh key={`tc${i}`} material={mat} position={[x, 0.86, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 28]} />
        </mesh>
      ))}
      {/* ── Four bolt studs sticking UP from the cover corners ── */}
      {([[-0.56, 0.2], [0.56, 0.2], [-0.56, -0.2], [0.56, -0.2]] as [number, number][]).map(([sx, sz], i) => (
        <group key={`st${i}`} position={[sx, 1.02, sz]}>
          <mesh material={boltMat}>
            <cylinderGeometry args={[0.028, 0.028, 0.3, 10]} />
          </mesh>
          <mesh material={boltMat} position={[0, 0.17, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.06, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── Butterfly Valve ───────────────────────────────────────────────────────────
function ButterflyValve({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const discMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#1f2937', metalness: 0.85, roughness: 0.35 }), []);
  const handleMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#111827', metalness: 0.7, roughness: 0.4 }), []);
  const seatMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#6b7280', metalness: 0.2, roughness: 0.85 }), []);
  const stemMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#2b3340', metalness: 0.95, roughness: 0.28 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.32; });

  return (
    <group ref={ref} scale={0.9} rotation={[0.12, 0, 0]}>
      {/* Wafer ring body (blue) — axis along Z so the bore/disc faces the viewer */}
      <mesh material={mat} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.36, 64, 1, true]} />
      </mesh>
      {/* Grey rubber seat liner inside the bore */}
      <mesh material={seatMat} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.34, 64, 1, true]} />
      </mesh>
      {/* Blue rim + grey seat band on BOTH faces (each ring faces outward) */}
      {([0.18, -0.18] as const).map((z, i) => (
        <group key={`face${i}`} position={[0, 0, z]} rotation={[i === 1 ? Math.PI : 0, 0, 0]}>
          <mesh material={mat}>
            <ringGeometry args={[0.62, 0.72, 64]} />
          </mesh>
          <mesh material={seatMat} position={[0, 0, 0.003]}>
            <ringGeometry args={[0.52, 0.62, 64]} />
          </mesh>
        </group>
      ))}
      {/* Dark disc filling the bore (centred so both faces match) */}
      <mesh material={discMat} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.08, 48]} />
      </mesh>
      {/* Shiny metallic stem bar across the disc */}
      <mesh material={stemMat} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.34, 16]} />
      </mesh>
      {/* Lower locating lug */}
      <mesh material={mat} position={[0, -0.78, 0]}>
        <boxGeometry args={[0.24, 0.2, 0.34]} />
      </mesh>
      {/* Top neck boss + square ISO mounting flange */}
      <mesh material={mat} position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.17, 0.22, 0.42, 24]} />
      </mesh>
      <mesh material={mat} position={[0, 0.97, 0]}>
        <boxGeometry args={[0.42, 0.07, 0.34]} />
      </mesh>
      {/* ── Black hand-lever assembly ── */}
      {/* Pivot hub */}
      <mesh material={handleMat} position={[0.05, 1.1, 0]}>
        <boxGeometry args={[0.3, 0.16, 0.18]} />
      </mesh>
      {/* Toothed locking quadrant plate */}
      <mesh material={handleMat} position={[0.16, 1.04, 0]}>
        <boxGeometry args={[0.46, 0.34, 0.04]} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const a = -0.5 + i * 0.32;
        return (
          <mesh key={`tooth${i}`} material={handleMat} position={[0.16 + Math.cos(a) * 0.26, 1.04 + Math.sin(a) * 0.26, 0]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
          </mesh>
        );
      })}
      {/* Main handle bar + grip */}
      <mesh material={handleMat} position={[0.66, 1.2, 0]} rotation={[0, 0, 0.06]}>
        <boxGeometry args={[1.3, 0.08, 0.1]} />
      </mesh>
      <mesh material={handleMat} position={[1.28, 1.24, 0]}>
        <boxGeometry args={[0.22, 0.12, 0.13]} />
      </mesh>
      {/* Squeeze-trigger release bar beneath the handle */}
      <mesh material={handleMat} position={[0.6, 1.08, 0]} rotation={[0, 0, -0.04]}>
        <boxGeometry args={[0.95, 0.045, 0.07]} />
      </mesh>
    </group>
  );
}

// ── Non-Return / Swing Check Valve ────────────────────────────────────────────
function CheckValve({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f172a', metalness: 1, roughness: 0.25 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.35; });

  // End flange on the X axis (faces ±X): flange disc + raised face + bolt-hole ring.
  const flangeEnd = (x: number, y: number, faceDir: number, R: number, bolts: number) => (
    <group position={[x, y, 0]}>
      <mesh material={mat} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[R, R, 0.16, 48]} />
      </mesh>
      <mesh material={mat} position={[faceDir * 0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[R - 0.16, R - 0.16, 0.06, 40]} />
      </mesh>
      {Array.from({ length: bolts }).map((_, j) => {
        const a = (j / bolts) * Math.PI * 2;
        return (
          <mesh key={j} material={boltMat}
            position={[0, Math.cos(a) * (R - 0.12), Math.sin(a) * (R - 0.12)]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 10]} />
          </mesh>
        );
      })}
    </group>
  );

  return (
    <group ref={ref} scale={0.66} position={[0, -0.2, 0]} rotation={[0.16, Math.PI / 8, 0]}>
      {/* Ball chamber — fat rounded body left-of-centre (the cover sits on it) */}
      <mesh material={mat} position={[-0.42, 0.18, 0]}>
        <sphereGeometry args={[0.52, 40, 32]} />
      </mesh>
      {/* Wide arm: left flange → chamber (the big "pipe arm to the upper valve") */}
      <mesh material={mat} position={[-0.74, 0.04, 0]} rotation={[0, 0, Math.PI / 2.3]}>
        <cylinderGeometry args={[0.4, 0.44, 0.55, 40]} />
      </mesh>
      {/* Left flange (faces −X), slightly higher + larger */}
      {flangeEnd(-1.02, -0.06, -1, 0.64, 8)}
      {/* Taper from the fat chamber down to the slim run */}
      <mesh material={mat} position={[-0.16, -0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.46, 0.55, 36]} />
      </mesh>
      {/* Slimmer run arm: chamber → right flange (lower) */}
      <mesh material={mat} position={[0.32, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 1.05, 36]} />
      </mesh>
      {/* Right flange (faces +X), smaller + lower */}
      {flangeEnd(0.96, -0.2, 1, 0.5, 6)}
      {/* ── Square bolted bonnet on TOP of the chamber (offset left, not centred) ── */}
      <group position={[-0.42, 0, 0]}>
        {/* Square neck */}
        <mesh material={mat} position={[0, 0.58, 0]}>
          <boxGeometry args={[0.5, 0.3, 0.5]} />
        </mesh>
        {/* Lower square bonnet flange */}
        <mesh material={mat} position={[0, 0.74, 0]}>
          <boxGeometry args={[0.74, 0.1, 0.74]} />
        </mesh>
        {/* Upper square cover plate (gap = split line) */}
        <mesh material={mat} position={[0, 0.88, 0]}>
          <boxGeometry args={[0.74, 0.12, 0.74]} />
        </mesh>
        {/* Hex bolt at each of the 4 corners */}
        {([[-0.28, 0.28], [0.28, 0.28], [-0.28, -0.28], [0.28, -0.28]] as [number, number][]).map(([bx, bz], i) => (
          <mesh key={`nb${i}`} material={boltMat} position={[bx, 0.82, bz]}>
            <cylinderGeometry args={[0.045, 0.045, 0.32, 6]} />
          </mesh>
        ))}
        {/* Central round domed port on the cover */}
        <mesh material={mat} position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.12, 28]} />
        </mesh>
        <mesh material={mat} position={[0, 1.07, 0]}>
          <sphereGeometry args={[0.2, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      </group>
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
  const boreMat = useBoreMat(color);
  const stripeMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#2563eb', metalness: 0, roughness: 0.6 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.88} rotation={[Math.PI / 10, 0, 0]}>
      {/* Main barrel — hollow bore */}
      <HollowBarrel outerR={0.44} innerR={0.37} height={3.0} mat={mat} boreMat={boreMat} />
      {/* Blue longitudinal stripes */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
        <mesh key={i} material={stripeMat}
          position={[Math.cos(angle) * 0.453, 0, Math.sin(angle) * 0.453]}>
          <boxGeometry args={[0.022, 3.0, 0.022]} />
        </mesh>
      ))}
    </group>
  );
}

// ── Electrofusion Coupler ─────────────────────────────────────────────────────
function EFCoupler({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);
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
      {/* Body — hollow bore */}
      <HollowBarrel outerR={0.52} innerR={0.45} height={1.75} mat={mat} boreMat={boreMat} />
      {/* Embedded EF coil rings */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} material={wireMat} position={[0, -0.72 + i * 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.014, 8, 48]} />
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

// ── Electrofusion Coupler — visible heating coils (raised bands proud of body) ─
function EFCouplerCoiled({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const wireMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#60a5fa', metalness: 1, roughness: 0.1, emissive: '#3b82f6', emissiveIntensity: 0.85,
  }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.45; });

  return (
    <group ref={ref} scale={0.9} rotation={[Math.PI / 8, 0, 0]}>
      {/* Coupler body */}
      <mesh material={mat}>
        <cylinderGeometry args={[0.5, 0.5, 1.75, 48, 1, true]} />
      </mesh>
      {/* Two heating-coil zones — raised blue bands proud of the body, so they read as EF coils */}
      {([-0.42, 0.42] as number[]).map((cy, zi) => (
        <group key={zi} position={[0, cy, 0]}>
          {Array.from({ length: 5 }).map((_, j) => (
            <mesh key={j} material={wireMat} position={[0, -0.16 + j * 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.525, 0.022, 8, 56]} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Centre register stop */}
      <mesh material={mat}>
        <torusGeometry args={[0.515, 0.04, 16, 56]} />
      </mesh>
      {/* End collars */}
      {([-0.86, 0.86] as number[]).map((y, i) => (
        <mesh key={i} material={mat} position={[0, y, 0]}>
          <cylinderGeometry args={[0.53, 0.5, 0.08, 48]} />
        </mesh>
      ))}
      {/* Terminal posts */}
      {([-0.14, 0.14] as number[]).map((x, i) => (
        <mesh key={i} material={wireMat} position={[x, 0.95, 0.5]}>
          <cylinderGeometry args={[0.04, 0.04, 0.18, 8]} />
        </mesh>
      ))}
    </group>
  );
}

// ── DWC (Double Wall Corrugated) Pipe ─────────────────────────────────────────
function DWCPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const outerMat = useMat(color, metalness, roughness);
  // Orange inner wall (matches the "Black Outer / Orange Inner" spec); DoubleSide so the
  // smooth bore is visible looking into the open ends — reads hollow.
  const innerMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#f97316', metalness: 0, roughness: 0.55, side: THREE.DoubleSide }), []);

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
  const boreMat = useBoreMat(bodyColor);
  // Blue-grey pressure-class band (characteristic of OPVC)
  const bandMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#4b80a0', metalness: 0, roughness: 0.6 }), []);
  // Rubber ring seal (dark grey)
  const sealMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#374151', metalness: 0, roughness: 0.85 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.38; });

  return (
    <group ref={ref} scale={0.88}>
      {/* Main barrel — hollow bore, open at the spigot end */}
      <HollowBarrel outerR={0.41} innerR={0.34} height={2.6} mat={mat} boreMat={boreMat} openTop={false} />
      {/* Push-fit socket end (bell) — hollow flared socket showing the bore */}
      {/* Outer flared wall */}
      <mesh material={mat} position={[0, 1.48, 0]}>
        <cylinderGeometry args={[0.54, 0.41, 0.36, 48, 1, true]} />
      </mesh>
      {/* Inner socket bore wall (dark = reads hollow) */}
      <mesh material={boreMat} position={[0, 1.48, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.36, 48, 1, true]} />
      </mesh>
      {/* Seat shoulder at base of socket (barrel bore → socket bore) */}
      <mesh material={mat} position={[0, 1.30, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.34, 0.46, 48]} />
      </mesh>
      {/* Top mouth rim (wall thickness of the socket lip) */}
      <mesh material={mat} position={[0, 1.66, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.46, 0.54, 48]} />
      </mesh>
      {/* Rubber ring groove inside bell */}
      <mesh material={sealMat} position={[0, 1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.455, 0.034, 12, 48]} />
      </mesh>
      {/* Pressure-class colour band near bell end */}
      <mesh material={bandMat} position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.415, 0.415, 0.1, 48]} />
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

  // Tilted so the hexagonal head and the threaded shank both read clearly as it spins.
  return (
    <group ref={ref} scale={0.8} rotation={[0.4, 0, 0.3]}>
      {/* Hex head */}
      <mesh material={mat} position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.34, 6]} />
      </mesh>
      {/* Top bevel of the head */}
      <mesh material={mat} position={[0, 1.37, 0]}>
        <cylinderGeometry args={[0.26, 0.34, 0.06, 6]} />
      </mesh>
      {/* Smooth (unthreaded) shank just under the head */}
      <mesh material={mat} position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.155, 0.155, 0.52, 24]} />
      </mesh>
      {/* Threaded shank core */}
      <mesh material={mat} position={[0, -0.32, 0]}>
        <cylinderGeometry args={[0.155, 0.155, 1.62, 24]} />
      </mesh>
      {/* Fine threads — tight pitch so adjacent crests nearly touch (reads as threading, not a coil) */}
      {Array.from({ length: 32 }).map((_, i) => (
        <mesh key={i} material={mat} position={[0, 0.46 - i * 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17, 0.024, 8, 28]} />
        </mesh>
      ))}
      {/* Chamfered tip */}
      <mesh material={mat} position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.12, 0.155, 0.12, 24]} />
      </mesh>
      {/* Flat washer (threaded onto the shank) */}
      <mesh material={nutMat} position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.06, 32]} />
      </mesh>
      {/* Hex nut sitting on the washer — clearly hexagonal and proud of the shank */}
      <mesh material={nutMat} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.28, 6]} />
      </mesh>
    </group>
  );
}

// ── GI Pipe (Galvanized — shiny silver) ───────────────────────────────────────
function GIPipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);
  const threadMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#d1d5db', metalness: 0.95, roughness: 0.1 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.88} rotation={[Math.PI / 10, 0, 0]}>
      {/* Main barrel — hollow bore */}
      <HollowBarrel outerR={0.38} innerR={0.31} height={2.9} mat={mat} boreMat={boreMat} />
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
        <torusGeometry args={[0.58, 0.24, 24, 48, Math.PI / 2]} />
      </mesh>
      {/* Horizontal arm */}
      <mesh material={mat} position={[0.86, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.56, 32]} />
      </mesh>
      {/* Horizontal hex coupling band */}
      <mesh material={mat} position={[1.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.31, 0.31, 0.24, 6]} />
      </mesh>
      {/* Horizontal thread rings at arm end (fine, nearly touching) */}
      {[1.22, 1.265, 1.31, 1.355, 1.40, 1.445].map((x, i) => (
        <mesh key={i} material={threadMat} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.245, 0.018, 8, 28]} />
        </mesh>
      ))}
      {/* Vertical arm */}
      <mesh material={mat} position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.56, 32]} />
      </mesh>
      {/* Vertical hex coupling band */}
      <mesh material={mat} position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.24, 6]} />
      </mesh>
      {/* Vertical thread rings at arm end */}
      {[1.22, 1.265, 1.31, 1.355, 1.40, 1.445].map((y, i) => (
        <mesh key={i} material={threadMat} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.245, 0.018, 8, 28]} />
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

// ── Shared fitting arms (used by the CI/DI specials below) ────────────────────
// A single hollow arm ending in a bolted FlangeDisk, built along +Y from the origin.
function FlangedArm({
  len,
  mat,
  boreMat,
  boltMat,
  outerR = 0.3,
  innerR = 0.21,
}: {
  len: number;
  mat: THREE.MeshPhysicalMaterial;
  boreMat: THREE.Material;
  boltMat: THREE.MeshPhysicalMaterial;
  outerR?: number;
  innerR?: number;
}) {
  return (
    <group>
      <group position={[0, len / 2, 0]}>
        <HollowBarrel outerR={outerR} innerR={innerR} height={len} mat={mat} boreMat={boreMat} />
      </group>
      {/* Transition collar flaring out to the flange */}
      <mesh material={mat} position={[0, len - 0.06, 0]}>
        <cylinderGeometry args={[0.46, outerR, 0.12, 48, 1, true]} />
      </mesh>
      <FlangeDisk y={len} mat={mat} boltMat={boltMat} boreR={innerR} boreMat={boreMat} />
    </group>
  );
}

// A single hollow arm ending in a flared push-fit bell socket, built along +Y.
function SocketArm({
  len,
  mat,
  boreMat,
  outerR = 0.32,
  innerR = 0.24,
}: {
  len: number;
  mat: THREE.MeshPhysicalMaterial;
  boreMat: THREE.Material;
  outerR?: number;
  innerR?: number;
}) {
  return (
    <group>
      <group position={[0, len / 2, 0]}>
        <HollowBarrel outerR={outerR} innerR={innerR} height={len} mat={mat} boreMat={boreMat} openTop={false} />
      </group>
      {/* Flared bell socket — outer flare wall */}
      <mesh material={mat} position={[0, len + 0.14, 0]}>
        <cylinderGeometry args={[0.48, outerR, 0.28, 48, 1, true]} />
      </mesh>
      {/* Inner socket bore */}
      <mesh material={boreMat} position={[0, len + 0.14, 0]}>
        <cylinderGeometry args={[0.38, innerR, 0.28, 48, 1, true]} />
      </mesh>
      {/* Mouth rim */}
      <mesh material={boreMat} position={[0, len + 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.48, 48]} />
      </mesh>
    </group>
  );
}

// ── D.I. Double Flanged 45° Bend ──────────────────────────────────────────────
function FlangedBend45({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f172a', metalness: 1, roughness: 0.25 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.4; });

  const Rb = 0.62;   // bend radius
  const tube = 0.3;  // arm outer radius (matches FlangedArm outerR)
  const STUB = 0.55;
  const P0: [number, number, number] = [Rb, 0, 0];                                  // arc start (tangent +Y)
  const P1: [number, number, number] = [Rb * Math.cos(Math.PI / 4), Rb * Math.sin(Math.PI / 4), 0]; // arc end

  return (
    <group ref={ref} scale={0.92} position={[-0.45, -0.2, 0]} rotation={[0.18, 0, 0]}>
      {/* 45° curved casting */}
      <mesh material={mat}>
        <torusGeometry args={[Rb, tube, 24, 64, Math.PI / 4]} />
      </mesh>
      {/* Leg A — straight down from arc start */}
      <group position={P0} rotation={[0, 0, Math.PI]}>
        <FlangedArm len={STUB} mat={mat} boreMat={boreMat} boltMat={boltMat} outerR={tube} innerR={0.21} />
      </group>
      {/* Leg B — continues along the 45° tangent at arc end */}
      <group position={P1} rotation={[0, 0, Math.PI / 4]}>
        <FlangedArm len={STUB} mat={mat} boreMat={boreMat} boltMat={boltMat} outerR={tube} innerR={0.21} />
      </group>
    </group>
  );
}

// ── All Socket Tees (push-fit sockets on all 3 ends) ──────────────────────────
function SocketTee({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.4; });

  const L = 0.72;
  // Run along ±X, branch down (-Y)
  const armRots: [number, number, number][] = [
    [0, 0, Math.PI / 2],   // +X (rotate +Y → +X is -PI/2; use group below)
    [0, 0, -Math.PI / 2],  // -X
    [0, 0, Math.PI],       // -Y (down)
  ];

  return (
    <group ref={ref} scale={0.82} rotation={[Math.PI / 9, Math.PI / 6, 0]}>
      {/* Central junction */}
      <mesh material={mat}>
        <sphereGeometry args={[0.42, 32, 32]} />
      </mesh>
      {armRots.map((rot, i) => (
        <group key={i} rotation={rot}>
          <SocketArm len={L} mat={mat} boreMat={boreMat} />
        </group>
      ))}
    </group>
  );
}

// ── D.I. All Flanged Tee ──────────────────────────────────────────────────────
function FlangedTee({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f172a', metalness: 1, roughness: 0.25 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.38; });

  const L = 1.1;
  const armRots: [number, number, number][] = [
    [0, 0, -Math.PI / 2], // +X run
    [0, 0, Math.PI / 2],  // -X run
    [0, 0, 0],            // +Y branch (up)
  ];

  return (
    <group ref={ref} scale={0.62} rotation={[0.16, 0, 0]}>
      <mesh material={mat}>
        <sphereGeometry args={[0.4, 32, 32]} />
      </mesh>
      {armRots.map((rot, i) => (
        <group key={i} rotation={rot}>
          <FlangedArm len={L} mat={mat} boreMat={boreMat} boltMat={boltMat} />
        </group>
      ))}
    </group>
  );
}

// ── All Flanged Crosses (4-way) ───────────────────────────────────────────────
function FlangedCross({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f172a', metalness: 1, roughness: 0.25 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.36; });

  const L = 0.72;
  const armRots: [number, number, number][] = [
    [0, 0, 0],             // +Y
    [0, 0, Math.PI],       // -Y
    [0, 0, -Math.PI / 2],  // +X
    [0, 0, Math.PI / 2],   // -X
  ];

  return (
    <group ref={ref} scale={0.78} rotation={[Math.PI / 9, Math.PI / 6, 0]}>
      <mesh material={mat}>
        <sphereGeometry args={[0.42, 32, 32]} />
      </mesh>
      {armRots.map((rot, i) => (
        <group key={i} rotation={rot}>
          <FlangedArm len={L} mat={mat} boreMat={boreMat} boltMat={boltMat} />
        </group>
      ))}
    </group>
  );
}

// ── Collars (double-socket coupling sleeve) ───────────────────────────────────
function Collar({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.45; });

  const innerR = 0.34;
  const bell = (y: number, dir: number) => (
    <group>
      {/* Flared bell outer wall */}
      <mesh material={mat} position={[0, y, 0]}>
        <cylinderGeometry args={[0.5, 0.42, 0.5, 48, 1, true]} />
      </mesh>
      {/* Inner socket bore */}
      <mesh material={boreMat} position={[0, y, 0]}>
        <cylinderGeometry args={[0.4, 0.36, 0.5, 48, 1, true]} />
      </mesh>
      {/* Mouth rim */}
      <mesh material={boreMat} position={[0, y + dir * 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.5, 48]} />
      </mesh>
    </group>
  );

  return (
    // Outer group auto-spins about the vertical screen axis; inner group lays the
    // vertically-built collar down on its side so it displays horizontal.
    <group ref={ref} scale={0.95}>
      <group rotation={[0, 0, Math.PI / 2]}>
        {/* Central sleeve barrel */}
        <HollowBarrel outerR={0.42} innerR={innerR} height={1.5} mat={mat} boreMat={boreMat} openTop={false} openBottom={false} />
        {/* Raised centre band */}
        <mesh material={mat}>
          <torusGeometry args={[0.44, 0.05, 16, 48]} />
        </mesh>
        {/* Bells at both ends (top mouth opens up, bottom mouth opens down) */}
        {bell(0.85, 1)}
        <group rotation={[Math.PI, 0, 0]}>{bell(0.85, 1)}</group>
      </group>
    </group>
  );
}

// White cement-mortar lining (as used by FlangedPipe) — for cement-lined fittings.
function useCementBore() {
  return useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#eef1f4', emissive: '#b9c1cc', emissiveIntensity: 0.6, roughness: 0.9, metalness: 0, side: THREE.DoubleSide }),
    [],
  );
}

// ── Flanged Spigot (one flange end, one plain spigot end) ─────────────────────
function FlangedSpigot({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useCementBore();
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f172a', metalness: 1, roughness: 0.25 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    // Outer group auto-spins about the vertical screen axis; inner group lays the
    // vertically-built spigot down on its side so it displays horizontal.
    <group ref={ref} scale={0.9}>
      <group rotation={[0, 0, Math.PI / 2]}>
        {/* Tall plain spigot barrel */}
        <HollowBarrel outerR={0.34} innerR={0.27} height={2.4} mat={mat} boreMat={boreMat} />
        {/* Rounded spigot lip at the top */}
        <mesh material={mat} position={[0, 1.24, 0]}>
          <cylinderGeometry args={[0.32, 0.34, 0.16, 48, 1, true]} />
        </mesh>
        {/* Bevel collar flaring to the flange at the bottom */}
        <mesh material={mat} position={[0, -1.18, 0]}>
          <cylinderGeometry args={[0.52, 0.34, 0.14, 48, 1, true]} />
        </mesh>
        <FlangeDisk y={-1.3} mat={mat} boltMat={boltMat} boreR={0.27} boreMat={boreMat} />
      </group>
    </group>
  );
}

// ── Single Flange Pipe (flange one end, plain barrel — displayed horizontal) ──
function SingleFlangePipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useCementBore();
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f172a', metalness: 1, roughness: 0.25 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    // Outer group auto-spins about the vertical screen axis; inner group lays the
    // vertically-built spool down on its side so the pipe displays horizontal.
    <group ref={ref} scale={0.9}>
      <group rotation={[0, 0, Math.PI / 2]}>
        {/* Plain barrel */}
        <HollowBarrel outerR={0.34} innerR={0.27} height={2.4} mat={mat} boreMat={boreMat} />
        {/* Rounded spigot lip at the plain end */}
        <mesh material={mat} position={[0, 1.24, 0]}>
          <cylinderGeometry args={[0.32, 0.34, 0.16, 48, 1, true]} />
        </mesh>
        {/* Bevel collar flaring to the flange at the other end */}
        <mesh material={mat} position={[0, -1.18, 0]}>
          <cylinderGeometry args={[0.52, 0.34, 0.14, 48, 1, true]} />
        </mesh>
        <FlangeDisk y={-1.3} mat={mat} boltMat={boltMat} boreR={0.27} boreMat={boreMat} />
      </group>
    </group>
  );
}

// ── Flanged Adaptor (short double-flange spool) ───────────────────────────────
function FlangedAdapter({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useCementBore();
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#1a1a1a', metalness: 0.9, roughness: 0.3 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.92} rotation={[0.12, 0, 0]}>
      {/* Short stocky barrel */}
      <HollowBarrel outerR={0.44} innerR={0.35} height={1.0} mat={mat} boreMat={boreMat} />
      {/* Bevel collars at each end */}
      {([-0.5, 0.5] as number[]).map((y, i) => (
        <mesh key={i} material={mat} position={[0, y, 0]}>
          <cylinderGeometry args={[0.56, 0.44, 0.13, 48, 1, true]} />
        </mesh>
      ))}
      <FlangeDisk y={0.62}  mat={mat} boltMat={boltMat} boreR={0.35} boreMat={boreMat} />
      <FlangeDisk y={-0.62} mat={mat} boltMat={boltMat} boreR={0.35} boreMat={boreMat} />
    </group>
  );
}

// ── Double Socket 11.25° Bend ─────────────────────────────────────────────────
function SocketBend11({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  const half = 0.0982; // 11.25° / 2 in radians

  return (
    <group ref={ref} scale={0.92} rotation={[0.12, 0, 0]}>
      {/* Short junction barrel */}
      <mesh material={mat}>
        <cylinderGeometry args={[0.34, 0.34, 0.4, 48, 1, true]} />
      </mesh>
      {/* Upper socket (tilted +half) */}
      <group rotation={[0, 0, half]}>
        <SocketArm len={0.55} mat={mat} boreMat={boreMat} outerR={0.34} innerR={0.26} />
      </group>
      {/* Lower socket (tilted so total deflection = 11.25°) */}
      <group rotation={[0, 0, Math.PI - half]}>
        <SocketArm len={0.55} mat={mat} boreMat={boreMat} outerR={0.34} innerR={0.26} />
      </group>
    </group>
  );
}

// ── Plug (solid spigot end plug) ──────────────────────────────────────────────
function Plug({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.5; });

  return (
    <group ref={ref} scale={1.0} rotation={[0.18, 0, 0]}>
      {/* Solid drum body (capped) */}
      <mesh material={mat} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.8, 56]} />
      </mesh>
      {/* Rounded top edge */}
      <mesh material={mat} position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.07, 16, 56]} />
      </mesh>
      {/* Insertion lip / skirt at the base */}
      <mesh material={mat} position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.16, 56]} />
      </mesh>
    </group>
  );
}

// ── Duckfoot Double Flanged 90° Bend ──────────────────────────────────────────
function DuckfootBend90({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f172a', metalness: 1, roughness: 0.25 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.4; });

  const Rb = 0.42;   // knuckle radius
  const tube = 0.3;  // pipe radius
  const plateTop = -Rb - tube - 0.06;  // top face of the base plate (just below lowest pipe point)

  // Triangular gusset "duck foot" web — right triangle in the X–Y plane: vertical
  // edge up the back of the standpipe, base out along the foot plate.
  const gussetGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0, 1.0);     // up the standpipe
    s.lineTo(0.55, 0);    // out along the base plate (hypotenuse back down)
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.14, bevelEnabled: false });
  }, []);

  return (
    <group ref={ref} scale={0.6} position={[-0.3, -0.12, 0]} rotation={[0.12, -0.5, 0]}>
      {/* Tall vertical standpipe — up to the top flange (bottom opening at origin) */}
      <group position={[0, 0, 0]}>
        <FlangedArm len={1.0} mat={mat} boreMat={boreMat} boltMat={boltMat} outerR={tube} innerR={0.21} />
      </group>
      {/* 90° knuckle at the bottom: arc from (0,0)↓ round to (Rb,-Rb)→+X */}
      <mesh material={mat} position={[Rb, 0, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[Rb, tube, 24, 64, Math.PI / 2]} />
      </mesh>
      {/* Low horizontal side outlet — out to the side flange */}
      <group position={[Rb, -Rb, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <FlangedArm len={0.42} mat={mat} boreMat={boreMat} boltMat={boltMat} outerR={tube} innerR={0.21} />
      </group>
      {/* Flat rectangular foot base plate */}
      <mesh material={mat} position={[Rb * 0.5, plateTop - 0.05, 0]}>
        <boxGeometry args={[1.05, 0.1, 0.95]} />
      </mesh>
      {/* Triangular gusset web (the duck foot heel) under the standpipe */}
      <mesh material={mat} geometry={gussetGeo} position={[0, plateTop, -0.07]} />
      {/* Foot bolt holes near the plate corners */}
      {([[-0.42, 0.35], [0.42, 0.35], [-0.42, -0.35], [0.42, -0.35]] as [number, number][]).map(([dx, dz], i) => (
        <mesh key={i} material={boltMat} position={[Rb * 0.5 + dx, plateTop - 0.05, dz]}>
          <cylinderGeometry args={[0.05, 0.05, 0.16, 12]} />
        </mesh>
      ))}
    </group>
  );
}

// ── Crosses, All Sockets (4-way, push-fit sockets all ends) ───────────────────
function SocketCross({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.36; });

  const L = 0.62;
  const armRots: [number, number, number][] = [
    [0, 0, 0], [0, 0, Math.PI], [0, 0, -Math.PI / 2], [0, 0, Math.PI / 2],
  ];

  return (
    <group ref={ref} scale={0.78} rotation={[Math.PI / 9, Math.PI / 6, 0]}>
      <mesh material={mat}>
        <sphereGeometry args={[0.42, 32, 32]} />
      </mesh>
      {armRots.map((rot, i) => (
        <group key={i} rotation={rot}>
          <SocketArm len={L} mat={mat} boreMat={boreMat} />
        </group>
      ))}
    </group>
  );
}

// ── Flange on Double Socket Tees (socket run + flanged branch) ────────────────
function FlangeSocketTee({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f172a', metalness: 1, roughness: 0.25 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.38; });

  const L = 0.68;

  return (
    <group ref={ref} scale={0.8} rotation={[Math.PI / 9, Math.PI / 5, 0]}>
      <mesh material={mat}>
        <sphereGeometry args={[0.42, 32, 32]} />
      </mesh>
      {/* Socket run (±X) */}
      <group rotation={[0, 0, -Math.PI / 2]}><SocketArm len={L} mat={mat} boreMat={boreMat} /></group>
      <group rotation={[0, 0, Math.PI / 2]}><SocketArm len={L} mat={mat} boreMat={boreMat} /></group>
      {/* Flanged branch (+Y) */}
      <FlangedArm len={L} mat={mat} boreMat={boreMat} boltMat={boltMat} />
    </group>
  );
}

// ── Ductile Iron Double Socket 90° Bend ───────────────────────────────────────
function SocketBend90({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.4; });

  const Rb = 0.5;      // bend radius
  const tube = 0.27;   // pipe radius
  const L = 0.5;       // straight arm length between the bend and each socket

  // Bell socket as a lathe-revolved profile (radius, height) built along +Y from
  // the arm tip: pipe → collar BEAD → flared BELL mouth (~1.45× pipe) → rounded lip.
  const cupGeo = useMemo(() => {
    const pts = [
      [0.27, 0.00], [0.27, 0.06], [0.32, 0.11], [0.36, 0.17],  // collar bead crest
      [0.31, 0.22], [0.31, 0.26],                              // neck
      [0.37, 0.35], [0.40, 0.44], [0.40, 0.48], [0.34, 0.49],  // bell flare + rounded lip
    ].map(([r, y]) => new THREE.Vector2(r, y));
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  // One arm = straight pipe (length L) + bell socket at its tip, built along +Y
  // from the bend junction. Socket: smooth cup + deep dark bore + dark floor + rim.
  const armSocket = (
    <group>
      {/* Straight pipe arm */}
      <group position={[0, L / 2, 0]}>
        <HollowBarrel outerR={tube} innerR={0.2} height={L} mat={mat} boreMat={boreMat} openTop={false} />
      </group>
      {/* Bell socket at the arm tip */}
      <group position={[0, L, 0]}>
        <mesh material={mat} geometry={cupGeo} />
        {/* Deep dark inner bore wall */}
        <mesh material={boreMat} position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.42, 48, 1, true]} />
        </mesh>
        {/* Dark floor at the bottom of the socket */}
        <mesh material={boreMat} position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.32, 48]} />
        </mesh>
        {/* Mouth rim annulus around the dark opening */}
        <mesh material={mat} position={[0, 0.49, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.4, 48]} />
        </mesh>
      </group>
    </group>
  );

  return (
    <group ref={ref} scale={0.6} position={[0.05, 0.05, 0]} rotation={[0.2, 0, 0]}>
      {/* Smooth 90° bend body — open faces point outward at [Rb,0] (−Y) and [0,Rb] (−X) */}
      <mesh material={mat}>
        <torusGeometry args={[Rb, tube, 24, 96, Math.PI / 2]} />
      </mesh>
      {/* Arm + socket extending DOWN (−Y), out of the bend */}
      <group position={[Rb, 0, 0]} rotation={[0, 0, Math.PI]}>{armSocket}</group>
      {/* Arm + socket extending LEFT (−X), out of the bend */}
      <group position={[0, Rb, 0]} rotation={[0, 0, Math.PI / 2]}>{armSocket}</group>
    </group>
  );
}

// ── Bell Mouth Pieces (flanged flared trumpet inlet) ──────────────────────────
function BellMouth({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useCementBore();
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#1a1a1a', metalness: 0.9, roughness: 0.3 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.45; });

  return (
    <group ref={ref} scale={0.95} rotation={[0.16, 0, 0]}>
      {/* Flange base */}
      <FlangeDisk y={-0.62} mat={mat} boltMat={boltMat} boreR={0.28} boreMat={boreMat} />
      {/* Neck barrel */}
      <group position={[0, -0.36, 0]}>
        <HollowBarrel outerR={0.36} innerR={0.28} height={0.5} mat={mat} boreMat={boreMat} openTop={false} />
      </group>
      {/* Flaring trumpet mouth — outer wall */}
      <mesh material={mat} position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.88, 0.36, 0.74, 56, 1, true]} />
      </mesh>
      {/* Cement-lined inner flare */}
      <mesh material={boreMat} position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.8, 0.28, 0.74, 56, 1, true]} />
      </mesh>
      {/* Mouth rim */}
      <mesh material={mat} position={[0, 0.59, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 0.88, 56]} />
      </mesh>
    </group>
  );
}

// ── Flanged Socket (flange one end, push-on socket the other) ─────────────────
function FlangedSocket({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useCementBore();
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#1a1a1a', metalness: 0.9, roughness: 0.3 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.45; });

  return (
    <group ref={ref} scale={0.95} rotation={[0.16, 0, 0]}>
      {/* Socket barrel body */}
      <HollowBarrel outerR={0.4} innerR={0.32} height={1.0} mat={mat} boreMat={boreMat} />
      {/* Bevel collar up to the flange */}
      <mesh material={mat} position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.56, 0.4, 0.13, 48, 1, true]} />
      </mesh>
      <FlangeDisk y={0.58} mat={mat} boltMat={boltMat} boreR={0.32} boreMat={boreMat} />
      {/* Socket lip at the bottom */}
      <mesh material={mat} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.46, 0.42, 0.16, 48, 1, true]} />
      </mesh>
    </group>
  );
}

// ── Mechanical Joint Collar (bolted gland coupling) ───────────────────────────
function MJCollar({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);
  const nutMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#c9ced6', metalness: 1, roughness: 0.3 }), []);
  const studMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#3a4350', metalness: 1, roughness: 0.35 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.42; });

  return (
    <group ref={ref} scale={0.92} rotation={[0.12, 0, 0]}>
      {/* Central collar body */}
      <HollowBarrel outerR={0.4} innerR={0.3} height={1.2} mat={mat} boreMat={boreMat} openTop={false} openBottom={false} />
      {/* Integral body flange ring + outboard gland follower at each end */}
      {([-0.5, 0.5] as number[]).map((y, i) => (
        <group key={i}>
          <mesh material={mat} position={[0, y, 0]}>
            <cylinderGeometry args={[0.56, 0.56, 0.16, 48]} />
          </mesh>
          <mesh material={mat} position={[0, y + (y > 0 ? 0.18 : -0.18), 0]}>
            <cylinderGeometry args={[0.5, 0.42, 0.14, 48, 1, true]} />
          </mesh>
        </group>
      ))}
      {/* 4 axial tie studs with hex nuts at both ends */}
      {Array.from({ length: 4 }).map((_, i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const x = Math.cos(a) * 0.48;
        const z = Math.sin(a) * 0.48;
        return (
          <group key={i}>
            <mesh material={studMat} position={[x, 0, z]}>
              <cylinderGeometry args={[0.03, 0.03, 1.5, 10]} />
            </mesh>
            {([0.72, -0.72] as number[]).map((ny, j) => (
              <mesh key={j} material={nutMat} position={[x, ny, z]}>
                <cylinderGeometry args={[0.07, 0.07, 0.1, 6]} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

// ── End Cap (caps over a pipe spigot) ─────────────────────────────────────────
function EndCap({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useBoreMat(color);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.5; });

  return (
    <group ref={ref} scale={1.0} rotation={[0.2, 0, 0]}>
      {/* Domed/capped top */}
      <mesh material={mat} position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.46, 56]} />
      </mesh>
      {/* Rounded top edge */}
      <mesh material={mat} position={[0, 0.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.07, 16, 56]} />
      </mesh>
      {/* Step shoulder down to the skirt */}
      <mesh material={mat} position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.58, 0.46, 0.14, 56, 1, true]} />
      </mesh>
      {/* Open skirt that slips over the pipe */}
      <group position={[0, -0.3, 0]}>
        <HollowBarrel outerR={0.58} innerR={0.48} height={0.4} mat={mat} boreMat={boreMat} openTop={false} />
      </group>
    </group>
  );
}

// ── Blank (Blind) Flange — solid bolt-drilled disk, no bore ───────────────────
function BlankFlange({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const holeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#05080d', roughness: 1, metalness: 0 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.5; });

  return (
    <group ref={ref} scale={1.0} rotation={[0.55, 0, 0]}>
      {/* Solid blank disk */}
      <mesh material={mat}>
        <cylinderGeometry args={[0.88, 0.88, 0.18, 56]} />
      </mesh>
      {/* Centre raised boss */}
      <mesh material={mat} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 48]} />
      </mesh>
      {/* 8 bolt holes near the rim */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} material={holeMat} position={[Math.cos(a) * 0.68, 0, Math.sin(a) * 0.68]}>
            <cylinderGeometry args={[0.075, 0.075, 0.24, 16]} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── D.I./C.I. Puddle Pipe (double flange + central puddle collar) ─────────────
function PuddlePipe({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useMat(color, metalness, roughness);
  const boreMat = useCementBore();
  const boltMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0f172a', metalness: 1, roughness: 0.25 }), []);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.4; });

  return (
    // Outer group auto-spins about the vertical screen axis; inner group lays the
    // vertically-built barrel down on its side so the pipe displays horizontal.
    <group ref={ref} scale={0.84}>
      <group rotation={[0, 0, Math.PI / 2]}>
        {/* Barrel */}
        <HollowBarrel outerR={0.34} innerR={0.27} height={2.6} mat={mat} boreMat={boreMat} />
        {/* Bevel collars at the ends */}
        {([-1.18, 1.18] as number[]).map((y, i) => (
          <mesh key={i} material={mat} position={[0, y, 0]}>
            <cylinderGeometry args={[0.5, 0.34, 0.12, 48, 1, true]} />
          </mesh>
        ))}
        <FlangeDisk y={1.32}  mat={mat} boltMat={boltMat} boreR={0.27} boreMat={boreMat} />
        <FlangeDisk y={-1.32} mat={mat} boltMat={boltMat} boreR={0.27} boreMat={boreMat} />
        {/* Central puddle collar cast into the concrete wall */}
        <mesh material={mat} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.66, 0.66, 0.22, 48]} />
        </mesh>
        <mesh material={mat} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.34, 48, 1, true]} />
        </mesh>
      </group>
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
    case 'ef-coupler-coiled': return <EFCouplerCoiled {...p} />;
    case 'dwc-pipe':        return <DWCPipe {...p} />;
    case 'opvc-pipe':       return <OPVCPipe {...p} />;
    case 'tmt-bar':         return <TMTBar {...p} />;
    case 'bolt':            return <HexBolt {...p} />;
    case 'gi-pipe':         return <GIPipe {...p} />;
    case 'ms-pipe':         return <MSPipe {...p} />;
    case 'hdpe-elbow':      return <HDPEElbow {...p} />;
    case 'pipe-tee':        return <PipeTee {...p} />;
    case 'gi-elbow':        return <GIElbow {...p} />;
    case 'flanged-bend-45': return <FlangedBend45 {...p} />;
    case 'socket-tee':      return <SocketTee {...p} />;
    case 'flanged-tee':     return <FlangedTee {...p} />;
    case 'flanged-cross':   return <FlangedCross {...p} />;
    case 'collar':          return <Collar {...p} />;
    case 'flanged-spigot':  return <FlangedSpigot {...p} />;
    case 'single-flange-pipe': return <SingleFlangePipe {...p} />;
    case 'flanged-adapter': return <FlangedAdapter {...p} />;
    case 'socket-bend-11':  return <SocketBend11 {...p} />;
    case 'plug':            return <Plug {...p} />;
    case 'duckfoot-bend-90': return <DuckfootBend90 {...p} />;
    case 'socket-cross':    return <SocketCross {...p} />;
    case 'flange-socket-tee': return <FlangeSocketTee {...p} />;
    case 'socket-bend-90':  return <SocketBend90 {...p} />;
    case 'bell-mouth':      return <BellMouth {...p} />;
    case 'flanged-socket':  return <FlangedSocket {...p} />;
    case 'mj-collar':       return <MJCollar {...p} />;
    case 'end-cap':         return <EndCap {...p} />;
    case 'blank-flange':    return <BlankFlange {...p} />;
    case 'puddle-pipe':     return <PuddlePipe {...p} />;
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
  // Mount the WebGL Canvas only while the card is near the viewport, and UNMOUNT
  // it once it scrolls away. Browsers cap simultaneous WebGL contexts (~16); with
  // 20 product cards each holding a context, the later cards failed to get one and
  // rendered blank. Toggling on/off keeps only the on-screen cards live.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Debounce the mount: only mount the Canvas after the card has stayed in view
    // for a moment, and unmount immediately when it leaves. This prevents a Canvas
    // from being mounted for cards that scroll past / get filtered out before R3F's
    // async setup finishes — which otherwise crashes in the event "connect" step
    // (addEventListener on a now-null target).
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setVisible(true), 160);
        } else {
          if (timer) clearTimeout(timer);
          setVisible(false);
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => { if (timer) clearTimeout(timer); observer.disconnect(); };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing">
      {visible && (
      <Canvas
        shadows
        events={safePointerEvents}
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
