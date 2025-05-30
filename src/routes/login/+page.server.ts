import { fail } from '@sveltejs/kit';
import { verifyPassword } from '$lib/server/auth';
import type { Actions } from './$types';
import { redirect } from '$lib/i18n';
import { getUserWithPasswordByLogin } from '$lib/server/db/queries/user/getWithPasswordByLogin';
import {
	createSession,
	generateSessionToken
} from '$lib/server/db/queries/sessions';
import * as m from '$lib/paraglide/messages';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const login = form.get('login')?.toString();
		const password = form.get('password')?.toString();

		if (!login || !password) {
			return fail(400, { error: m.loginAndPasswordRequired() });
		}

		try {
			const user = await getUserWithPasswordByLogin(login);
			if (!user || !verifyPassword(user.password, password)) {
				return fail(401, { error: m.invalidLoginOrPassword() });
			}

			const token = generateSessionToken();
			await createSession(token, user.id);

			cookies.set('session', token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 30
			});
		} catch (error) {
			console.error(error);
			return fail(500, { error: m.internalError() });
		}
		redirect(303, '/');
	}
};
