import { json } from '@sveltejs/kit';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_PUB_BUCKET } from '$env/static/private';
import type { RequestHandler } from './$types';
import { getS3Client } from '$lib/server/files';
import { setUserHasPhoto } from '$lib/server/queries';

export const POST: RequestHandler = async ({
	locals: {
		user: { id }
	}
}) => {
	const url = await getSignedUrl(
		getS3Client(),
		new PutObjectCommand({
			Bucket: S3_PUB_BUCKET,
			Key: `users/${id}/image`
		}),
		{ expiresIn: 3600 }
	);

	setUserHasPhoto(id, true);

	return json({ url });
};
