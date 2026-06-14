export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  features?: string[];
  specs?: Record<string, string>;
  image?: string;
  basePrice?: string;
}

export const categories = [
  "DI Pipes",
  "CI Pipes",
  "Valves",
  "CI/DI Specials",
  "HDPE & Polymer",
  "MS & GI",
] as const;

export const products: Product[] = [

  // ── OPVC (featured — shown first) ─────────────────────────────────────────────

  {
    id: "opvc-pipes-fittings",
    name: "OPVC Pipes & Fittings",
    category: "HDPE & Polymer",
    description:
      "Oriented PVC (OPVC) pressure pipes and compatible injection-moulded fittings for high-pressure water distribution. Offers superior strength-to-weight ratio versus conventional uPVC.",
    features: [
      "Higher impact resistance than conventional uPVC",
      "Pressure ratings PN 12.5, 16, 20, and 25",
      "Smooth bore for low friction losses",
      "Lightweight and easy to transport and install",
      "Rubber ring push-fit joints",
    ],
    specs: {
      Standard: "IS:16647",
      Material: "Oriented PVC",
      "Pressure Rating": "PN 12.5 / PN 16, 20, 25",
      "Size Range": "DN 110 – 250 mm",
      "Joint Type": "Rubber Ring Push-fit",
    },
  },

  // ── DI Pipes ────────────────────────────────────────────────────────────────

  {
    id: "di-double-flange-pipe",
    name: "D.I. Double Flange Pipe",
    category: "DI Pipes",
    description: "",
    features: [
      "Manufactured in-house to IS:8329",
      "Precision-machined flanged faces for leak-proof seating",
      "Available in K9 and K12 pressure classes",
      "Bitumen or epoxy internal lining",
      "Compatible with standard DI flanged fittings",
    ],
    specs: {
      Standard: "IS:8329",
      "Pressure Class": "K9 / K12",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Flanged",
      "Internal Lining": "Bitumen / Cement Mortar",
      Coating: "Bitumen External",
    },
  },
  {
    id: "di-spun-pipe-ss",
    name: "D.I. Spun Pipe (S&S)",
    category: "DI Pipes",
    description:
      "Ductile iron centrifugally spun pipe with Socket and Spigot (Tyton push-on) joint. Stocked and distributed for potable water transmission mains, irrigation networks, and industrial pipelines.",
    features: [
      "Tyton push-on joint for fast, leak-proof installation",
      "High tensile strength and superior impact resistance",
      "Available in K7, K9, K10, K12 classes",
      "Cement mortar lined to IS:3589",
      "Bitumen external coating",
    ],
    specs: {
      Standard: "IS:8329",
      "Pressure Class": "K7 / K9 / K10 / K12",
      "Size Range": "DN 80 – 1200 mm",
      "Joint Type": "Socket & Spigot (Tyton)",
      "Internal Lining": "Cement Mortar",
      Coating: "Bitumen External",
    },
  },

  // ── CI Pipes ────────────────────────────────────────────────────────────────

  {
    id: "ci-double-flange-pipe",
    name: "C.I. Double Flange Pipe",
    category: "CI Pipes",
    description:
      "In-house manufactured centrifugally cast grey iron pipe with double flanged ends for pump houses, valve chambers, and vertical piping where rigid connections are essential.",
    features: [
      "Manufactured in-house to IS:1538",
      "Precision flanged faces for bolted assembly",
      "Available in Class LA and Class A",
      "Internal tar dipping for corrosion protection",
      "Standard bolt circle matching IS flanged fittings",
    ],
    specs: {
      Standard: "IS:1536",
      Class: "LA / A / B",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Double Flanged",
    },
  },
  {
    id: "ci-spun-pipe-ss",
    name: "C.I. Spun Pipe (S&S)",
    category: "CI Pipes",
    description:
      "Centrifugally cast grey iron pipe with Socket and Spigot ends for water supply distribution and sewerage networks. Stocked for immediate supply.",
    features: [
      "Centrifugally cast for uniform wall thickness",
      "Socket and Spigot joint with lead/rubber ring",
      "Class LA, A, and B available",
      "Long service life in buried installations",
    ],
    specs: {
      Standard: "IS:1536",
      Class: "LA / A / B",
      "Size Range": "DN 80 – 1200 mm",
      "Joint Type": "Socket & Spigot",
    },
  },

  // ── Valves ──────────────────────────────────────────────────────────────────

  {
    id: "sluice-valve",
    name: "Sluice Valve",
    category: "Valves",
    description:
      "Resilient-seated ductile iron sluice gate valve for full-bore isolation in water supply, distribution, and transmission networks. Non-rising stem design for underground installation.",
    features: [
      "Resilient EPDM seat for zero-leakage shut-off",
      "Non-rising stem suitable for underground chambers",
      "Fusion-bonded epoxy (FBE) internal and external coating",
      "Available with hand wheel or cap for key operation",
      "PN10 and PN16 rated",
    ],
    specs: {
      Standard: "IS:14846 / BS:5163",
      "Body Material": "Cast Iron / Ductile Iron",
      "Pressure Rating": "PN 10 / PN 16",
      "Size Range": "DN 50 – 1200 mm",
      Seat: "Resilient",
      Coating: "Fusion Bonded Epoxy",
    },
  },
  {
    id: "air-valve",
    name: "Air Valve",
    category: "Valves",
    description:
      "Automatic air release and vacuum break valve to eliminate trapped air pockets from pressurised water mains, preventing water hammer and pipeline damage.",
    features: [
      "Single orifice and double orifice types available",
      "Automatic air release during pipeline operation",
      "Vacuum break function on sudden pressure drop",
      "Stainless steel or ductile iron float",
      "Flanged or screwed end connections",
    ],
    specs: {
      Standard: "IS:14845",
      "Body Material": "Cast Iron / Ductile Iron",
      "Pressure Rating": "PN 10 / PN 16",
      "Size Range": "DN 25 – 200 mm",
      "Type": "Single Action / Double Action",
    },
  },
  {
    id: "butterfly-valve",
    name: "Butterfly Valve",
    category: "Valves",
    description:
      "Quarter-turn ductile iron butterfly valve for flow regulation and isolation in water treatment plants, pumping stations, and distribution networks.",
    features: [
      "Concentric and eccentric disc designs",
      "EPDM seat for water service",
      "Hand lever, gear box, or actuator operation",
      "Short face-to-face dimension for compact installation",
      "PN10 and PN16 rated",
    ],
    specs: {
      Standard: "IS:13095",
      "Body Material": "C.I. / Ductile Iron",
      "Pressure Rating": "PN 10 / PN 16",
      "Size Range": "DN 50 – 1200 mm",
    },
  },
  {
    id: "non-return-valve",
    name: "Non-Return Valve",
    category: "Valves",
    description:
      "Swing check valve designed to prevent backflow, protecting pumps and pipelines in water supply and pumping station applications.",
    features: [
      "Swing disc with resilient seat for low pressure drop",
      "Automatic closure on flow reversal",
      "Available in single-door and dual-plate designs",
      "Flanged ends to IS standard",
    ],
    specs: {
      Standard: "IS:5312",
      "Body Material": "Cast Iron / Ductile Iron",
      "Pressure Rating": "PN 10 / PN 16",
      "Size Range": "DN 50 – 600 mm",
      "Type": "Swing Check",
    },
  },

  // ── DI Specials ─────────────────────────────────────────────────────────────

  {
    id: "di-specials",
    name: "C.I./D.I. Specials",
    category: "CI/DI Specials",
    description:
      "Complete range of ductile iron pipeline fittings and specials — bends, tees, reducers, tapers, collars, flanged adaptors, dismantling joints, and mechanical couplings — to IS:9523 for DI water mains.",
    features: [
      "Full range: bends (11.25°, 22.5°, 45°, 90°), tees, reducers, tapers",
      "Flanged, mechanical joint, and push-on end variants",
      "Cement mortar or epoxy internal lining",
      "Bitumen or fusion-bonded epoxy external coating",
      "Custom specials fabricated to drawing",
    ],
    specs: {
      Standard: "IS:9523 / IS:1538",
      "Size Range": "DN 80 – 1200 mm",
      "Pressure Class": "PN 10-16",
      "Internal Lining": "Cement Mortar / Epoxy",
      Coating: "Bitumen / FBE",
      "End Types": "Flanged / Socket & Spigot / Mechanical Joint",
    },
  },

  // ── HDPE & Polymer ──────────────────────────────────────────────────────────

  {
    id: "hdpe-pipes",
    name: "HDPE Pipes",
    category: "HDPE & Polymer",
    description:
      "High-density polyethylene (PE-100) pipes for potable water supply, sewerage, industrial effluent, and irrigation systems. Lightweight, flexible, and corrosion-free.",
    features: [
      "PE-100 material for maximum pressure capacity",
      "Pressure ratings PN 4 to PN 20",
      "Excellent chemical and corrosion resistance",
      "Butt fusion and electrofusion jointing",
      "Rolls and straight lengths available",
    ],
    specs: {
      Standard: "IS:4984",
      Material: "PE-100 (HDPE)",
      "Pressure Range": "PN 4 – PN 20",
      "Size Range": "DN 20 – 250 mm",
      Colour: "Black with blue stripes (water)",
    },
  },
  {
    id: "hdpe-specials",
    name: "HDPE Specials",
    category: "HDPE & Polymer",
    description:
      "HDPE fabricated and moulded fittings — bends, tees, reducers, end caps, flanged stub ends, and couplings — for HDPE pipeline systems using butt fusion or electrofusion jointing.",
    features: [
      "Injection moulded and fabricated fittings",
      "Matching SDR rating to pipe for system integrity",
      "Fully compatible with PE-100 butt fusion joining",
      "Flanged stub ends for connection to metal systems",
    ],
    specs: {
      "Size Range": "DN 20 – 250 mm",
      "Jointing Method": "Butt Fusion",
      "Pressure Rating": "PN 4 – PN 20",
    },
  },
  {
    id: "electrofusion-fittings",
    name: "Electrofusion Fittings",
    category: "HDPE & Polymer",
    description:
      "Electrofusion couplers, elbows, tees, saddles, and end caps for jointing HDPE pipes in water and gas distribution networks, providing a fully sealed, corrosion-free connection.",
    features: [
      "Embedded resistance wire for precise fusion",
      "Compatible with PE-80 and PE-100 pipes",
      "Barcode welding parameters for controlled fusion",
      "Saddle fittings for branch connections without cutting the main",
    ],
    specs: {
      Standard: "ISO:13950 / IS:15927 (Part 3)",
      Pressure: "PN 10-16",
      "Size Range": "DN 20 – 250 mm",
      "Fusion Method": "Electrofusion (EF) Controller",
    },
  },
  {
    id: "dwc-pipes",
    name: "DWC Pipes",
    category: "HDPE & Polymer",
    description:
      "Double Wall Corrugated (DWC) HDPE pipes with smooth inner wall and corrugated outer wall for underground storm drainage, sewer, and cable ducting applications.",
    features: [
      "Smooth inner bore for superior hydraulic flow",
      "Corrugated outer layer for high ring stiffness",
      "Lightweight — easy handling and installation",
      "SN4 and SN8 ring stiffness classes available",
      "Integral bell-and-spigot or rubber ring joints",
    ],
    specs: {
      Standard: "IS:16098",
      Material: "HDPE",
      "Ring Stiffness": "SN4 / SN8",
      "Size Range": "DN 100 – 900 mm",
      Colour: "Black Outer / Orange Inner",
    },
  },

  // ── MS & GI ─────────────────────────────────────────────────────────────────

  {
    id: "ms-pipes",
    name: "M.S. Pipes",
    category: "MS & GI",
    description:
      "Mild steel welded and seamless pipes for industrial fluid transmission, structural applications, water mains, and fire-fighting systems. Stocked in a wide range of schedules and lengths.",
    features: [
      "ERW and seamless construction",
      "Available in IS Grade A, B, and C",
      "Plain ends, bevelled ends, or threaded ends",
      "Internal and external coating options",
      "Custom lengths and wall thicknesses available",
    ],
    specs: {
      Standard: "IS:1239 / IS:3589",
      Material: "Mild Steel",
      "Grade": "Grade A / B / C",
      "Size Range": "DN 15 – 1600 mm",
      "Wall Thickness": "Light / Medium / Heavy",
    },
  },
  {
    id: "ms-specials",
    name: "M.S. Specials",
    category: "MS & GI",
    description:
      "Fabricated mild steel pipeline fittings and specials — bends, tees, reducers, flanges, and expansion joints — for MS pipeline systems in water supply, irrigation, and industrial projects.",
    features: [
      "Fabricated from IS Grade MS plates and pipes",
      "Custom bends, tees, reducers to project drawings",
      "Flanged or welded end connections",
      "Internal cement mortar lining or epoxy coating",
      "External anticorrosion coating",
    ],
    specs: {
      Standard: "IS:1239 / IS:3589",
      Material: "Mild Steel",
      "End Connection": "Flanged / Welded / Screwed",
      "Size Range": "DN 15 – 1600 mm (custom)",
    },
  },
  {
    id: "gi-pipes",
    name: "G.I. Pipes",
    category: "MS & GI",
    description:
      "Hot-dip galvanized mild steel pipes for potable water supply, plumbing, irrigation, and air distribution systems. Available in light, medium, and heavy classes per IS:1239.",
    features: [
      "Hot-dip galvanizing for superior corrosion protection",
      "Available in light, medium, and heavy wall classes",
      "Threaded ends with IS:554 taper thread",
      "Suitable for potable water and food-grade applications",
    ],
    specs: {
      Standard: "IS:1239 (Part 1)",
      Material: "Galvanized Mild Steel",
      "Class": "Light / Medium / Heavy",
      "Size Range": "NB 15 – 150 mm",
      "Galvanizing": "Hot-Dip (IS:4736)",
    },
  },
  {
    id: "gi-specials",
    name: "G.I. Specials",
    category: "MS & GI",
    description:
      "Galvanized iron malleable cast iron and forged fittings — elbows, tees, unions, reducers, sockets, and nipples — for GI pipe connections in water supply and plumbing systems.",
    features: [
      "Hot-dip galvanized for corrosion resistance",
      "Malleable iron and forged steel options",
      "IS:554 taper threaded connections",
      "Full range of standard fittings stocked",
    ],
    specs: {
      Standard: "IS:1239 / IS:1879",
      Material: "Galvanized Malleable Iron / Forged Steel",
      "Thread": "IS:554 Taper BSP",
      "Size Range": "NB 15 – 150 mm",
    },
  },
  {
    id: "tmt-bars",
    name: "TMT Bars",
    category: "MS & GI",
    description:
      "Thermo-mechanically treated (TMT) high-strength deformed reinforcement bars for structural concrete, bridges, buildings, and infrastructure projects.",
    features: [
      "Superior weldability without loss of strength",
      "High ductility and bendability",
      "Ribbed surface for maximum bond with concrete",
      "Fe 500, Fe 500D, and Fe 550 grades available",
      "Corrosion-resistant surface treatment",
    ],
    specs: {
      Standard: "IS:1786",
      Grade: "Fe 500 / Fe 500D / Fe 550",
      "Diameter Range": "8 mm – 32 mm",
    },
  },
  {
    id: "ms-bolts-nut-bolts",
    name: "MS Bolts & Nut Bolts",
    category: "MS & GI",
    description:
      "High-tensile mild steel hexagonal bolts, nuts, and washers for flanged joint assembly in DI, CI, and MS pipeline systems. Stocked in standard and custom lengths.",
    features: [
      "Hex head bolts and hex nuts to IS:1363 / IS:1367",
      "Plain and hot-dip galvanized finishes",
      "M12 to M48 diameter range",
      "Grade 4.6 and 8.8 tensile classes",
      "Stainless Steel 304/316 available on request",
    ],
    specs: {
      Standard: "IS:1363 / IS:1367",
      Material: "Mild Steel / Stainless Steel (optional)",
      Grade: "4.6 / 8.8",
      "Size Range": "M12 – M48",
      Finish: "Plain / Hot-Dip Galvanized / Black",
    },
  },
];
