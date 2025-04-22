import { i18n } from '$lib/i18n';
import type { Handle } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/sessions';
import { redirect } from '@sveltejs/kit';

const handleParaglide: Handle = i18n.handle();

export const handle: Handle = async (input) => {
	const { url, cookies, locals } = input.event;

	const canonicalPath = i18n.route(url.pathname);
	const lang = i18n.getLanguageFromUrl(url);

	const token = cookies.get('session');

	if (canonicalPath.startsWith('/login') || canonicalPath.startsWith('/register')) {
		if (token) {
			throw redirect(303, i18n.resolveRoute('/', lang));
		} else {
			return handleParaglide(input);
		}
	}

	if (token) {
		const { session, user } = await validateSessionToken(token);
		if (session && user) {
			locals.session = session;
			locals.user = user;
			return handleParaglide(input);
		}
	}

	throw redirect(303, i18n.resolveRoute('/login', lang));
};
