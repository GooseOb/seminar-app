import { t } from '$lib/trpc/t';
import { chatRouter } from './chat';
import { filesRouter } from './files';

export const roomRouter = t.router({
	chat: chatRouter,
	files: filesRouter
});
