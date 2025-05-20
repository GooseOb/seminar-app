import { createUserIdGuard } from './common';
import * as m from '$lib/paraglide/messages';
import { isMemberOfGroup } from '$lib/server/db/queries/group/isMember';

export const groupMembershipGuard = createUserIdGuard(
	isMemberOfGroup,
	m.notGroupMember
);
