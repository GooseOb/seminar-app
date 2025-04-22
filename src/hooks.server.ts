import { i18n } from '$lib/i18n';
import type { Handle } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/sessions';
import { redirect } from '@sveltejs/kit';

const handleParaglide: Handle = i18n.handle();

export const handle: Handle = async (input) => {
	const {
		url: { pathname },
		cookies,
		locals
	} = input.event;

	if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
		return handleParaglide(input);
	}

	const token = cookies.get('session');
	if (token) {
		const { session, user } = await validateSessionToken(token);
		if (session && user) {
			locals.session = session;
			locals.user = user;
			return handleParaglide(input);
		}
	}

	throw redirect(303, '/login');
};
