import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { checkGroupMembership } from '$lib/guards/groupMembership';
import { getStudentsWithProjectsInGroup } from '$lib/server/db/queries/group/getStudentsWithProjects';
import { getGroupOwner } from '$lib/server/db/queries/group/getOwner';
import * as m from '$lib/paraglide/messages';

export const load: PageServerLoad = async ({
	params: { id },
	locals: {
		user: { role }
	}
}) => {
	await checkGroupMembership(+id);
	try {
		return {
			students: getStudentsWithProjectsInGroup(+id),
			lecturer: getGroupOwner(+id),
			role
		};
	} catch (err) {
		console.error('Error loading group members:', err);
		error(500, {
			message: m.failedToLoadGroupMembers()
		});
	}
};
