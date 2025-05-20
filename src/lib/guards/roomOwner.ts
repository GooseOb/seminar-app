import { createUserIdGuard } from './common';
import * as m from '$lib/paraglide/messages';
import { isOwnerOfRoom } from '$lib/server/db/queries/group/isOwner';

export const roomOwnerGuard = createUserIdGuard(isOwnerOfRoom, m.notRoomOwner);
