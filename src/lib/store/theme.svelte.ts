import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const themes = ['light', 'dark'] as const;

export type Theme = (typeof themes)[number];

export const theme = writable<Theme>(
	browser
		? (localStorage.getItem('theme') as Theme) ||
				(window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light')
		: 'dark'
);

if (browser) {
	let isInitial = true;
	theme.subscribe((value) => {
		document.documentElement.className = value;
		if (isInitial) {
			isInitial = false;
		} else {
			localStorage.setItem('theme', value);
		}
	});
}
