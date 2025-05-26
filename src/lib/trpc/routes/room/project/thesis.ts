import { S3_BUCKET } from '$env/static/private';
import { getS3Client } from '$lib/server/files';
import { t } from '$lib/trpc/t';
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { studentProcedure } from './middleware';
import { z } from 'zod';
import { roomProcedure } from '../middleware';

export const thesisRouter = t.router({
	upload: studentProcedure.query(async ({ input: { roomId } }) => {
		const s3 = getS3Client();

		const url = await getSignedUrl(
			s3,
			new PutObjectCommand({
				Bucket: S3_BUCKET,
				Key: `rooms/${roomId}/thesis/${Date.now()}.pdf`
			}),
			{
				expiresIn: 3600
			}
		);

		return { url };
	}),
	delete: studentProcedure
		.input(z.object({ fileName: z.string() }))
		.mutation(async ({ input: { roomId, fileName } }) => {
			const s3 = getS3Client();

			await s3.send(
				new DeleteObjectCommand({
					Bucket: S3_BUCKET,
					Key: `rooms/${roomId}/thesis/${fileName}`
				})
			);
		}),
	get: roomProcedure
		.input(z.object({ fileName: z.string(), isDownload: z.boolean() }))
		.query(async ({ input: { roomId, fileName, isDownload } }) => {
			const s3 = getS3Client();

			const ResponseContentDisposition = isDownload ? 'attachment' : undefined;

			const url = await getSignedUrl(
				s3,
				new GetObjectCommand({
					Bucket: S3_BUCKET,
					Key: `rooms/${roomId}/thesis/${fileName}`,
					ResponseContentDisposition
				}),
				{ expiresIn: 3600 }
			);

			return { url };
		})
});
