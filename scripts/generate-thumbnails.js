#!/usr/bin/env node
// Run: node scripts/generate-thumbnails.js
// Output: scripts/thumbnails/*.svg  — open each in Chrome and screenshot at 1200×630

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'thumbnails');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

const EPISODES = [
  // Season 1
  { ep: 'EP01', season: 1, quote: '“You have optimism wearing components.”' },
  { ep: 'EP02', season: 1, quote: '“Without that contract — every component is a negotiation.”' },
  { ep: 'EP03', season: 1, quote: '“A charter written after the system is a confession.”' },
  { ep: 'EP04', season: 1, quote: '“Trust is built one squad at a time.”' },
  { ep: 'EP05', season: 1, quote: '“Token drift. Not a designer problem. A pipeline problem.”' },
  { ep: 'EP06', season: 1, quote: '“Three sources of truth. None of them synchronized.”' },
  // Season 2
  { ep: 'EP07', season: 2, quote: '“A roadmap nobody reads is a wish list with a timeline.”' },
  { ep: 'EP08', season: 2, quote: '“Data does not make the argument. It makes the argument undeniable.”' },
  { ep: 'EP09', season: 2, quote: '“Your internal customers have options. Workarounds count.”' },
  { ep: 'EP10', season: 2, quote: '“A specific ask can be accepted or declined. A vague ask gets deferred.”' },
  // Season 3
  { ep: 'EP11', season: 3, quote: '“The system is fine. The distribution model is broken.”' },
  { ep: 'EP12', season: 3, quote: '“Nobody came to read. They came to extract code.”' },
  { ep: 'EP13', season: 3, quote: '“Everyone is a doctor. Everyone is a design systems architect.”' },
  { ep: 'EP14', season: 3, quote: '“The trigger was not a better system. It was being asked instead of being told.”' },
  // Season 4
  { ep: 'EP15', season: 4, quote: '“A process that depends on one person is not a process. It is a personality.”' },
  { ep: 'EP16', season: 4, quote: '“A review that cannot change the outcome is not a review.”' },
  { ep: 'EP17', season: 4, quote: '“A deprecation that surprises people is not a deprecation. It is an ambush.”' },
  { ep: 'EP18', season: 4, quote: '“Everything else is a better PDF.”' },
];

// Approximate char width as fraction of font size (Georgia italic)
const CHAR_WIDTH_RATIO = 0.52;
const CONTENT_WIDTH = 1040; // 1200 - 80px left margin - 80px right margin
const LEFT_MARGIN = 80;

function getFontSize(wordCount) {
  if (wordCount <= 5)  return 88;
  if (wordCount <= 7)  return 76;
  if (wordCount <= 10) return 62;
  if (wordCount <= 13) return 52;
  if (wordCount <= 17) return 44;
  return 38;
}

function wrapText(text, fontSize) {
  const charsPerLine = Math.floor(CONTENT_WIDTH / (fontSize * CHAR_WIDTH_RATIO));
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? line + ' ' + word : word;
    if (candidate.length <= charsPerLine) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function generateSVG({ ep, season, quote }) {
  const wordCount = quote.split(' ').length;
  const fontSize = getFontSize(wordCount);
  const lineHeight = Math.round(fontSize * 1.35);
  const lines = wrapText(quote, fontSize);
  const totalTextHeight = lines.length * lineHeight;
  // Vertically center the quote block, bias slightly upward
  const blockStartY = Math.round((630 - totalTextHeight) / 2 - 20 + fontSize);

  const textLines = lines.map((line, i) =>
    `  <text x="${LEFT_MARGIN}" y="${blockStartY + i * lineHeight}" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-style="italic" font-weight="400" fill="#ffffff">${escapeXml(line)}</text>`
  ).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect x="${LEFT_MARGIN}" y="52" width="36" height="2" fill="#e5e795"/>
${textLines}
  <text x="${LEFT_MARGIN}" y="590" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" letter-spacing="3" fill="#555555">${ep} · SEASON ${season}</text>
  <text x="${1200 - LEFT_MARGIN}" y="590" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" letter-spacing="2.5" fill="#444444" text-anchor="end">UX ARENA</text>
</svg>`;
}

for (const ep of EPISODES) {
  const svg = generateSVG(ep);
  const filename = path.join(OUT_DIR, `${ep.ep.toLowerCase()}.svg`);
  fs.writeFileSync(filename, svg, 'utf8');
  console.log(`✓ ${ep.ep} → scripts/thumbnails/${ep.ep.toLowerCase()}.svg`);
}

console.log(`\nDone. ${EPISODES.length} thumbnails in scripts/thumbnails/`);
console.log('Open each SVG in Chrome → right-click → Save image as PNG');
console.log('Or: open scripts/thumbnails/preview.html to see all at once');

// Also generate a preview HTML so you can see all at once
const previewCards = EPISODES.map(({ ep }) =>
  `  <div style="display:inline-block;margin:8px;">
    <img src="${ep.toLowerCase()}.svg" width="300" height="157" style="display:block;border:1px solid #222;">
    <p style="color:#888;font-size:11px;margin:4px 0 0;font-family:monospace;">${ep}</p>
  </div>`
).join('\n');

const previewHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>UX Arena Thumbnails</title>
<style>body{background:#111;padding:24px;font-family:sans-serif;}h1{color:#fff;font-size:16px;letter-spacing:2px;text-transform:uppercase;margin-bottom:24px;}</style>
</head>
<body>
<h1>UX Arena — Typographic Thumbnails</h1>
${previewCards}
</body>
</html>`;

fs.writeFileSync(path.join(OUT_DIR, 'preview.html'), previewHTML, 'utf8');
console.log('Preview: open scripts/thumbnails/preview.html in a browser');
