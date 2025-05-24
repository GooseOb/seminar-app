import { getRoomFiles } from '$lib/server/files';
import { checkGroupMembership } from '$lib/guards/groupMembership';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, params: { id } }) => {
	await checkGroupMembership(+id);
	const files = getRoomFiles(platform!.env.R2_BUCKET, id);

	return { files };
};
