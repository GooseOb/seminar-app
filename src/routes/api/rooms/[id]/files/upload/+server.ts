import { error, json } from '@sveltejs/kit';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_BUCKET } from '$env/static/private';
import type { RequestHandler } from './$types';
import { getS3Client } from '$lib/server/files';
import { isRoomMember } from '$lib/server/db/queries/room/isMember';

export const POST: RequestHandler = async ({
	request,
	params: { id },
	locals: { user }
}) => {
	const { fileNames } = await request.json<{
		fileNames: string[];
	}>();

	if (!fileNames) {
		error(400, 'File names are required');
	}
	if (!(await isRoomMember(user.id, +id))) {
		error(403, 'You are not a member of this room');
	}

	const s3 = getS3Client();

	const uploader = user.firstname + ' ' + user.lastname;
	const urls = await Promise.all(
		fileNames.map((fileName: string) =>
			getSignedUrl(
				s3,
				new PutObjectCommand({
					Bucket: S3_BUCKET,
					Key: `rooms/${id}/${fileName}`,
					Metadata: { uploader }
				}),
				{
					expiresIn: 3600,
					unhoistableHeaders: new Set(['x-amz-meta-uploader'])
				}
			)
		)
	);

	return json({ urls, uploader });
};
