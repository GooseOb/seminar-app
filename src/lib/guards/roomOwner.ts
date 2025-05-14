import { isOwnerOfRoom } from '$lib/server/queries';
import { createUserIdGuard } from './common';

export const roomOwnerGuard = createUserIdGuard(
	isOwnerOfRoom,
	() => 'You are not the owner of this room'
);
