import { json } from '@sveltejs/kit';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_BUCKET } from '$env/static/private';
import type { RequestHandler } from './$types';
import { getS3Client } from '$lib/files';
import { updateUserPhoto } from '$lib/server/queries';

export const POST: RequestHandler = async ({
	locals: {
		user: { id }
	}
}) => {
	const s3 = getS3Client();

	const [url, accessUrl] = await Promise.all([
		getSignedUrl(
			s3,
			new PutObjectCommand({
				Bucket: S3_BUCKET,
				Key: `users/${id}/image`
			}),
			{ expiresIn: 3600 }
		),
		getSignedUrl(
			s3,
			new GetObjectCommand({
				Bucket: S3_BUCKET,
				Key: `users/${id}/image`
			})
		)
	]);

	updateUserPhoto(id, accessUrl);

	return json({ url, accessUrl });
};
