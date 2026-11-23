// Candidate definitions: per-ramp hue and chroma changes plus font pairs, luminance preserved per step.
const scale = (k) => (c) => c * k;
const fixed = (v) => () => v;

const warmFonts = {
    original: null,
    frauncesNunitoSans: {
        google: 'family=Fraunces:opsz,wght@9..144,400..700&family=Nunito+Sans:ital,opsz,wght@0,6..12,400..700;1,6..12,400..700',
        heading: '"Fraunces Variable", "Fraunces", Georgia, serif',
        body: '"Nunito Sans Variable", "Nunito Sans", system-ui, sans-serif',
        label: 'Fraunces headings, Nunito Sans body'
    },
    bricolageFigtree: {
        google: 'family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=Figtree:ital,wght@0,400..700;1,400..700',
        heading: '"Bricolage Grotesque Variable", "Bricolage Grotesque", system-ui, sans-serif',
        body: '"Figtree Variable", "Figtree", system-ui, sans-serif',
        label: 'Bricolage Grotesque headings, Figtree body'
    },
    nunito: {
        google: 'family=Nunito:ital,wght@0,400..800;1,400..800',
        heading: '"Nunito Variable", "Nunito", system-ui, sans-serif',
        body: '"Nunito Variable", "Nunito", system-ui, sans-serif',
        label: 'Nunito headings and body'
    },
    jakarta: {
        google: 'family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..800',
        heading: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif',
        body: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif',
        label: 'Plus Jakarta Sans headings and body'
    }
};

export const warm = [
    {
        id: 'w1-indigo-amber',
        name: 'Indigo ink and amber',
        summary: 'The closest to today: navy deepens toward indigo, saffron warms toward amber, fonts stay.',
        ramps: { navy: { hue: 278, chroma: scale(1.25) }, slate: { hue: 275 }, saffron: { hue: 72, chroma: scale(1.1) } },
        fonts: warmFonts.original,
        fontLabel: 'Outfit headings, DM Sans body (unchanged)'
    },
    {
        id: 'w2-espresso-clay',
        name: 'Espresso and clay',
        summary: 'Espresso brown ink on cream, clay-tinted chrome, honey warnings, and a soft serif for headings.',
        ramps: {
            navy: { hue: 50, chroma: scale(1.0) },
            slate: { hue: 55, chroma: fixed(0.02) },
            ivory: { hue: 75, chroma: scale(1.2) },
            saffron: { hue: 80 },
            brick: { hue: 30 }
        },
        fonts: warmFonts.frauncesNunitoSans
    },
    {
        id: 'w3-forest-honey',
        name: 'Forest and honey',
        summary: 'Deep forest green ink, sand grounds, honey accents, and a characterful grotesque for headings.',
        ramps: {
            navy: { hue: 165, chroma: scale(0.9) },
            slate: { hue: 160, chroma: fixed(0.018) },
            ivory: { hue: 95, chroma: scale(1.1) },
            saffron: { hue: 82 }
        },
        fonts: warmFonts.bricolageFigtree
    },
    {
        id: 'w4-plum-marigold',
        name: 'Plum and marigold',
        summary: 'Plum ink on blush ivory, marigold accents, raspberry danger, and rounded Nunito throughout.',
        ramps: {
            navy: { hue: 335, chroma: scale(1.0) },
            slate: { hue: 330, chroma: fixed(0.02) },
            ivory: { hue: 40, chroma: scale(0.9) },
            saffron: { hue: 68, chroma: scale(1.1) },
            brick: { hue: 15 }
        },
        fonts: warmFonts.nunito
    },
    {
        id: 'w5-teal-coral',
        name: 'Deep teal and coral',
        summary: 'Deep teal ink, warm ivory, saffron accents, coral danger, and Plus Jakarta Sans throughout.',
        ramps: {
            navy: { hue: 215, chroma: scale(1.15) },
            slate: { hue: 215 },
            saffron: { hue: 85 },
            brick: { hue: 38, chroma: scale(1.1) }
        },
        fonts: warmFonts.jakarta
    }
];

const brightFonts = {
    inter: {
        google: 'family=Inter:ital,opsz,wght@0,14..32,400..700;1,14..32,400..700',
        body: '"Inter Variable", "Inter", system-ui, sans-serif',
        label: 'Inter'
    },
    manrope: {
        google: 'family=Manrope:wght@400..800',
        body: '"Manrope Variable", "Manrope", system-ui, sans-serif',
        label: 'Manrope'
    },
    figtree: {
        google: 'family=Figtree:ital,wght@0,400..700;1,400..700',
        body: '"Figtree Variable", "Figtree", system-ui, sans-serif',
        label: 'Figtree'
    },
    lexend: {
        google: 'family=Lexend:wght@400..700',
        body: '"Lexend Variable", "Lexend", system-ui, sans-serif',
        label: 'Lexend'
    }
};

export const bright = [
    {
        id: 'b1-vivid-azure',
        name: 'Vivid azure',
        summary: 'The closest to today: a more saturated azure blue and crisper slate, system fonts stay.',
        ramps: { blue: { hue: 255, chroma: scale(1.15) }, slate: { chroma: scale(1.15) } },
        fonts: null,
        fontLabel: 'System stack (unchanged)'
    },
    {
        id: 'b2-indigo-inter',
        name: 'Indigo and Inter',
        summary: 'Indigo-leaning blue on violet-tinted slate, set in Inter like the neutral look.',
        ramps: { blue: { hue: 275, chroma: scale(1.05) }, slate: { hue: 275 } },
        fonts: brightFonts.inter
    },
    {
        id: 'b3-zinc-electric',
        name: 'Zinc and electric blue',
        summary: 'Near-neutral zinc grays with a punchy electric blue and the geometric Manrope.',
        ramps: { slate: { chroma: fixed(0.005) }, blue: { hue: 262, chroma: scale(1.3) } },
        fonts: brightFonts.manrope
    },
    {
        id: 'b4-stone-royal',
        name: 'Stone and royal blue',
        summary: 'Warm stone grays, royal blue, and the friendly Figtree.',
        ramps: { slate: { hue: 70, chroma: fixed(0.012) }, blue: { hue: 268 }, ink: { hue: 60, chroma: fixed(0.01) } },
        fonts: brightFonts.figtree
    },
    {
        id: 'b5-ocean-raspberry',
        name: 'Ocean and raspberry',
        summary: 'Cerulean blue on sea-tinted slate, raspberry reds, and the open Lexend.',
        ramps: { blue: { hue: 238, chroma: scale(1.1) }, slate: { hue: 230 }, red: { hue: 12 } },
        fonts: brightFonts.lexend
    }
];
