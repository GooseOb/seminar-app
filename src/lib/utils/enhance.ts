import { enhance } from '$app/forms';

export const enhanceNoReset = (element: HTMLFormElement) =>
	enhance(
		element,
		() =>
			({ update }) =>
				update({ reset: false })
	);
