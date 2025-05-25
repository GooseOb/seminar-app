import { t } from '$lib/trpc/t';
import { chatRouter } from './chat';
import { filesRouter } from './files';
import { groupRouter } from './group';
import { projectRouter } from './project';

export const roomRouter = t.router({
	chat: chatRouter,
	files: filesRouter,
	project: projectRouter,
	group: groupRouter
});
