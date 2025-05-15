import { getRoomFiles } from '$lib/files';
import { groupMembershipGuard } from '$lib/guards/groupMembership';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = groupMembershipGuard(
	async ({ platform, params: { id } }) => {
		const files = getRoomFiles(platform!.env.R2_BUCKET, id);

		return { files };
	}
);
