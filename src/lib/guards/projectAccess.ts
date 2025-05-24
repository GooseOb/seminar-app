import { createUserIdCheck } from './common';
import * as m from '$lib/paraglide/messages';
import { isRoomMember } from '$lib/server/db/queries/room/isMember';

export const checkProjectAccess = createUserIdCheck(
	isRoomMember,
	m.noAccessToProject
);
