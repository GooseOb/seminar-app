import { fail, redirect } from '@sveltejs/kit';
import { createSession, generateSessionToken } from '$lib/server/sessions';
import { verifyPassword } from '$lib/server/auth'; // Import verifyPassword
import type { Actions } from './$types';
import { getUserWithPasswordByLogin } from '$lib/server/queries';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const login = form.get('login')?.toString();
		const password = form.get('password')?.toString();

		if (!login || !password) {
			return fail(400, { error: 'Login and password are required' });
		}

		try {
			const user = await getUserWithPasswordByLogin(login);
			if (!user || !verifyPassword(user.password, password)) {
				return fail(401, { error: 'Invalid login or password' });
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
			return fail(500, { error: 'An error occurred during login' });
		}
		redirect(303, '/');
	}
};
