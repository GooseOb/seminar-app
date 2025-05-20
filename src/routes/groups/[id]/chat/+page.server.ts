import { groupMembershipGuard } from '$lib/guards/groupMembership';
import { getMessages } from '$lib/server/db/queries/message/get';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = groupMembershipGuard(
	async ({ params: { id }, locals }) => {
		return {
			messages: getMessages(+id),
			userId: locals.user!.id
		};
	}
);
