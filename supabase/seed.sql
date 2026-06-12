-- ============================================================
-- SANGHI TUBES PRIVATE LIMITED — Seed Data
-- Run after migrations to populate the products table.
-- ============================================================

INSERT INTO products (name, slug, category, description, material, featured) VALUES

  -- DI Pipes
  (
    'D.I. Double Flange Pipe',
    'di-double-flange-pipe',
    'DI Pipes',
    'In-house manufactured centrifugally cast ductile iron pipe with precision-machined double flanged ends. Engineered for pump houses, bridge crossings, and vertical installations where rigid joints are required.',
    'Ductile Iron',
    true
  ),
  (
    'D.I. Spun Pipe (S&S)',
    'di-spun-pipe-ss',
    'DI Pipes',
    'Ductile iron centrifugally spun pipe with Socket and Spigot Tyton push-on joint. Stocked and distributed for potable water transmission mains, irrigation networks, and industrial pipelines.',
    'Ductile Iron',
    true
  ),

  -- CI Pipes
  (
    'C.I. Double Flange Pipe',
    'ci-double-flange-pipe',
    'CI Pipes',
    'In-house manufactured centrifugally cast grey iron pipe with double flanged ends for pump houses, valve chambers, and vertical piping where rigid connections are essential.',
    'Cast Iron',
    false
  ),
  (
    'C.I. Spun Pipe (S&S)',
    'ci-spun-pipe-ss',
    'CI Pipes',
    'Centrifugally cast grey iron pipe with Socket and Spigot ends for water supply distribution and sewerage networks. Stocked for immediate supply.',
    'Cast Iron',
    false
  ),

  -- Valves
  (
    'Sluice Valve',
    'sluice-valve',
    'Valves',
    'Resilient-seated ductile iron sluice gate valve for full-bore isolation in water supply, distribution, and transmission networks. Non-rising stem design for underground installation.',
    'Ductile Iron',
    true
  ),
  (
    'Air Valve',
    'air-valve',
    'Valves',
    'Automatic air release and vacuum break valve to eliminate trapped air pockets from pressurised water mains, preventing water hammer and pipeline damage.',
    'Cast Iron / Ductile Iron',
    false
  ),
  (
    'Butterfly Valve',
    'butterfly-valve',
    'Valves',
    'Quarter-turn ductile iron butterfly valve for flow regulation and isolation in water treatment plants, pumping stations, and distribution networks.',
    'Ductile Iron',
    false
  ),
  (
    'Non-Return Valve',
    'non-return-valve',
    'Valves',
    'Swing check valve designed to prevent backflow, protecting pumps and pipelines in water supply and pumping station applications.',
    'Cast Iron / Ductile Iron',
    false
  ),

  -- DI Specials
  (
    'D.I. Specials',
    'di-specials',
    'DI Specials',
    'Complete range of ductile iron pipeline fittings and specials — bends, tees, reducers, tapers, collars, flanged adaptors, dismantling joints, and mechanical couplings — to IS:9523 for DI water mains.',
    'Ductile Iron',
    false
  ),

  -- HDPE & Polymer
  (
    'HDPE Pipes',
    'hdpe-pipes',
    'HDPE & Polymer',
    'High-density polyethylene PE-100 pipes for potable water supply, sewerage, industrial effluent, and irrigation systems. Lightweight, flexible, and corrosion-free.',
    'HDPE PE-100',
    true
  ),
  (
    'HDPE Specials',
    'hdpe-specials',
    'HDPE & Polymer',
    'HDPE fabricated and moulded fittings — bends, tees, reducers, end caps, flanged stub ends, and couplings — for HDPE pipeline systems using butt fusion or electrofusion jointing.',
    'HDPE PE-100',
    false
  ),
  (
    'Electrofusion Fittings',
    'electrofusion-fittings',
    'HDPE & Polymer',
    'Electrofusion couplers, elbows, tees, saddles, and end caps for jointing HDPE pipes in water and gas distribution networks, providing a fully sealed, corrosion-free connection.',
    'HDPE PE-100',
    false
  ),
  (
    'DWC Pipes',
    'dwc-pipes',
    'HDPE & Polymer',
    'Double Wall Corrugated HDPE pipes with smooth inner wall and corrugated outer wall for underground storm drainage, sewer, and cable ducting applications.',
    'HDPE',
    false
  ),
  (
    'OPVC Pipes & Fittings',
    'opvc-pipes-fittings',
    'HDPE & Polymer',
    'Oriented PVC pressure pipes and compatible injection-moulded fittings for high-pressure water distribution. Offers superior strength-to-weight ratio versus conventional uPVC.',
    'Oriented PVC',
    false
  ),

  -- MS & GI
  (
    'M.S. Pipes',
    'ms-pipes',
    'MS & GI',
    'Mild steel welded and seamless pipes for industrial fluid transmission, structural applications, water mains, and fire-fighting systems. Stocked in a wide range of schedules and lengths.',
    'Mild Steel',
    false
  ),
  (
    'M.S. Specials',
    'ms-specials',
    'MS & GI',
    'Fabricated mild steel pipeline fittings and specials — bends, tees, reducers, flanges, and expansion joints — for MS pipeline systems in water supply, irrigation, and industrial projects.',
    'Mild Steel',
    false
  ),
  (
    'G.I. Pipes',
    'gi-pipes',
    'MS & GI',
    'Hot-dip galvanized mild steel pipes for potable water supply, plumbing, irrigation, and air distribution systems. Available in light, medium, and heavy classes per IS:1239.',
    'Galvanized Steel',
    false
  ),
  (
    'G.I. Specials',
    'gi-specials',
    'MS & GI',
    'Galvanized iron malleable cast iron and forged fittings — elbows, tees, unions, reducers, sockets, and nipples — for GI pipe connections in water supply and plumbing systems.',
    'Galvanized Iron',
    false
  ),
  (
    'TMT Bars',
    'tmt-bars',
    'MS & GI',
    'Thermo-mechanically treated high-strength deformed reinforcement bars for structural concrete, bridges, buildings, and infrastructure projects.',
    'Steel',
    false
  ),
  (
    'MS Bolts & Nut Bolts',
    'ms-bolts-nut-bolts',
    'MS & GI',
    'High-tensile mild steel hexagonal bolts, nuts, and washers for flanged joint assembly in DI, CI, and MS pipeline systems. Stocked in standard and custom lengths.',
    'Mild Steel',
    false
  )

ON CONFLICT (slug) DO NOTHING;
