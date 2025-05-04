import { browser } from '$app/environment';

export const mainResizeListeners: (() => void)[] = [];

export const mainResizeObserver =
	(browser as true) &&
	new ResizeObserver(() => {
		mainResizeListeners.forEach((listener) => listener());
	});
