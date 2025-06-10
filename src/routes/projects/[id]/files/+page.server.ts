import { getRoomFiles, type FileData } from '$lib/server/files';
import { checkProjectAccess } from '$lib/guards/projectAccess';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, params: { id } }) => {
	await checkProjectAccess(+id);
	const files = getRoomFiles(id, platform!.env.R2_BUCKET).then((data) => {
		const files: FileData[] = [];
		const versions: FileData[] = [];
		for (const file of data) {
			if (file.name.startsWith('thesis/')) {
				file.name = file.name.replace('thesis/', '');
				versions.push(file);
			} else {
				files.push(file);
			}
		}
		return { files, versions };
	});

	return { files };
};
