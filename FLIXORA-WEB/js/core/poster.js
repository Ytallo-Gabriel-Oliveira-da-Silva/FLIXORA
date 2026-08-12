// =============================================================
// FLIXORA — Pôster placeholder (SVG local, sem rede)
// =============================================================
const PALETTES = [
  ['#7C3AED','#2A0E61'], ['#A855F7','#1B0B33'], ['#5B21B6','#0D0D14'],
  ['#9333EA','#221041'], ['#6D28D9','#120A26']
];

function hash(str){
  let h = 0;
  for(let i=0;i<str.length;i++){ h = (h*31 + str.charCodeAt(i)) >>> 0; }
  return h;
}

export function posterPlaceholder(text='FLIXORA', ratio='poster'){
  const h = hash(text);
  const [c1,c2] = PALETTES[h % PALETTES.length];
  const w = ratio === 'wide' ? 480 : 320, hh = ratio === 'wide' ? 270 : 480;
  const initials = text.split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${hh}" viewBox="0 0 ${w} ${hh}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
      </linearGradient>
      <pattern id="p" width="26" height="26" patternUnits="userSpaceOnUse">
        <path d="M0 26 L26 0" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="${w}" height="${hh}" fill="url(#g)"/>
    <rect width="${w}" height="${hh}" fill="url(#p)"/>
    <text x="50%" y="50%" font-family="Sora, Arial, sans-serif" font-size="${w*0.16}" font-weight="800"
      fill="rgba(245,245,245,.85)" text-anchor="middle" dominant-baseline="middle">${initials || 'FX'}</text>
    <text x="50%" y="88%" font-family="Sora, Arial, sans-serif" font-size="${w*0.045}" font-weight="700"
      letter-spacing="2" fill="rgba(245,245,245,.55)" text-anchor="middle">FLIXORA</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
