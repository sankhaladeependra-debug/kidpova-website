/*
 * Kid Pavo — Pavo character + mark generator.
 * Single source of truth for all Pavo art. Used by the brand book (browser)
 * and by build.js (Node) to export editable SVG files.
 *
 * Construction grid: Pavo is drawn on a 200 x 210 unit canvas.
 *   body  : egg silhouette, x 24–176, y 28–202
 *   face  : two-lobed "peanut" patch, eyes at (78,96) and (122,96)
 *   sprout: signature two-leaf tuft, top of head, y 2–30
 *   wings : pivot at shoulder (38,112), mirrored for the right side
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KidPavo = api;
})(typeof self !== 'undefined' ? self : this, function () {
  const C = {
    ink: '#1B2B44',
    body: '#22385A',
    wing: '#2E4B74',
    face: '#FFF8EE',
    beak: '#FF8A73',
    mouth: '#C2472F',
    cheek: '#FF8A73',
    leaf: '#1FA39A',
    leaf2: '#6FD0C4',
    sun: '#FFC94A',
    sky: '#9AD4F5',
    teal: '#1FA39A',
    teal700: '#0E6B66',
    rice: '#FFF8EE',
    coral: '#FF8A73',
  };

  const BODY = 'M100 28 C150 28 176 78 176 128 C176 175 145 202 100 202 C55 202 24 175 24 128 C24 78 50 28 100 28 Z';
  const FACE = 'M100 62 C118 50 150 56 154 86 C158 110 146 128 134 136 C150 150 152 178 136 190 C122 199 78 199 64 190 C48 178 50 150 66 136 C54 128 42 110 46 86 C50 56 82 50 100 62 Z';
  const WING = 'M38 104 C21 111 9 134 12 157 C14 163 21 163 25 158 C35 146 43 132 45 119 Z';
  const LEAF_L = 'M100 21 C93 9 81 6 73 12 C79 21 91 25 100 21 Z';
  const LEAF_R = 'M100 17 C105 4 119 0 128 5 C123 15 111 20 100 17 Z';
  const STEM = 'M100 31 L100 18';

  const WING_POSE = { down: 0, out: 28, gesture: 44, point: 64, up: 112, wave: 130, chin: -106, ear: 150 };
  const wingAngle = p => (typeof p === 'number' ? p : WING_POSE[p] || 0);

  function feet(mode, fill, stroke) {
    const s = stroke ? ` stroke="${stroke}" stroke-width="10" stroke-linejoin="round"` : '';
    if (mode === 'step') {
      return `<ellipse cx="78" cy="200" rx="15" ry="6.5" transform="rotate(-14 78 200)" fill="${fill}"${s}/>` +
        `<ellipse cx="122" cy="205" rx="15" ry="6.5" fill="${fill}"${s}/>`;
    }
    return `<ellipse cx="80" cy="204" rx="15" ry="6.5" fill="${fill}"${s}/><ellipse cx="120" cy="204" rx="15" ry="6.5" fill="${fill}"${s}/>`;
  }

  function wings(o, fill, stroke) {
    const s = stroke ? ` stroke="${stroke}" stroke-width="10" stroke-linejoin="round"` : '';
    const l = `<g transform="rotate(${wingAngle(o.left)} 38 112)"><path d="${WING}" fill="${fill}"${s}/></g>`;
    const r = `<g transform="translate(200 0) scale(-1 1)"><g transform="rotate(${wingAngle(o.right)} 38 112)"><path d="${WING}" fill="${fill}"${s}/></g></g>`;
    return l + r;
  }

  function sprout(stroke) {
    if (stroke) {
      return `<path d="${STEM}" stroke="${stroke}" stroke-width="13" stroke-linecap="round" fill="none"/>` +
        `<path d="${LEAF_L}" fill="${stroke}" stroke="${stroke}" stroke-width="10" stroke-linejoin="round"/>` +
        `<path d="${LEAF_R}" fill="${stroke}" stroke="${stroke}" stroke-width="10" stroke-linejoin="round"/>`;
    }
    return `<path d="${STEM}" stroke="${C.leaf}" stroke-width="4" stroke-linecap="round" fill="none"/>` +
      `<path d="${LEAF_L}" fill="${C.leaf}"/><path d="${LEAF_R}" fill="${C.leaf2}"/>`;
  }

  function eye(cx, cy, type, look) {
    const [dx, dy] = look || [0, 0];
    const x = cx + dx, y = cy + dy;
    switch (type) {
      case 'happy':
        return `<path d="M${cx - 10} ${cy + 4} Q${cx} ${cy - 11} ${cx + 10} ${cy + 4}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" fill="none"/>`;
      case 'closed':
        return `<path d="M${cx - 10} ${cy} Q${cx} ${cy + 9} ${cx + 10} ${cy}" stroke="${C.ink}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`;
      case 'soft':
        return `<ellipse cx="${x}" cy="${y + 1}" rx="10" ry="11" fill="${C.ink}"/>` +
          `<path d="M${cx - 13} ${cy - 7} Q${cx} ${cy - 13} ${cx + 13} ${cy - 7} L${cx + 13} ${cy - 16} L${cx - 13} ${cy - 16} Z" fill="${C.face}"/>` +
          `<circle cx="${x + 3.5}" cy="${y - 1}" r="3.2" fill="#fff"/>`;
      case 'wide':
        return `<ellipse cx="${x}" cy="${y}" rx="11.5" ry="14.5" fill="${C.ink}"/>` +
          `<circle cx="${x + 4}" cy="${y - 5.5}" r="4.2" fill="#fff"/><circle cx="${x - 3.5}" cy="${y + 5.5}" r="1.8" fill="#fff"/>`;
      default:
        return `<ellipse cx="${x}" cy="${y}" rx="10.5" ry="13" fill="${C.ink}"/>` +
          `<circle cx="${x + 3.5}" cy="${y - 5}" r="3.7" fill="#fff"/><circle cx="${x - 3}" cy="${y + 5}" r="1.6" fill="#fff"/>`;
    }
  }

  function brows(type) {
    const st = `stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round" fill="none"`;
    if (type === 'raised') return `<path d="M68 79 Q77 76 86 79" ${st}/><path d="M114 72 Q123 66 132 71" ${st}/>`;
    if (type === 'soft') return `<path d="M68 80 Q77 74 86 77" ${st}/><path d="M114 77 Q123 74 132 80" ${st}/>`;
    return '';
  }

  function beak(type) {
    const upper = `<path d="M89 108 Q100 103 111 108 Q106 115 100 115 Q94 115 89 108 Z" fill="${C.beak}"/>`;
    if (type === 'smile') return `<path d="M91.5 112 Q100 129 108.5 112 Z" fill="${C.mouth}"/>` + upper;
    if (type === 'talk') return `<ellipse cx="100" cy="117" rx="5.5" ry="4.5" fill="${C.mouth}"/>` + upper;
    return `<path d="M89 109 Q100 104 111 109 Q106 119 100 120 Q94 119 89 109 Z" fill="${C.beak}"/>`;
  }

  /**
   * pavo(options) -> SVG group markup (no <svg> wrapper), 200x210 canvas.
   * options: eyes open|wide|soft|happy|closed, look [dx,dy], brows none|raised|soft,
   *          beak closed|smile|talk, left/right wing pose, tilt (deg), feet stand|step,
   *          outline (keyline colour for dark backgrounds), cheeks (bool, default true),
   *          back / front (extra SVG drawn behind / in front, untilted)
   */
  function pavo(o = {}) {
    const opt = Object.assign({ eyes: 'open', beak: 'closed', brows: 'none', left: 'down', right: 'down', tilt: 0, feet: 'stand', cheeks: true }, o);
    let g = '';
    if (opt.outline) {
      g += `<g>${feet(opt.feet, opt.outline, opt.outline)}${sprout(opt.outline)}` +
        `<path d="${BODY}" fill="${opt.outline}" stroke="${opt.outline}" stroke-width="10" stroke-linejoin="round"/>${wings(opt, opt.outline, opt.outline)}</g>`;
    }
    g += feet(opt.feet, C.beak);
    g += sprout();
    g += `<path d="${BODY}" fill="${C.body}"/>`;
    g += `<path d="${FACE}" fill="${C.face}"/>`;
    if (opt.cheeks) g += `<ellipse cx="62" cy="115" rx="8" ry="5" fill="${C.cheek}" opacity=".45"/><ellipse cx="138" cy="115" rx="8" ry="5" fill="${C.cheek}" opacity=".45"/>`;
    g += brows(opt.brows);
    g += eye(78, 96, opt.eyes, opt.look) + eye(122, 96, opt.eyes, opt.look);
    g += beak(opt.beak);
    g += wings(opt, C.wing);
    const tilted = opt.tilt ? `<g transform="rotate(${opt.tilt} 100 200)">${g}</g>` : g;
    return (opt.back || '') + tilted + (opt.front || '');
  }

  const VIEWBOX = '-36 -14 272 232';
  function svg(o = {}, attrs = '') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.viewBox || VIEWBOX}" role="img" aria-label="${o.label || 'Pavo'}" ${attrs}>${pavo(o)}</svg>`;
  }

  /* Head-and-shoulders crop placed inside a 200x200 frame (used by badge + app icon). */
  function bust(o = {}) {
    return `<g transform="translate(100 120) scale(1.06) translate(-100 -92)">${pavo(Object.assign({ eyes: 'open', beak: 'smile' }, o))}</g>`;
  }

  function sproutMark(size = 1) {
    // standalone sprout, 40x34 box; used as the i-dot and favicon micro-mark
    return `<g transform="scale(${size})"><path d="M20 33 L20 19" stroke="${C.leaf}" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M20 22 C14 11 5 8 -1 13 C4 22 13 26 20 22 Z" fill="${C.leaf}"/>` +
      `<path d="M20 18 C24 6 35 1 42 5 C38 15 28 21 20 18 Z" fill="${C.leaf2}"/></g>`;
  }

  /* Concept A badge: Pavo bust in a circle. */
  function badge(bg = C.teal, id = 'b') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="Pavo badge">` +
      `<defs><clipPath id="clip-${id}"><circle cx="100" cy="100" r="100"/></clipPath></defs>` +
      `<g clip-path="url(#clip-${id})"><rect width="200" height="200" fill="${bg}"/>${bust()}</g></svg>`;
  }

  /* Android adaptive-icon style square (full bleed; launcher applies mask). */
  function appIcon(kind = 'pavo', id = 'i') {
    const wrap = (inner, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="Kid Pavo app icon">` +
      `<defs><clipPath id="clip-${id}"><rect width="200" height="200" rx="46"/></clipPath></defs>` +
      `<g clip-path="url(#clip-${id})"><rect width="200" height="200" fill="${bg}"/>${inner}</g></svg>`;
    if (kind === 'seed') return wrap(seed(), C.teal700);
    if (kind === 'word') return wrap(
      `<text x="100" y="146" text-anchor="middle" font-family="'Baloo 2', 'Mukta', sans-serif" font-weight="800" font-size="112" fill="${C.face}">kp</text>` +
      `<g transform="translate(76 18) scale(1.2)">${sproutMark()}</g>`, C.ink);
    return wrap(`<circle cx="100" cy="108" r="78" fill="${C.leaf2}" opacity=".28"/>${bust()}`, C.teal);
  }

  /* Concept C symbol: the hatching seed (an egg that sprouts). */
  function seed() {
    return `<path d="M100 58 C134 58 156 104 156 132 C156 166 131 184 100 184 C69 184 44 166 44 132 C44 104 66 58 100 58 Z" fill="${C.face}"/>` +
      `<path d="M58 118 L74 108 L86 120 L100 106 L114 120 L126 108 L142 118" stroke="${C.teal700}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
      `<path d="M100 60 L100 36" stroke="${C.sun}" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M100 42 C88 22 70 18 60 28 C70 42 88 48 100 42 Z" fill="${C.sun}"/>` +
      `<path d="M100 36 C108 14 128 8 142 16 C134 32 116 40 100 36 Z" fill="${C.leaf2}"/>`;
  }
  function seedSymbol(bg = C.teal700, id = 's') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="Kid Pavo seed symbol">` +
      `<defs><clipPath id="clip-${id}"><rect width="200" height="200" rx="46"/></clipPath></defs>` +
      `<g clip-path="url(#clip-${id})"><rect width="200" height="200" fill="${bg}"/>${seed()}</g></svg>`;
  }


  /* ---------- Named expressions and poses (the canonical character sheet) ---------- */
  const SH = `<ellipse cx="100" cy="211" rx="62" ry="6" fill="${C.ink}" opacity=".08"/>`;
  const X = {
    thought: `<circle cx="152" cy="40" r="4" fill="${C.sky}"/><circle cx="165" cy="27" r="5.5" fill="${C.sky}"/><circle cx="182" cy="12" r="7.5" fill="${C.sky}"/>`,
    confetti: `<rect x="6" y="22" width="12" height="7" rx="2" transform="rotate(-24 12 25)" fill="${C.coral}"/><circle cx="186" cy="22" r="5.5" fill="${C.sun}"/>` +
      `<path d="M206 66 C212 56 222 56 226 60 C222 68 212 70 206 66 Z" fill="${C.leaf}"/><path d="M-10 74 L0 58 L6 76 Z" fill="${C.sky}"/>`,
    triangle: `<path d="M219 58 L234 86 L204 86 Z" fill="${C.sun}" stroke="${C.sun}" stroke-width="4" stroke-linejoin="round"/>`,
    sound: `<path d="M8 60 Q0 72 8 84" stroke="${C.sky}" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M-4 52 Q-16 72 -4 92" stroke="${C.sky}" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    play: `<circle cx="214" cy="192" r="16" fill="${C.coral}"/><path d="M199 186 Q214 196 229 186" stroke="${C.face}" stroke-width="4" fill="none"/>` +
      `<path d="M-20 204 C-20 188 -6 180 6 182 C6 196 -6 206 -20 204 Z" fill="${C.leaf}"/>`,
    count: `<circle cx="204" cy="62" r="10" fill="${C.sun}"/><circle cx="228" cy="62" r="10" fill="${C.sun}"/><circle cx="216" cy="84" r="10" fill="${C.sun}"/>` +
      `<g font-family="'Baloo 2',sans-serif" font-weight="800" font-size="13" fill="${C.ink}" text-anchor="middle"><text x="204" y="67">1</text><text x="228" y="67">2</text><text x="216" y="89">3</text></g>`,
    shapes: `<path d="M-18 60 L-4 86 L-32 86 Z" fill="${C.sun}" stroke="${C.sun}" stroke-width="4" stroke-linejoin="round"/><rect x="-30" y="20" width="24" height="24" rx="4" fill="${C.sky}"/><circle cx="-18" cy="146" r="12" fill="${C.coral}"/>`,
    explore: `<path d="M170 188 Q188 212 206 188 Z" fill="${C.sky}"/><path d="M212 204 C212 186 226 178 236 180 C236 196 226 206 212 204 Z" fill="${C.leaf}"/>`,
  };
  const EXPRESSIONS = [
    { id: 'happy', name: 'Happy & welcoming', use: 'Home screen, first launch, greeting a returning child.', o: { beak: 'smile', left: 'gesture', right: 'gesture' } },
    { id: 'curious', name: 'Curious & thinking', use: 'Before a question, while a child is choosing.', o: { look: [3, -3], brows: 'raised', right: 'chin', tilt: -4, front: X.thought } },
    { id: 'encouraging', name: 'Gently encouraging', use: 'After a wrong try. Never sad, never disappointed.', o: { eyes: 'soft', brows: 'soft', beak: 'smile', left: 'gesture' } },
    { id: 'celebrating', name: 'Celebrating', use: 'Effort and completion. Short, once per milestone.', o: { eyes: 'happy', beak: 'smile', left: 'up', right: 'up', front: X.confetti } },
    { id: 'explaining', name: 'Explaining', use: 'Introducing a concept or demonstrating a rule.', o: { beak: 'talk', right: 'point', look: [3, 0], front: X.triangle } },
    { id: 'listening', name: 'Listening', use: 'While the microphone or a child’s answer is active.', o: { eyes: 'wide', left: 'ear', tilt: 5, front: X.sound } },
    { id: 'calm', name: 'Calm & resting', use: 'Loading, waiting, breathing breaks, bedtime mode.', o: { eyes: 'closed' } },
    { id: 'goodbye', name: 'Goodbye, go play', use: 'Session end. Points to a real-world activity.', o: { eyes: 'happy', beak: 'smile', right: 'wave', front: X.play } },
  ];
  const POSES = [
    { id: 'waving', name: 'Waving', o: { beak: 'smile', right: 'wave' } },
    { id: 'walking', name: 'Walking', o: { feet: 'step', tilt: -4, left: 22, right: -10, look: [3, 0] } },
    { id: 'pointing', name: 'Pointing', o: { right: 'point', look: [4, 0] } },
    { id: 'listening', name: 'Listening', o: { eyes: 'soft', left: 'ear', tilt: 5, front: X.sound } },
    { id: 'celebrating', name: 'Celebrating', o: { eyes: 'happy', beak: 'smile', left: 'up', right: 'up', front: X.confetti } },
    { id: 'counting', name: 'Counting', o: { beak: 'talk', right: 'point', left: 'gesture', look: [4, -2], front: X.count } },
    { id: 'shapes', name: 'Showing shapes', o: { beak: 'talk', left: 'point', look: [-4, 0], front: X.shapes } },
    { id: 'explore', name: 'Inviting to explore', o: { beak: 'smile', left: 'out', right: 'point', look: [3, 3], front: X.explore } },
  ];

  return { C, SH, EXPRESSIONS, POSES, pavo, svg, bust, badge, appIcon, seed, seedSymbol, sproutMark, VIEWBOX, WING_POSE };
});
