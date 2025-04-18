import * as runtime from '$lib/paraglide/runtime';
import { createI18n } from '@inlang/paraglide-sveltekit';
import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
import { page } from '$app/state';
import { goto } from '$app/navigation';
import { redirect as _redirect } from '@sveltejs/kit';

export const i18n = createI18n(runtime);

export const switchToLanguage = (newLanguage: AvailableLanguageTag) => {
	const canonicalPath = i18n.route(page.url.pathname);
	const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
	goto(localisedPath);
};

export const redirect = (
	status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | ({} & number),
	location: string
) => {
	_redirect(status, i18n.resolveRoute(location));
};
