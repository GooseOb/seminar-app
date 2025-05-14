import { isMemberOfGroup } from '$lib/server/queries';
import { createUserIdGuard } from './common';

export const groupMembershipGuard = createUserIdGuard(
	isMemberOfGroup,
	() => 'You are not a member of this group'
);
