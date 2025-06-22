import { roomProcedure } from './room';
import { z } from 'zod';

export const thesisProcedure = roomProcedure
	.input(z.object({ fileName: z.string() }))
	.use(async ({ input: { roomId, fileName }, next }) => {
		return next({
			ctx: {
				s3Key: `rooms/${roomId}/thesis/${fileName}`
			}
		});
	});
