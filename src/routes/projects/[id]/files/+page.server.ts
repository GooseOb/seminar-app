import { getRoomFiles } from '$lib/server/files';
import { checkProjectAccess } from '$lib/guards/projectAccess';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, params: { id } }) => {
	await checkProjectAccess(+id);
	const files = getRoomFiles(platform!.env.R2_BUCKET, id);

	return { files };
};
