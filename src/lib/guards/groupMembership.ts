import { isMemberOfGroup } from '$lib/server/queries';
import { createUserIdGuard } from './common';
import * as m from '$lib/paraglide/messages';

export const groupMembershipGuard = createUserIdGuard(
	isMemberOfGroup,
	m.notGroupMember
);
