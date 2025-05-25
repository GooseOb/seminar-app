import { getRoomFiles } from '$lib/server/files';
import { checkGroupMembership } from '$lib/guards/groupMembership';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, params: { id } }) => {
	await checkGroupMembership(+id);
	const files = getRoomFiles(id, platform!.env.R2_BUCKET);

	return { files };
};
