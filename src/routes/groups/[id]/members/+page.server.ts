import type { PageServerLoad } from './$types';
import { getGroupMembersWithProjects } from '$lib/server/queries';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({
	params: { id },
	locals: {
		user: { role }
	}
}) => {
	try {
		const members = await getGroupMembersWithProjects(+id);
		return {
			members,
			role
		};
	} catch (err) {
		console.error('Error loading group members:', err);
		return error(500, {
			message: 'Error loading group members'
		});
	}
};
