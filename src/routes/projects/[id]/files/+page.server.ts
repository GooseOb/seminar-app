import { getRoomFiles } from '$lib/files';
import { projectAccessGuard } from '$lib/guards/projectAccess';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = projectAccessGuard(
	async ({ platform, params: { id } }) => {
		const files = getRoomFiles(platform!.env.R2_BUCKET, id);

		return { files };
	}
);
