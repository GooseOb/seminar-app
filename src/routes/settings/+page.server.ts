import type { Theme } from '$lib/theme';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	updateUser,
	type UserUpdateData
} from '$lib/server/db/queries/user/update';
import * as m from '$lib/paraglide/messages';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	const theme = cookies.get('theme') as Theme;
	const { password, ...user } = locals.user;
	return {
		theme,
		user: { ...user, password: '' }
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (locals.user.role !== 'lecturer') {
			return fail(403, {
				error: m.notAllowedToUpdateProfile()
			});
		}

		const formData = await request.formData();
		const firstname = formData.get('firstname') as string;
		const lastname = formData.get('lastname') as string;
		const login = formData.get('login') as string;
		const password = formData.get('password') as string;

		if (!firstname || !lastname || !login) {
			return fail(400, {
				error: m.loginDataRequired()
			});
		}

		const data: UserUpdateData = {
			firstname,
			lastname,
			login
		};

		if (password) {
			data.password = password;
		}

		try {
			await updateUser(+locals.user.id, data);
		} catch (error) {
			console.error('Error updating user:', error);
			return {
				error: m.internalError()
			};
		}

		return {
			success: true
		};
	}
};
