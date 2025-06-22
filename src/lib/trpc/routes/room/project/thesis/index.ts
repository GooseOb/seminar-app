import { S3_BUCKET as Bucket } from '$env/static/private';
import { getS3Client } from '$lib/server/files';
import { t } from '$lib/trpc/t';
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';
import { insertFileMetadata } from '$lib/server/db/queries/file';
import { getKey } from './common';
import { commentsRouter } from './comments';
import { checkStudent } from '$lib/trpc/checks/role';
import { roomProcedure } from '$lib/trpc/middleware/room';
import { thesisProcedure } from '$lib/trpc/middleware/thesis';

export const thesisRouter = t.router({
	upload: roomProcedure
		.use(checkStudent)
		.query(async ({ input: { roomId } }) => {
			const s3 = getS3Client();

			const name = Date.now() + '.pdf';

			const Key = getKey(roomId, name);

			const { 0: url } = await Promise.all([
				getSignedUrl(
					s3,
					new PutObjectCommand({
						Bucket,
						Key
					}),
					{ expiresIn: 3600 }
				),
				insertFileMetadata(Key)
			]);

			return { url, name };
		}),
	delete: thesisProcedure
		.use(checkStudent)
		.mutation(async ({ ctx: { s3Key } }) => {
			const s3 = getS3Client();

			await s3.send(
				new DeleteObjectCommand({
					Bucket,
					Key: s3Key
				})
			);
		}),
	get: thesisProcedure
		.input(z.object({ isDownload: z.boolean() }))
		.query(async ({ input: { isDownload }, ctx: { s3Key } }) => {
			const s3 = getS3Client();

			const ResponseContentDisposition = isDownload ? 'attachment' : undefined;

			const url = await getSignedUrl(
				s3,
				new GetObjectCommand({
					Bucket,
					Key: s3Key,
					ResponseContentDisposition
				}),
				{ expiresIn: 3600 }
			);

			return { url };
		}),
	comments: commentsRouter
});
