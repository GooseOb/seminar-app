import { goto as _goto } from '$app/navigation';
import { page } from '$app/state';
import * as runtime from '$lib/paraglide/runtime';
import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
import { createI18n } from '@inlang/paraglide-sveltekit';
import { redirect as _redirect } from '@sveltejs/kit';

export const i18n = createI18n(runtime);

export const switchToLanguage = (newLanguage: AvailableLanguageTag) => {
	const canonicalPath = i18n.route(page.url.pathname);
	const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
	_goto(localisedPath);
};

export const redirect = (
	status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | ({} & number),
	location: string
) => {
	_redirect(status, i18n.resolveRoute(location));
};

export const goto: typeof _goto = (...args) => {
	let url = args[0];
	if (url instanceof URL) {
		url = url.href;
	}
	args[0] = i18n.resolveRoute(url);
	return _goto(...args);
};
