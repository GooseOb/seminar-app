import { createUserIdGuard } from './common';
import * as m from '$lib/paraglide/messages';
import { isRoomOwner } from '$lib/server/db/queries/group/isOwner';

export const roomOwnerGuard = createUserIdGuard(isRoomOwner, m.notRoomOwner);
