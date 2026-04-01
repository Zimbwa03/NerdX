import type { CSSProperties } from 'react';

/** Page header icon — consistent with dashboard “lab / science” accent (cyan → teal). */
export const VIRTUAL_LAB_HUB_HEADER_ICON: CSSProperties = {
  background: 'linear-gradient(145deg, #22d3ee, #0891b2)',
  boxShadow: '0 10px 28px rgba(8, 145, 178, 0.28)',
};

/** Solid icon tiles on cards: accent + deepened stop (no unrelated second hue). */
export function labAccentIconStyle(accentHex: string): CSSProperties {
  return {
    background: `linear-gradient(145deg, ${accentHex}, color-mix(in srgb, ${accentHex} 68%, #0a0c0f))`,
    boxShadow: `0 8px 22px color-mix(in srgb, ${accentHex} 35%, transparent)`,
  };
}

export const CATEGORY_ICON_STYLES: Record<string, CSSProperties> = {
  science: labAccentIconStyle('#06b6d4'),
  mathematics: labAccentIconStyle('#10b981'),
  geography: labAccentIconStyle('#2e7d32'),
  computer_science: labAccentIconStyle('#334155'),
};

export const HOW_IT_WORKS_ICONS: { askAi: CSSProperties; unlock: CSSProperties; agents: CSSProperties } = {
  askAi: labAccentIconStyle('#10b981'),
  unlock: labAccentIconStyle('#f59e0b'),
  agents: labAccentIconStyle('#06b6d4'),
};
