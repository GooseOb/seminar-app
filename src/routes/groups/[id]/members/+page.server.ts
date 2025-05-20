import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { groupMembershipGuard } from '$lib/guards/groupMembership';
import { getStudentsWithProjectsInGroup } from '$lib/server/db/queries/group/getStudentsWithProjects';
import { getGroupOwner } from '$lib/server/db/queries/group/getOwner';

export const load: PageServerLoad = groupMembershipGuard(
	async ({
		params: { id },
		locals: {
			user: { role }
		}
	}) => {
		try {
			return {
				students: getStudentsWithProjectsInGroup(+id),
				lecturer: getGroupOwner(+id),
				role
			};
		} catch (err) {
			console.error('Error loading group members:', err);
			error(500, {
				message: 'Error loading group members'
			});
		}
	}
);
