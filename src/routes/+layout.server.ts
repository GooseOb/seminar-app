import type { LayoutServerLoad } from './$types';
import { getUserGroupsAndProjects } from '$lib/server/queries';

export const load: LayoutServerLoad = async ({ locals: { user } }) => {
	if (user) {
		const { id, role } = user;
		return {
			groups: getUserGroupsAndProjects(id),
			role
		};
	}
	return {
		groups: Promise.resolve([]),
		role: null
	};
};
