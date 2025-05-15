import { error, json } from '@sveltejs/kit';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_BUCKET } from '$env/static/private';
import { isMemberOfGroup } from '$lib/server/queries';
import type { RequestHandler } from './$types';
import { getS3Client } from '$lib/files';

export const POST: RequestHandler = async ({
	request,
	params: { id },
	locals: { user }
}) => {
	const { fileNames, isDownload } = await request.json<{
		fileNames: string[];
		isDownload: boolean;
	}>();

	if (!fileNames) {
		error(400, 'File names are required');
	}
	if (!(await isMemberOfGroup(user.id, +id))) {
		error(403, 'You are not a member of this group');
	}

	const s3 = getS3Client();

	const ResponseContentDisposition = isDownload ? 'attachment' : undefined;

	const urls = await Promise.all(
		fileNames.map((fileName: string) =>
			getSignedUrl(
				s3,
				new GetObjectCommand({
					Bucket: S3_BUCKET,
					Key: `rooms/${id}/${fileName}`,
					ResponseContentDisposition
				}),
				{
					expiresIn: 3600
				}
			)
		)
	);

	return json({ urls });
};
