import { roomProcedure } from './room';
import { z } from 'zod';

export const filesProcedure = roomProcedure
	.input(z.object({ fileNames: z.array(z.string()) }))
	.use(({ input: { roomId, fileNames }, next }) => {
		return next({
			ctx: {
				s3Keys: fileNames.map((fileName) => `rooms/${roomId}/${fileName}`)
			}
		});
	});
