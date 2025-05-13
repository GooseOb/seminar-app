import { S3Client } from '@aws-sdk/client-s3';
import {
	S3_ENDPOINT,
	S3_ACCESS_KEY_ID,
	S3_SECRET_ACCESS_KEY
} from '$env/static/private';

export const getS3Client = () =>
	new S3Client({
		region: 'auto',
		endpoint: S3_ENDPOINT,
		credentials: {
			accessKeyId: S3_ACCESS_KEY_ID,
			secretAccessKey: S3_SECRET_ACCESS_KEY
		}
	});

export type FileItem = {
	name: string;
	size: number;
	type: string;
	uploaded: Date;
	uploader?: string;
	isPending?: boolean;
};
