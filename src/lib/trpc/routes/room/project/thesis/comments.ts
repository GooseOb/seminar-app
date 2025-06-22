import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { zRangeData } from '$lib/ranges';
import {
	getFileMetadata,
	updateFileMetadata
} from '$lib/server/db/queries/file';
import { insertMessage } from '$lib/server/db/queries/message/insert';
import { checkLecturer } from '$lib/trpc/checks/role';
import { thesisProcedure } from '$lib/trpc/middleware/thesis';

export const commentsRouter = t.router({
	update: thesisProcedure
		.use(checkLecturer)
		.input(
			z.object({
				comments: z.array(zRangeData)
			})
		)
		.mutation(async ({ input: { comments }, ctx: { s3Key } }) => {
			await updateFileMetadata(s3Key, { comments });
		}),
	submit: thesisProcedure.use(checkLecturer).mutation(
		async ({
			input: { roomId, fileName },
			ctx: {
				locals: { user },
				s3Key
			}
		}) => {
			await Promise.all([
				updateFileMetadata(s3Key, { isReviewed: true }),
				insertMessage({
					roomId,
					senderId: user.id,
					text: '/reviewed ' + fileName.replace('.pdf', '')
				})
			]);
		}
	),
	get: thesisProcedure.query(
		async ({
			ctx: {
				locals: { user },
				s3Key
			}
		}) => {
			const metadata = await getFileMetadata(s3Key);

			metadata.comments ||= [];
			return metadata.isReviewed || user.role === 'lecturer'
				? metadata
				: { comments: [], isReviewed: metadata.isReviewed };
		}
	)
});
