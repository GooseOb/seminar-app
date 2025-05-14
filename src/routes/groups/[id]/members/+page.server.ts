import type { PageServerLoad } from './$types';
import {
	getGroupOwner,
	getStudentsWithProjectsInGroup
} from '$lib/server/queries';
import { error } from '@sveltejs/kit';
import { groupMembershipGuard } from '$lib/guards/groupMembership';

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
