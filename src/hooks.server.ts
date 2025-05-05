import { i18n } from '$lib/i18n';
import type { Handle } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/sessions';
import { redirect } from '@sveltejs/kit';

const getHandleFinal =
	({
		theme,
		lang,
		textDirection
	}: Record<'lang' | 'textDirection' | 'theme', string>): Handle =>
	({ event, resolve }) =>
		resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%theme%', theme)
					.replace('%paraglide.lang%', lang)
					.replace('%paraglide.textDirection%', textDirection)
		});

export const handle: Handle = async (input) => {
	const { url, cookies, locals } = input.event;

	const canonicalPath = i18n.route(url.pathname);
	const lang = i18n.getLanguageFromUrl(url);
	i18n.config.runtime.setLanguageTag(lang);

	let theme = cookies.get('theme');
	if (!theme) {
		theme = 'auto';
		cookies.set('theme', theme, {
			path: '/',
			httpOnly: false
		});
	} else if (theme === 'auto') {
		theme = cookies.get('last_theme') || 'dark';
	}

	const handleFinal = getHandleFinal({
		theme,
		lang,
		textDirection: i18n.config.textDirection[lang]
	});

	const token = cookies.get('session');

	if (
		canonicalPath.startsWith('/login') ||
		canonicalPath.startsWith('/register')
	) {
		if (token) {
			throw redirect(303, i18n.resolveRoute('/', lang));
		} else {
			return handleFinal(input);
		}
	}

	if (token) {
		const { session, user } = await validateSessionToken(token);
		if (session && user) {
			locals.session = session;
			locals.user = user;
			return handleFinal(input);
		} else {
			cookies.delete('session', { path: '/' });
		}
	}

	throw redirect(303, i18n.resolveRoute('/login', lang));
};
