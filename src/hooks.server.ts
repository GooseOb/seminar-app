import { i18n, redirect } from '$lib/i18n';
import type { Handle } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/sessions';
import { setDatabaseUrl } from '$lib/server/db';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
	const { url, cookies, locals } = event;
	setDatabaseUrl(event.platform!.env.HYPERDRIVE.connectionString);

	const canonicalPath = i18n.route(url.pathname);

	const token = cookies.get('session');

	if (
		canonicalPath.startsWith('/login') ||
		canonicalPath.startsWith('/register')
	) {
		if (token) {
			throw redirect(303, '/');
		} else {
			return resolve(event);
		}
	}

	if (token) {
		const { session, user } = await validateSessionToken(token);
		if (session && user) {
			locals.session = session;
			locals.user = user;
			return resolve(event);
		} else {
			cookies.delete('session', { path: '/' });
		}
	}

	throw redirect(303, '/login');
};

const handleTheme: Handle = ({ event, resolve }) => {
	let theme = event.cookies.get('theme');
	if (!theme) {
		theme = 'auto';
		event.cookies.set('theme', theme, {
			path: '/',
			httpOnly: false
		});
	}

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%theme%', theme)
	});
};

export const handle: Handle = sequence(i18n.handle(), handleAuth, handleTheme);
