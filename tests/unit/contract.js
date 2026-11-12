import { readFileSync } from 'node:fs';

export const readContract = () => JSON.parse(readFileSync(new URL('../../src/contract.json', import.meta.url), 'utf8'));
export const categories = ['Grounds', 'Text', 'Lines and focus', 'Main action', 'Danger', 'Success and warning', 'Overlay', 'Optional per look', 'Fonts', 'Type', 'Space', 'Radius roles', 'Lines', 'Elevation', 'Layers', 'Motion', 'Sizes', 'Widths'];
const grounds = ['bg', 'surface', 'surface-sunken', 'surface-hover', 'surface-selected'];
export const contrastPairs = [
    ...['text', 'text-muted', 'link', 'link-hover', 'danger'].flatMap((text) => grounds.map((ground) => [text, ground, 4.5])),
    ...['border-strong', 'focus'].flatMap((mark) => grounds.map((ground) => [mark, ground, 3])),
    ...['primary', 'danger'].flatMap((role) => ['', '-hover', '-active'].map((state) => [`on-${role}`, `${role}${state}`, 4.5])),
    ['danger', 'danger-bg', 4.5],
    ...['success', 'warning'].map((role) => [`on-${role}`, role, 4.5]),
    ...['success', 'warning'].map((role) => ['text', `${role}-bg`, 4.5]),
    ...['success', 'warning'].map((role) => [role, 'surface', 3]),
    ...['primary', 'danger', 'text', 'text-muted'].flatMap((icon) => [...grounds, 'surface-active'].map((ground) => [icon, ground, 3])),
    ...['text', 'link'].map((role) => [role, 'surface-active', 4.5])
];
