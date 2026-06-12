'use client';

import React, { useId } from 'react';

interface Props {
  type: string;
  color: string;
  metalness?: number;
  roughness?: number;
}

function colorAdj(hex: string, by: number): string {
  const c = hex.replace('#', '').padEnd(6, '0');
  const r = Math.min(255, Math.max(0, parseInt(c.slice(0, 2), 16) + by));
  const g = Math.min(255, Math.max(0, parseInt(c.slice(2, 4), 16) + by));
  const b = Math.min(255, Math.max(0, parseInt(c.slice(4, 6), 16) + by));
  return `rgb(${r},${g},${b})`;
}

function ShapeContent({ type, color, metalness, gid }: { type: string; color: string; metalness: number; gid: string }) {
  const br = colorAdj(color, Math.round(metalness * 140 + 50));
  const dk = colorAdj(color, -70);
  const fill = `url(#${gid})`;

  const defs = (
    <defs>
      <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={br} />
        <stop offset="38%" stopColor={color} />
        <stop offset="100%" stopColor={dk} />
      </linearGradient>
      <radialGradient id={`${gid}r`} cx="38%" cy="32%" r="60%">
        <stop offset="0%" stopColor={br} />
        <stop offset="100%" stopColor={dk} />
      </radialGradient>
    </defs>
  );

  const rfill = `url(#${gid}r)`;

  switch (type) {
    case 'flanged-pipe':
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Barrel */}
          <rect x="48" y="64" width="104" height="22" rx="4" fill={fill} />
          <rect x="48" y="64" width="104" height="5" rx="4" fill="rgba(255,255,255,0.14)" />
          {/* Left flange */}
          <rect x="28" y="46" width="24" height="58" rx="3" fill={fill} />
          <rect x="28" y="46" width="24" height="9" rx="3" fill="rgba(255,255,255,0.22)" />
          {[52,62,72,82,92].map((y) => <circle key={y} cx="40" cy={y} r="2.5" fill="rgba(0,0,0,0.45)" />)}
          {/* Right flange */}
          <rect x="148" y="46" width="24" height="58" rx="3" fill={fill} />
          <rect x="148" y="46" width="24" height="9" rx="3" fill="rgba(255,255,255,0.22)" />
          {[52,62,72,82,92].map((y) => <circle key={y} cx="160" cy={y} r="2.5" fill="rgba(0,0,0,0.45)" />)}
          {/* Hollow ends */}
          <ellipse cx="48" cy="75" rx="9" ry="11" fill={dk} />
          <ellipse cx="152" cy="75" rx="9" ry="11" fill={dk} />
        </svg>
      );

    case 'ss-pipe':
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Main barrel */}
          <rect x="52" y="64" width="95" height="22" rx="3" fill={fill} />
          <rect x="52" y="64" width="95" height="5" rx="3" fill="rgba(255,255,255,0.13)" />
          {/* Bell socket (left) */}
          <path d="M52,64 L22,54 L22,96 L52,86 Z" fill={fill} />
          <path d="M52,64 L22,54 L22,61 L52,70 Z" fill="rgba(255,255,255,0.12)" />
          {/* Socket ring */}
          <rect x="18" y="50" width="8" height="50" rx="3" fill={fill} />
          <rect x="18" y="50" width="8" height="10" rx="3" fill="rgba(255,255,255,0.25)" />
          {/* Spigot plain end (right) - slightly narrower */}
          <rect x="144" y="68" width="38" height="14" rx="3" fill={fill} />
          <rect x="144" y="68" width="38" height="4" fill="rgba(255,255,255,0.1)" />
          {/* Hollow ends */}
          <ellipse cx="18" cy="75" rx="5" ry="17" fill={dk} />
          <ellipse cx="182" cy="75" rx="4" ry="7" fill={dk} />
        </svg>
      );

    case 'gate-valve':
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Pipe stubs */}
          <rect x="18" y="68" width="40" height="14" rx="2" fill={fill} />
          <rect x="142" y="68" width="40" height="14" rx="2" fill={fill} />
          {/* Body */}
          <rect x="58" y="50" width="84" height="50" rx="8" fill={fill} />
          <rect x="58" y="50" width="84" height="13" rx="8" fill="rgba(255,255,255,0.18)" />
          {/* Corner bolts */}
          {[[62,54],[134,54],[62,96],[134,96]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="4" fill={dk} />)}
          {/* Stem */}
          <rect x="96" y="18" width="8" height="32" rx="2" fill={fill} />
          {/* Handwheel ring */}
          <circle cx="100" cy="18" r="20" fill="none" stroke={br} strokeWidth="5" />
          <circle cx="100" cy="18" r="5" fill={fill} />
          {[0,60,120,180,240,300].map((a) => {
            const rad = (a * Math.PI) / 180;
            return <line key={a} x1="100" y1="18" x2={parseFloat((100+Math.cos(rad)*20).toFixed(4))} y2={parseFloat((18+Math.sin(rad)*20).toFixed(4))} stroke={br} strokeWidth="2" />;
          })}
        </svg>
      );

    case 'air-valve':
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Sphere */}
          <circle cx="100" cy="60" r="34" fill={rfill} />
          <ellipse cx="90" cy="50" rx="11" ry="7" fill="rgba(255,255,255,0.2)" />
          {/* Orifice cap */}
          <rect x="86" y="26" width="28" height="12" rx="5" fill="#f59e0b" />
          {/* Body */}
          <rect x="72" y="82" width="56" height="44" rx="7" fill={fill} />
          <rect x="72" y="82" width="56" height="13" rx="7" fill="rgba(255,255,255,0.18)" />
          {/* Base flange */}
          <rect x="60" y="118" width="80" height="14" rx="4" fill={fill} />
          {[68,88,108,128].map((x) => <circle key={x} cx={x} cy="125" r="3" fill="rgba(0,0,0,0.4)" />)}
        </svg>
      );

    case 'butterfly-valve':
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Pipe stubs */}
          <rect x="18" y="68" width="30" height="14" rx="2" fill={fill} />
          <rect x="152" y="68" width="30" height="14" rx="2" fill={fill} />
          {/* Ring body */}
          <circle cx="100" cy="75" r="38" fill="none" stroke={color} strokeWidth="22" />
          <circle cx="100" cy="75" r="49" fill="none" stroke={br} strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx="100" cy="75" r="27" fill="none" stroke={br} strokeWidth="1.5" strokeOpacity="0.4" />
          {/* Disc */}
          <ellipse cx="100" cy="75" rx="26" ry="15" fill="#ef4444" />
          <ellipse cx="100" cy="73" rx="20" ry="5" fill="rgba(255,255,255,0.18)" />
          {/* Actuator */}
          <rect x="96" y="20" width="8" height="20" rx="3" fill={fill} />
          <rect x="78" y="16" width="44" height="9" rx="4" fill="#ef4444" />
        </svg>
      );

    case 'check-valve':
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Pipe stubs */}
          <rect x="18" y="68" width="36" height="14" rx="2" fill={fill} />
          <rect x="146" y="68" width="36" height="14" rx="2" fill={fill} />
          {/* Body */}
          <rect x="54" y="50" width="92" height="50" rx="8" fill={fill} />
          <rect x="54" y="50" width="92" height="13" rx="8" fill="rgba(255,255,255,0.18)" />
          {/* Flange ends */}
          <rect x="48" y="48" width="10" height="54" rx="3" fill={fill} />
          <rect x="142" y="48" width="10" height="54" rx="3" fill={fill} />
          {/* Flow arrow */}
          <path d="M74 75 L122 75 M113 66 L122 75 L113 84" stroke="rgba(59,130,246,0.85)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    case 'pipe-elbow':
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Vertical arm */}
          <rect x="80" y="18" width="24" height="84" rx="4" fill={fill} />
          <rect x="80" y="18" width="24" height="6" rx="4" fill="rgba(255,255,255,0.14)" />
          {/* Top flange */}
          <rect x="70" y="14" width="44" height="10" rx="3" fill={fill} />
          <rect x="70" y="14" width="44" height="5" rx="3" fill="rgba(255,255,255,0.22)" />
          {/* Horizontal arm */}
          <rect x="18" y="96" width="86" height="24" rx="4" fill={fill} />
          <rect x="18" y="96" width="86" height="6" rx="4" fill="rgba(255,255,255,0.12)" />
          {/* Left flange */}
          <rect x="14" y="88" width="10" height="40" rx="3" fill={fill} />
          <rect x="14" y="88" width="10" height="8" rx="3" fill="rgba(255,255,255,0.22)" />
          {/* Corner arc to smooth the join */}
          <path d="M80,100 Q80,120 104,120" fill="none" stroke={color} strokeWidth="24" strokeLinecap="round" />
          <path d="M80,100 Q80,120 104,120" fill="none" stroke={br} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
        </svg>
      );

    case 'hdpe-pipe':
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Barrel */}
          <rect x="18" y="58" width="164" height="34" rx="17" fill={fill} />
          <rect x="18" y="58" width="164" height="7" rx="17" fill="rgba(255,255,255,0.07)" />
          {/* Blue identification stripes */}
          <line x1="24" y1="66" x2="176" y2="66" stroke="#2563eb" strokeWidth="2.5" strokeOpacity="0.9" />
          <line x1="24" y1="84" x2="176" y2="84" stroke="#2563eb" strokeWidth="2.5" strokeOpacity="0.9" />
          {/* Hollow ends */}
          <ellipse cx="20" cy="75" rx="7" ry="17" fill={dk} />
          <ellipse cx="180" cy="75" rx="7" ry="17" fill={dk} />
        </svg>
      );

    case 'ef-coupler':
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Short wide body */}
          <rect x="52" y="46" width="96" height="58" rx="8" fill={fill} />
          <rect x="52" y="46" width="96" height="13" rx="8" fill="rgba(255,255,255,0.12)" />
          {/* Electrofusion wire rings */}
          {[70,86,100,114,130].map((x) => (
            <rect key={x} x={x-2} y="46" width="4" height="58" rx="1" fill="#3b82f6" fillOpacity="0.75" />
          ))}
          {/* End caps */}
          <ellipse cx="52" cy="75" rx="9" ry="29" fill={dk} />
          <ellipse cx="148" cy="75" rx="9" ry="29" fill={dk} />
          <ellipse cx="52" cy="75" rx="4" ry="16" fill="rgba(0,0,0,0.6)" />
          <ellipse cx="148" cy="75" rx="4" ry="16" fill="rgba(0,0,0,0.6)" />
        </svg>
      );

    case 'dwc-pipe': {
      // Corrugated outer wall
      const peaks: string[] = [];
      const troughs: string[] = [];
      const n = 9;
      const x0 = 18, x1 = 182, yPeak = 52, yTrough = 64;
      const step = (x1 - x0) / n;
      for (let i = 0; i <= n; i++) {
        const x = x0 + i * step;
        peaks.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${i % 2 === 0 ? yPeak : yTrough}`);
      }
      for (let i = n; i >= 0; i--) {
        const x = x0 + i * step;
        const yb1 = 98, yb2 = 86;
        troughs.push(`L${x.toFixed(1)},${i % 2 === 0 ? yb1 : yb2}`);
      }
      const d = peaks.join(' ') + ' ' + troughs.join(' ') + ' Z';
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Inner smooth tube */}
          <rect x="18" y="66" width="164" height="20" rx="6" fill={colorAdj(color, 25)} />
          {/* Corrugated outer */}
          <path d={d} fill={fill} />
          <path d={peaks.join(' ')} fill="none" stroke={br} strokeWidth="1.5" strokeOpacity="0.4" />
          {/* End caps */}
          <ellipse cx="20" cy="75" rx="7" ry="23" fill={dk} />
          <ellipse cx="180" cy="75" rx="7" ry="23" fill={dk} />
        </svg>
      );
    }

    case 'opvc-pipe':
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Barrel */}
          <rect x="18" y="60" width="164" height="30" rx="15" fill={fill} />
          <rect x="18" y="60" width="164" height="7" rx="15" fill="rgba(255,255,255,0.28)" />
          {/* Blue end bands */}
          <rect x="18" y="60" width="32" height="30" rx="15" fill="#2563eb" fillOpacity="0.55" />
          <rect x="150" y="60" width="32" height="30" rx="15" fill="#2563eb" fillOpacity="0.55" />
          {/* Hollow ends */}
          <ellipse cx="20" cy="75" rx="7" ry="15" fill={dk} />
          <ellipse cx="180" cy="75" rx="7" ry="15" fill={dk} />
        </svg>
      );

    case 'gi-pipe':
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Main barrel */}
          <rect x="46" y="62" width="108" height="26" rx="4" fill={fill} />
          <rect x="46" y="62" width="108" height="6" fill="rgba(255,255,255,0.2)" />
          {/* Left threaded section */}
          {Array.from({length: 7}, (_,i) => (
            <rect key={i} x={18+i*4} y="60" width="3" height="30" rx="0.5"
              fill={i%2===0 ? br : dk} fillOpacity="0.9" />
          ))}
          {/* Right threaded section */}
          {Array.from({length: 7}, (_,i) => (
            <rect key={i} x={158+i*4} y="60" width="3" height="30" rx="0.5"
              fill={i%2===0 ? br : dk} fillOpacity="0.9" />
          ))}
          {/* Hollow ends */}
          <ellipse cx="20" cy="75" rx="5" ry="13" fill={dk} />
          <ellipse cx="180" cy="75" rx="5" ry="13" fill={dk} />
        </svg>
      );

    case 'tmt-bar':
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Two vertical bars */}
          <rect x="78" y="10" width="18" height="130" rx="5" fill={fill} />
          <rect x="104" y="10" width="18" height="130" rx="5" fill={fill} />
          <rect x="78" y="10" width="18" height="5" rx="5" fill="rgba(255,255,255,0.15)" />
          <rect x="104" y="10" width="18" height="5" rx="5" fill="rgba(255,255,255,0.15)" />
          {/* Transverse ribs on left bar */}
          {Array.from({length: 9}, (_,i) => (
            <rect key={i} x="70" y={16+i*13} width="28" height="5" rx="2" fill={colorAdj(color, 45)} />
          ))}
          {/* Transverse ribs on right bar (offset by half pitch) */}
          {Array.from({length: 9}, (_,i) => (
            <rect key={i} x="102" y={22+i*13} width="28" height="5" rx="2" fill={colorAdj(color, 45)} />
          ))}
        </svg>
      );

    case 'bolt':
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          {/* Hex head */}
          <polygon points="100,16 122,28 122,54 100,66 78,54 78,28" fill={fill} />
          <polygon points="100,16 122,28 122,36 100,24 78,36 78,28" fill="rgba(255,255,255,0.2)" />
          {/* Washer */}
          <ellipse cx="100" cy="68" rx="28" ry="8" fill={fill} />
          <ellipse cx="100" cy="68" rx="28" ry="3" fill="rgba(255,255,255,0.12)" />
          {/* Shank */}
          <rect x="88" y="68" width="24" height="64" rx="4" fill={fill} />
          <rect x="88" y="68" width="24" height="6" fill="rgba(255,255,255,0.1)" />
          {/* Thread lines */}
          {Array.from({length: 8}, (_,i) => (
            <line key={i} x1="88" y1={78+i*8} x2="112" y2={74+i*8} stroke="rgba(0,0,0,0.28)" strokeWidth="2" />
          ))}
          {/* Nut */}
          <polygon points="100,118 120,128 120,140 100,136 80,140 80,128" fill={fill} />
          <polygon points="100,118 120,128 120,134 100,124 80,134 80,128" fill="rgba(255,255,255,0.15)" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {defs}
          <rect x="28" y="58" width="144" height="34" rx="17" fill={fill} />
          <rect x="28" y="58" width="144" height="8" rx="17" fill="rgba(255,255,255,0.12)" />
          <ellipse cx="30" cy="75" rx="10" ry="17" fill={dk} />
          <ellipse cx="170" cy="75" rx="10" ry="17" fill={dk} />
        </svg>
      );
  }
}

export function ProductIllustration({ type, color, metalness = 0.8 }: Props) {
  const uid = useId().replace(/:/g, 'x');

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: '700px' }}>
      <div
        style={{
          width: '92%',
          height: '92%',
          animation: 'product-spin 18s linear infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            animation: 'product-float 3.5s ease-in-out infinite alternate',
            filter: 'drop-shadow(0 0 14px rgba(59,130,246,0.55))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShapeContent type={type} color={color} metalness={metalness} gid={uid} />
        </div>
      </div>
    </div>
  );
}
