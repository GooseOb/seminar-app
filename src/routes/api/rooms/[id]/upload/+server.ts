import { error, json } from '@sveltejs/kit';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
	S3_ACCESS_KEY_ID,
	S3_BUCKET,
	S3_ENDPOINT,
	S3_SECRET_ACCESS_KEY
} from '$env/static/private';
import { isMemberOfGroup } from '$lib/server/queries';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({
	request,
	params: { id },
	locals: { user }
}) => {
	const { fileNames } = await request.json();

	if (!fileNames) {
		error(400, 'File names are required');
	}
	if (!isMemberOfGroup(user.id, +id)) {
		error(403, 'You are not a member of this group');
	}

	const s3 = new S3Client({
		region: 'auto',
		endpoint: S3_ENDPOINT,
		credentials: {
			accessKeyId: S3_ACCESS_KEY_ID,
			secretAccessKey: S3_SECRET_ACCESS_KEY
		}
	});

	const uploader = user.firstname + ' ' + user.lastname;
	const urls = await Promise.all(
		fileNames.map(async (fileName: string) => {
			const command = new PutObjectCommand({
				Bucket: S3_BUCKET,
				Key: id + '/' + fileName,
				Metadata: { uploader }
			});

			const url = await getSignedUrl(s3, command, {
				expiresIn: 3600,
				unhoistableHeaders: new Set(['x-amz-meta-uploader'])
			});

			return { fileName, url };
		})
	);

	return json({ urls, uploader });
};
