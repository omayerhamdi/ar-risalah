import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

/**
 * Rasterise the favicon for platforms that will not take SVG (apple-touch-icon,
 * and older Android). ImageMagick cannot shape the Bengali conjunct, so this
 * goes through resvg with the same Tiro Bangla face the site itself uses.
 */
const svg = fs.readFileSync('public/favicon.svg', 'utf8');
const font = 'src/assets/og-fonts/tiro-bangla-regular.ttf';

for (const [size, out] of [[180, 'public/apple-touch-icon.png'], [512, 'public/icon-512.png']]) {
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    font: { fontFiles: [font], defaultFontFamily: 'Tiro Bangla', loadSystemFonts: false },
  }).render().asPng();
  fs.writeFileSync(out, png);
  console.log(`${out}  ${size}x${size}  ${(png.length / 1024).toFixed(1)}kb`);
}
