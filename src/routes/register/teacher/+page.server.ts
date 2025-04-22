import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { userTable } from '$lib/server/db';
import { createSession, generateSessionToken } from '$lib/server/sessions';
import { db } from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const firstname = form.get('firstname')?.toString();
		const lastname = form.get('lastname')?.toString();
		const email = form.get('email')?.toString();
		const password = form.get('password')?.toString();

		if (!firstname || !lastname || !email || !password) {
			return fail(400, { error: 'All fields are required' });
		}

		try {
			const existingUser = await db
				.select()
				.from(userTable)
				.where(eq(userTable.email, email))
				.limit(1);

			if (existingUser.length > 0) {
				return fail(400, { error: 'Email already exists' });
			}

			const hashedPassword = hashPassword(password);
			const [user] = await db
				.insert(userTable)
				.values({
					firstname,
					lastname,
					email,
					password: hashedPassword,
					role: 'teacher'
				})
				.returning();

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
