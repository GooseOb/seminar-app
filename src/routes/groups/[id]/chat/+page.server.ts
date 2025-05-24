import { checkGroupMembership } from '$lib/guards/groupMembership';
import { getMessages } from '$lib/server/db/queries/message/get';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { id }, locals }) => {
	await checkGroupMembership(+id);
	return {
		messages: getMessages(+id),
		userId: locals.user!.id
	};
};
