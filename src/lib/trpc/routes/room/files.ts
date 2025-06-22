import { S3_BUCKET as Bucket } from '$env/static/private';
import { getS3Client } from '$lib/server/files';
import { filesProcedure } from '$lib/trpc/middleware/files';
import { t } from '$lib/trpc/t';
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';

const map = <T, U>(arr: T[], fn: (item: T) => Promise<U>) =>
	Promise.all(arr.map(fn));

export const filesRouter = t.router({
	upload: filesProcedure.query(
		async ({
			ctx: {
				locals: { user },
				s3Keys
			}
		}) => {
			const s3 = getS3Client();

			const uploader = encodeURIComponent(user.firstname + ' ' + user.lastname);
			const urls = await map(s3Keys, (Key) =>
				getSignedUrl(
					s3,
					new PutObjectCommand({
						Bucket,
						Key,
						Metadata: { uploader }
					}),
					{
						expiresIn: 3600,
						unhoistableHeaders: new Set(['x-amz-meta-uploader'])
					}
				)
			);

			return { urls, uploader };
		}
	),
	get: filesProcedure
		.input(
			z.object({
				isDownload: z.boolean()
			})
		)
		.query(async ({ input: { isDownload }, ctx: { s3Keys } }) => {
			const s3 = getS3Client();

			const ResponseContentDisposition = isDownload ? 'attachment' : undefined;

			const urls = await map(s3Keys, (Key) =>
				getSignedUrl(
					s3,
					new GetObjectCommand({
						Bucket,
						Key,
						ResponseContentDisposition
					}),
					{
						expiresIn: 3600
					}
				)
			);

			return { urls };
		}),
	delete: filesProcedure.mutation(async ({ ctx: { s3Keys } }) => {
		const s3 = getS3Client();

		await map(s3Keys, (Key) =>
			s3.send(
				new DeleteObjectCommand({
					Bucket,
					Key
				})
			)
		);
	})
});
