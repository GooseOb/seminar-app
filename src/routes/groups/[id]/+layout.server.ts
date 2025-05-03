import { isMemberOfGroup } from '$lib/server/queries';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../../$types';

export const load: LayoutServerLoad = async ({ locals, params: { id } }) => {
	if (!id) {
		return error(400, {
			message: 'Group ID is required'
		});
	}
	if (!(await isMemberOfGroup(locals.user!.id, +id))) {
		return error(403, {
			message: 'You are not a member of this group'
		});
	}
};
