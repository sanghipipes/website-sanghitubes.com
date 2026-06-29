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
      "Available in K9 pressure class",
      "Bitumen or epoxy internal lining",
      "Compatible with standard DI flanged fittings",
    ],
    specs: {
      Standard: "IS:8329",
      "Pressure Class": "K9",
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
    id: "di-flanged-bend-45",
    name: "D.I. Double Flanged 45° Bend",
    category: "CI/DI Specials",
    description:
      "Cast ductile iron 45° bend with double flanged ends for changing pipeline direction in flanged DI/CI systems — pump houses, valve chambers, and treatment plant pipework.",
    features: [
      "45° deflection (11.25°, 22.5°, 45°, 90° available)",
      "Precision-machined flanged faces both ends",
      "Bolts directly to standard DI flanged pipes and fittings",
      "Cement mortar or epoxy internal lining",
      "Bitumen or fusion-bonded epoxy external coating",
    ],
    specs: {
      Standard: "IS:9523 / IS:1538",
      Angle: "45°",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Double Flanged",
      "Internal Lining": "Cement Mortar / Epoxy",
      Coating: "Bitumen / FBE",
    },
  },
  {
    id: "di-socket-tee",
    name: "All Socket Tees",
    category: "CI/DI Specials",
    description:
      "Ductile iron all-socket tee with push-on (Tyton) socket ends on all three outlets for branch connections in socket & spigot DI pipelines.",
    features: [
      "Push-on rubber-ring sockets on all three ends",
      "Fast, leak-proof flexible joints",
      "Equal and reducing branch configurations",
      "Fusion-bonded epoxy internal and external coating",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523",
      "End Types": "All Socket (Push-on)",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Rubber Ring Push-fit",
      Coating: "Fusion Bonded Epoxy",
    },
  },
  {
    id: "di-flanged-tee",
    name: "C.I./D.I. All Flanged Tee",
    category: "CI/DI Specials",
    description:
      "Ductile iron all-flanged tee providing a flanged branch outlet on a flanged run — for valve and instrument take-offs in pump houses and flanged pipework.",
    features: [
      "Flanged faces on all three outlets",
      "Equal and reducing branch tees available",
      "Precision-machined faces for bolted assembly",
      "Cement mortar or epoxy internal lining",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523 / IS:1538",
      "End Types": "All Flanged",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Flanged",
      Coating: "Bitumen / FBE",
    },
  },
  {
    id: "di-flanged-cross",
    name: "All Flanged Crosses",
    category: "CI/DI Specials",
    description:
      "Ductile iron all-flanged cross (4-way) for cross junctions and twin branch connections in flanged DI/CI pipe networks.",
    features: [
      "Four flanged outlets for cross junctions",
      "Equal and reducing branch configurations",
      "Bolts directly into flanged DI/CI systems",
      "Cement mortar or epoxy internal lining",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523 / IS:1538",
      "End Types": "Four Flanged",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Flanged",
      Coating: "Bitumen / FBE",
    },
  },
  {
    id: "di-collar",
    name: "Collars",
    category: "CI/DI Specials",
    description:
      "Ductile iron double-socket collar (coupling) for joining two spigot pipe ends with rubber-ring sealing in socket & spigot pipelines, also used for pipe repairs.",
    features: [
      "Double socket sleeve for joining two spigot ends",
      "Rubber-ring push-fit sealing",
      "Repair and connection coupling applications",
      "Fusion-bonded epoxy coating",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523",
      Type: "Double Socket Collar",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Rubber Ring Push-fit",
      Coating: "Fusion Bonded Epoxy",
    },
  },
  {
    id: "di-flanged-spigot",
    name: "Flanged Spigot",
    category: "CI/DI Specials",
    description:
      "Ductile iron flanged spigot adaptor — a flanged end on one side and a plain spigot on the other — for connecting flanged pipework to socketed (push-on) DI pipelines.",
    features: [
      "One flanged end and one plain spigot end",
      "Connects flanged systems to socket & spigot pipes",
      "Precision-machined flange face for bolted assembly",
      "Cement mortar or epoxy internal lining",
      "Bitumen or fusion-bonded epoxy external coating",
    ],
    specs: {
      Standard: "IS:9523 / IS:1538",
      "End Types": "Flange × Spigot",
      "Size Range": "DN 80 – 600 mm",
      "Internal Lining": "Cement Mortar / Epoxy",
      Coating: "Bitumen / FBE",
    },
  },
  {
    id: "di-flanged-adapter",
    name: "Flanged Adaptor",
    category: "CI/DI Specials",
    description:
      "Short ductile iron double-flanged adaptor spool for connecting two flanged ends, adjusting laying length, or completing flanged pipework in valve chambers and pump houses.",
    features: [
      "Flanged faces both ends for bolted assembly",
      "Short laying length for tight installations",
      "Cement mortar lined for corrosion protection",
      "Bolt circle matching IS flanged fittings",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523 / IS:1538",
      "End Types": "Double Flanged",
      "Size Range": "DN 80 – 600 mm",
      "Internal Lining": "Cement Mortar / Epoxy",
      Coating: "Bitumen / FBE",
    },
  },
  {
    id: "di-socket-bend-11",
    name: "Double Socket 11.25° Bend",
    category: "CI/DI Specials",
    description:
      "Ductile iron double-socket 11.25° bend with push-on (Tyton) sockets on both ends for gentle changes of direction in socket & spigot DI water mains.",
    features: [
      "11.25° deflection (also 22.5°, 45°, 90° available)",
      "Push-on rubber-ring sockets both ends",
      "Fast, flexible, leak-proof installation",
      "Fusion-bonded epoxy internal and external coating",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523",
      Angle: "11.25°",
      "End Types": "Double Socket (Push-on)",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Rubber Ring Push-fit",
    },
  },
  {
    id: "di-plug",
    name: "Plugs",
    category: "CI/DI Specials",
    description:
      "Ductile iron end plug for sealing the open spigot end of a socketed pipe or fitting — used to terminate or temporarily close off DI pipelines under pressure.",
    features: [
      "Seals the open end of socket & spigot pipelines",
      "Rubber-ring sealing for leak-proof closure",
      "Withstands full pipeline test pressure",
      "Fusion-bonded epoxy coating",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523",
      Type: "Spigot End Plug",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Rubber Ring Push-fit",
      Coating: "Fusion Bonded Epoxy",
    },
  },
  {
    id: "di-duckfoot-bend-90",
    name: "Duckfoot Bend",
    category: "CI/DI Specials",
    description:
      "Ductile iron duckfoot 90° bend with double flanged ends and an integral base foot for floor mounting — typically used at the base of pump delivery risers to take vertical loads.",
    features: [
      "90° change of direction with flanged ends",
      "Integral duckfoot base plate for floor bolting",
      "Supports vertical riser loads at pump discharge",
      "Cement mortar or epoxy internal lining",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523 / IS:1538",
      Angle: "90°",
      "End Types": "Double Flanged + Duckfoot Base",
      "Size Range": "DN 80 – 600 mm",
      Coating: "Bitumen / FBE",
    },
  },
  {
    id: "di-socket-cross",
    name: "All Socket Cross",
    category: "CI/DI Specials",
    description:
      "Ductile iron all-socket cross (4-way) with push-on (Tyton) sockets on all four outlets for cross junctions in socket & spigot DI pipelines.",
    features: [
      "Four push-on rubber-ring sockets",
      "Equal and reducing branch configurations",
      "Fast, flexible, leak-proof installation",
      "Fusion-bonded epoxy internal and external coating",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523",
      "End Types": "Four Socket (Push-on)",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Rubber Ring Push-fit",
      Coating: "Fusion Bonded Epoxy",
    },
  },
  {
    id: "di-flange-socket-tee",
    name: "Flange On Double Socket Tees / F.H. Tee",
    category: "CI/DI Specials",
    description:
      "Ductile iron tee with push-on sockets on the run and a flanged branch outlet — for connecting a flanged branch (valve, hydrant, or meter) onto a socket & spigot DI main.",
    features: [
      "Push-on rubber-ring sockets on the run (both ends)",
      "Flanged branch outlet for bolted connections",
      "Ideal for valve and hydrant take-offs",
      "Fusion-bonded epoxy coating",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523",
      "End Types": "Double Socket Run × Flanged Branch",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Rubber Ring Push-fit / Flanged",
      Coating: "Fusion Bonded Epoxy",
    },
  },
  {
    id: "di-socket-bend-90",
    name: "Ductile Iron Double Socket 90° Bend",
    category: "CI/DI Specials",
    description:
      "Ductile iron double-socket 90° bend with push-on (Tyton) sockets on both ends for right-angle changes of direction in socket & spigot DI water mains.",
    features: [
      "90° deflection (also 11.25°, 22.5°, 45° available)",
      "Push-on rubber-ring sockets both ends",
      "Fast, flexible, leak-proof installation",
      "Fusion-bonded epoxy internal and external coating",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523",
      Angle: "90°",
      "End Types": "Double Socket (Push-on)",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Rubber Ring Push-fit",
    },
  },
  {
    id: "di-bell-mouth",
    name: "Bell Mouth Pieces",
    category: "CI/DI Specials",
    description:
      "Ductile iron flanged bell mouth piece with a flared trumpet inlet — used at pump suction intakes, sumps, and tank outlets to provide smooth, low-loss entry of water into the pipeline.",
    features: [
      "Flared trumpet mouth for smooth, low-turbulence inflow",
      "Flanged end for bolted connection to pipework",
      "Reduces entry losses at suction intakes and sumps",
      "Cement mortar or epoxy internal lining",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523 / IS:1538",
      "End Types": "Flange × Flared Bell Mouth",
      "Size Range": "DN 80 – 600 mm",
      "Internal Lining": "Cement Mortar / Epoxy",
      Coating: "Bitumen / FBE",
    },
  },
  {
    id: "di-flanged-socket",
    name: "Flanged Socket",
    category: "CI/DI Specials",
    description:
      "Ductile iron flanged socket adaptor — a flanged end on one side and a push-on socket on the other — for connecting flanged pipework to socketed (push-on) DI pipelines.",
    features: [
      "One flanged end and one push-on socket end",
      "Connects flanged systems to socket & spigot pipes",
      "Rubber-ring sealing on the socket side",
      "Cement mortar or epoxy internal lining",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523 / IS:1538",
      "End Types": "Flange × Socket",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Flanged / Rubber Ring Push-fit",
      Coating: "Bitumen / FBE",
    },
  },
  {
    id: "di-mj-collar",
    name: "Mechanical Joint Collar",
    category: "CI/DI Specials",
    description:
      "Ductile iron mechanical joint collar (coupling) for joining two plain-ended pipes with bolted gland followers and rubber gaskets — a restrained, leak-proof connection without welding or threading.",
    features: [
      "Bolted gland followers with rubber gaskets each end",
      "Joins plain (spigot) pipe ends of DI, CI, MS or AC pipe",
      "Allows minor angular deflection and easy field assembly",
      "Fusion-bonded epoxy coating",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523",
      Type: "Mechanical Joint Collar",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Bolted Gland (Mechanical)",
      Coating: "Fusion Bonded Epoxy",
    },
  },
  {
    id: "di-end-cap",
    name: "End Cap",
    category: "CI/DI Specials",
    description:
      "Ductile iron end cap that fits over the plain end of a pipe to seal off the line — used to terminate DI/CI pipelines and at future extension points.",
    features: [
      "Caps over the spigot end of a pipe",
      "Seals the end of DI/CI pipelines",
      "Withstands full pipeline test pressure",
      "Fusion-bonded epoxy coating",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523",
      Type: "Spigot End Cap",
      "Size Range": "DN 80 – 600 mm",
      Coating: "Fusion Bonded Epoxy",
    },
  },
  {
    id: "di-blank-flange",
    name: "Blank Flanges",
    category: "CI/DI Specials",
    description:
      "Ductile iron blank (blind) flange — a solid bolt-drilled disk with no bore — used to close off a flanged pipe end, valve, or vessel opening for isolation or future connection.",
    features: [
      "Solid blanked face — no through bore",
      "Standard bolt circle matching IS flanged fittings",
      "Seals flanged ends for isolation or testing",
      "Bitumen or fusion-bonded epoxy coating",
      "Manufactured to IS:1538",
    ],
    specs: {
      Standard: "IS:1538",
      Type: "Blind / Blank Flange",
      "Size Range": "DN 80 – 600 mm",
      "Joint Type": "Flanged",
      Coating: "Bitumen / FBE",
    },
  },
  {
    id: "di-puddle-pipe",
    name: "D.I./C.I. Puddle Pipe",
    category: "CI/DI Specials",
    description:
      "Ductile iron double-flanged puddle pipe with an integral central puddle collar (flange) cast into concrete walls of tanks, sumps, and structures to give a watertight pipe penetration.",
    features: [
      "Integral central puddle flange for casting into concrete",
      "Flanged ends both sides for bolted connection",
      "Provides a watertight wall penetration (water-stop)",
      "Cement mortar or epoxy internal lining",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523 / IS:1538",
      "End Types": "Double Flanged + Central Puddle Collar",
      "Size Range": "DN 80 – 600 mm",
      "Internal Lining": "Cement Mortar / Epoxy",
      Coating: "Bitumen / FBE",
    },
  },
  {
    id: "di-single-flange-pipe",
    name: "D.I./C.I. Single Flange Pipe",
    category: "CI/DI Specials",
    description:
      "Ductile iron single-flanged pipe with a flanged end on one side and a plain spigot on the other — used for connecting flanged pipework to plain-ended pipe runs and at wall ends.",
    features: [
      "One flanged end and one plain spigot end",
      "Connects flanged systems to plain pipe runs",
      "Precision-machined flange face for bolted assembly",
      "Cement mortar or epoxy internal lining",
      "Manufactured to IS:9523",
    ],
    specs: {
      Standard: "IS:9523 / IS:1538",
      "End Types": "Flange × Spigot",
      "Size Range": "DN 80 – 600 mm",
      "Internal Lining": "Cement Mortar / Epoxy",
      Coating: "Bitumen / FBE",
    },
  },

  // ── HDPE & Polymer ──────────────────────────────────────────────────────────

  {
    id: "hdpe-pipes",
    name: "HDPE Pipes & Specials",
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
    name: "M.S. Pipes & Specials",
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
    id: "gi-pipes",
    name: "G.I. Pipes & Specials",
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
