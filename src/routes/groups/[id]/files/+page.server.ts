import type { FileItem } from '$lib/files';
import { groupMembershipGuard } from '$lib/guards/groupMembership';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = groupMembershipGuard(
	async ({ platform, params: { id } }) => {
		const files = platform!.env.R2_BUCKET.list({
			prefix: id + '/',
			include: ['customMetadata']
		}).then((res) =>
			res.objects.map(
				(file): FileItem => ({
					name: file.key.split('/').at(-1)!,
					size: file.size,
					type: file.httpEtag,
					uploaded: file.uploaded,
					uploader: file.customMetadata?.uploader
				})
			)
		);

		return { files };
	}
);
