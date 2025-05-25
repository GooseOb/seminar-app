import { roomRouter } from './room';
import { studentRouter } from './student';
import { userRouter } from './user';
import { t } from '../t';

export const router = t.router({
	user: userRouter,
	student: studentRouter,
	room: roomRouter
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
