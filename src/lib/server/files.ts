import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import {
	S3_ENDPOINT,
	S3_ACCESS_KEY_ID,
	S3_SECRET_ACCESS_KEY,
	S3_BUCKET
} from '$env/static/private';
import { dev } from '$app/environment';

export const getS3Client = () =>
	new S3Client({
		region: 'auto',
		endpoint: S3_ENDPOINT,
		credentials: {
			accessKeyId: S3_ACCESS_KEY_ID,
			secretAccessKey: S3_SECRET_ACCESS_KEY
		}
	});

export type FileData = {
	name: string;
	size: number;
	uploaded: Date;
	uploader?: string;
	isPending?: boolean;
};

export const getRoomFiles = dev
	? (id: string) =>
			getS3Client()
				.send(
					new ListObjectsV2Command({
						Bucket: S3_BUCKET,
						Prefix: `rooms/${id}/`
					})
				)
				.then(
					({ Contents }) =>
						Contents?.map((file) => ({
							name: file.Key!.replace(`rooms/${id}/`, ''),
							size: file.Size!,
							uploaded: new Date(file.LastModified!),
							uploader: undefined
						})) || []
				)
	: (id: string, r2: R2Bucket) =>
			r2
				.list({
					prefix: `rooms/${id}/`,
					include: ['customMetadata']
				})
				.then((res) =>
					res.objects.map(
						(file): FileData => ({
							name: file.key.replace(`rooms/${id}/`, ''),
							size: file.size,
							uploaded: file.uploaded,
							uploader:
								file.customMetadata &&
								decodeURIComponent(file.customMetadata.uploader)
						})
					)
				);
