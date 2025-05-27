import { fail } from '@sveltejs/kit';
import { redirect } from '$lib/i18n';
import type { Actions } from './$types';
import { getUserByLogin } from '$lib/server/db/queries/user/getByLogin';
import { insertUsers } from '$lib/server/db/queries/user/insert';
import {
	createSession,
	generateSessionToken
} from '$lib/server/db/queries/sessions';
import * as m from '$lib/paraglide/messages';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const firstname = form.get('firstname')?.toString();
		const lastname = form.get('lastname')?.toString();
		const login = form.get('login')?.toString();
		const password = form.get('password')?.toString();

		if (!firstname || !lastname || !login || !password) {
			return fail(400, { error: m.allFieldsRequired() });
		}

		try {
			if (await getUserByLogin(login)) {
				return fail(400, { error: m.loginAlreadyExists() });
			}

			const [user] = await insertUsers([
				{
					firstname,
					lastname,
					login,
					password,
					role: 'lecturer',
					hasPhoto: false
				}
			]);

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
