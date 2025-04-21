import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		// TODO: Validate
		if (!email || !password) {
			return fail(400, { message: 'No such user' });
		}

		// const user = await db.getUser(email);
		// if (!user) {
		// 	return fail(400, { email, missing: true });
		// }
		//
		// if (user.password !== db.hash(password)) {
		// 	return fail(400, { email, incorrect: true });
		// }
		//
		// cookies.set("sessionid", await db.createSession(user), { path: "/" });
		//
		// if (url.searchParams.has("redirectTo")) {
		// 	redirect(303, url.searchParams.get("redirectTo"));
		// }

		return redirect(303, '/');
	}
} satisfies Actions;
