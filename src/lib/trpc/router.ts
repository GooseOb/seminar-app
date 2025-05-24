import { groupRouter } from './routes/group';
import { roomRouter } from './routes/room';
import { studentRouter } from './routes/student';
import { userRouter } from './routes/user';
import { t } from './t';

export const router = t.router({
	user: userRouter,
	student: studentRouter,
	room: roomRouter,
	group: groupRouter
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
