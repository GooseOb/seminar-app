import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_PUB_BUCKET } from '$env/static/private';
import { getS3Client } from '$lib/server/files';
import { setUserHasPhoto } from '$lib/server/db/queries/user/updateHasPhoto';
import { t } from '$lib/trpc/t';

export const userRouter = t.router({
	photoUpload: t.procedure.query(
		async ({
			ctx: {
				locals: { user }
			}
		}) => {
			const url = await getSignedUrl(
				getS3Client(),
				new PutObjectCommand({
					Bucket: S3_PUB_BUCKET,
					Key: `users/${user.id}/image`
				}),
				{ expiresIn: 3600 }
			);

			return { url };
		}
	),
	confirmPhotoUpload: t.procedure.mutation(
		async ({
			ctx: {
				locals: { user }
			}
		}) => {
			await setUserHasPhoto(user.id, true);
		}
	)
});
