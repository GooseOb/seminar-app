import { createUserIdGuard } from './common';
import * as m from '$lib/paraglide/messages';
import { isRoomMember } from '$lib/server/db/queries/room/isMember';

export const groupMembershipGuard = createUserIdGuard(
	isRoomMember,
	m.notGroupMember
);
