import { z } from 'zod';

export const zRangeData = z.object({
	fromIndex: z.number(),
	toIndex: z.number(),
	data: z.string()
});

export type RangeData = z.infer<typeof zRangeData>;

export * from './apply';
export * from './interference';
