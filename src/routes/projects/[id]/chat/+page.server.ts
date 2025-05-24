import { checkProjectAccess } from '$lib/guards/projectAccess';
import { getMessages } from '$lib/server/db/queries/message/get';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { id }, locals }) => {
	await checkProjectAccess(+id);
	return {
		messages: getMessages(+id),
		userId: locals.user!.id
	};
};
