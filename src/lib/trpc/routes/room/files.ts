import { S3_BUCKET } from '$env/static/private';
import { getS3Client } from '$lib/server/files';
import { t } from '$lib/trpc/t';
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';
import { roomProcedure } from '../procedure';

const map = <T, U>(arr: T[], fn: (item: T) => Promise<U>) =>
	Promise.all(arr.map(fn));

export const filesRouter = t.router({
	upload: roomProcedure
		.input(z.object({ fileNames: z.array(z.string()) }))
		.query(
			async ({
				ctx: {
					locals: { user }
				},
				input: { roomId, fileNames }
			}) => {
				const s3 = getS3Client();

				const uploader = user.firstname + ' ' + user.lastname;
				const urls = await map(fileNames, (fileName) =>
					getSignedUrl(
						s3,
						new PutObjectCommand({
							Bucket: S3_BUCKET,
							Key: `rooms/${roomId}/${fileName}`,
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
	get: roomProcedure
		.input(
			z.object({
				fileNames: z.array(z.string()),
				isDownload: z.boolean()
			})
		)
		.query(async ({ input: { roomId, fileNames, isDownload } }) => {
			const s3 = getS3Client();

			const ResponseContentDisposition = isDownload ? 'attachment' : undefined;

			const urls = await map(fileNames, (fileName) =>
				getSignedUrl(
					s3,
					new GetObjectCommand({
						Bucket: S3_BUCKET,
						Key: `rooms/${roomId}/${fileName}`,
						ResponseContentDisposition
					}),
					{
						expiresIn: 3600
					}
				)
			);

			return { urls };
		}),
	delete: roomProcedure
		.input(z.object({ fileNames: z.array(z.string()) }))
		.query(async ({ input: { roomId, fileNames } }) => {
			const s3 = getS3Client();

			const urls = await map(fileNames, (fileName) =>
				getSignedUrl(
					s3,
					new DeleteObjectCommand({
						Bucket: S3_BUCKET,
						Key: `rooms/${roomId}/${fileName}`
					}),
					{
						expiresIn: 3600
					}
				)
			);

			return { urls };
		})
});
