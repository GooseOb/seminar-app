import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { lecturerProcedure } from '../middleware';
import { zRangeData } from '$lib/ranges';
import {
	getFileMetadata,
	updateFileMetadata
} from '$lib/server/db/queries/file';
import { getKey } from './common';
import { roomProcedure } from '../../middleware';
import { insertMessage } from '$lib/server/db/queries/message/insert';

export const commentsRouter = t.router({
	update: lecturerProcedure
		.input(
			z.object({
				fileName: z.string(),
				comments: z.array(zRangeData)
			})
		)
		.mutation(async ({ input: { roomId, fileName, comments } }) => {
			await updateFileMetadata(getKey(roomId, fileName), { comments });
		}),
	submit: lecturerProcedure.input(z.object({ fileName: z.string() })).mutation(
		async ({
			input: { roomId, fileName },
			ctx: {
				locals: { user }
			}
		}) => {
			await Promise.all([
				updateFileMetadata(getKey(roomId, fileName), { isReviewed: true }),
				insertMessage({
					roomId,
					senderId: user.id,
					text: '/reviewed ' + fileName.replace('.pdf', '')
				})
			]);
		}
	),
	get: roomProcedure
		.input(
			z.object({
				fileName: z.string()
			})
		)
		.query(async ({ input: { roomId, fileName }, ctx }) => {
			const metadata = await getFileMetadata(getKey(roomId, fileName));
			return metadata.isReviewed || ctx.locals.user.role === 'lecturer'
				? metadata
				: { comments: [], isReviewed: metadata.isReviewed };
		})
});
