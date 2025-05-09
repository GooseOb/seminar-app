import type { LayoutServerLoad } from './$types';
import { getUserGroupsAndProjects } from '$lib/server/queries';
import type { Theme } from '$lib/theme';

export const load: LayoutServerLoad = async ({ locals: { user }, cookies }) => {
	const theme = cookies.get('theme') as Theme;
	if (user) {
		const { id, role } = user;
		return {
			groups: getUserGroupsAndProjects(id),
			role,
			theme
		};
	}
	return {
		groups: Promise.resolve([]),
		role: null,
		theme
	};
};
