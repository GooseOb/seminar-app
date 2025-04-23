export const themes = ['light', 'dark', 'auto'] as const;

export type Theme = (typeof themes)[number];
