import { redirect } from '$lib/i18n';
import {
	invalidateSession,
	validateSessionToken
} from '$lib/server/db/queries/sessions';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const token = cookies.get('session');
		if (token) {
			const { session } = await validateSessionToken(token);
			if (session) {
				await invalidateSession(session.id);
			}
			cookies.delete('session', { path: '/' });
		}
		throw redirect(303, '/login');
	}
};
