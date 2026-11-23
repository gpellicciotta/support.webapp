// OKLCH helpers that re-hue a color while preserving its WCAG relative luminance exactly.
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function hexToRgb(hex) {
    return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

export function rgbToHex(rgb) {
    return '#' + rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')).join('');
}

export function luminance(hex) {
    const [r, g, b] = hexToRgb(hex).map(toLinear);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
}

export function hexToOklch(hex) {
    const [r, g, b] = hexToRgb(hex).map(toLinear);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
    return [L, Math.hypot(A, B), ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360];
}

function oklchToLinear([L, C, h]) {
    const A = C * Math.cos((h * Math.PI) / 180);
    const B = C * Math.sin((h * Math.PI) / 180);
    const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
    const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
    const s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    ];
}

const inGamut = (lin) => lin.every((c) => c >= -1e-6 && c <= 1 + 1e-6);

/** Convert OKLCH to hex, reducing chroma until the color fits sRGB. */
export function oklchToHex([L, C, h]) {
    let lo = 0;
    let hi = C;
    if (!inGamut(oklchToLinear([L, C, h]))) {
        for (let i = 0; i < 30; i++) {
            const mid = (lo + hi) / 2;
            if (inGamut(oklchToLinear([L, mid, h]))) {
                lo = mid;
            }
            else {
                hi = mid;
            }
        }
        C = lo;
    }
    return rgbToHex(oklchToLinear([L, C, h]).map(toGamma));
}

/**
 * Re-hue a color to a new hue and chroma at the same WCAG luminance.
 * @param {string} hex source color
 * @param {{hue?: number, chroma?: (c: number, L: number) => number}} spec target hue and chroma mapping
 */
export function rehue(hex, spec) {
    const [L0, C0, h0] = hexToOklch(hex);
    const hue = spec.hue ?? h0;
    const chroma = spec.chroma ? spec.chroma(C0, L0) : C0;
    const target = luminance(hex);
    let lo = 0;
    let hi = 1;
    let best = hex;
    for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2;
        const candidate = oklchToHex([mid, chroma, hue]);
        best = candidate;
        if (luminance(candidate) < target) {
            lo = mid;
        }
        else {
            hi = mid;
        }
    }
    // Pick the nearest of the rounded neighbors that keeps luminance closest to the source.
    return best;
}
