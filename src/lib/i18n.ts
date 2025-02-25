import * as runtime from '$lib/paraglide/runtime';
import { createI18n } from '@inlang/paraglide-sveltekit';
export const i18n = createI18n(runtime);
import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
import { page } from '$app/state';
import { goto } from '$app/navigation';

export const switchToLanguage = (newLanguage: AvailableLanguageTag) => {
	const canonicalPath = i18n.route(page.url.pathname);
	const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
	goto(localisedPath);
};
