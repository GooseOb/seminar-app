import { browser } from '$app/environment';

export const mainResizeListeners: (() => void)[] = [];

export const mainResizeObserver =
	browser &&
	new ResizeObserver(() => {
		mainResizeListeners.forEach((listener) => listener());
	});
