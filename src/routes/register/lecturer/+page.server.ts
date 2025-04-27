import { fail } from '@sveltejs/kit';
import { redirect } from '$lib/i18n';
import { createSession, generateSessionToken } from '$lib/server/sessions';
import { hashPassword } from '$lib/server/auth';
import type { Actions } from './$types';
import { getUserByLogin, insertUser } from '$lib/server/queries';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const firstname = form.get('firstname')?.toString();
		const lastname = form.get('lastname')?.toString();
		const login = form.get('login')?.toString();
		const password = form.get('password')?.toString();

		if (!firstname || !lastname || !login || !password) {
			return fail(400, { error: 'All fields are required' });
		}

		try {
			const existingUser = await getUserByLogin(login);

			if (existingUser.length > 0) {
				return fail(400, { error: 'Login already exists' });
			}

			const hashedPassword = hashPassword(password);
			const [user] = await insertUser({
				firstname,
				lastname,
				login,
				password: hashedPassword,
				role: 'lecturer'
			});

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
			return fail(500, { error: 'An error occurred during registration' });
		}
		redirect(303, '/');
	}
};
