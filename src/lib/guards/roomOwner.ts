import { isOwnerOfRoom } from '$lib/server/queries';
import { createUserIdGuard } from './common';
import * as m from '$lib/paraglide/messages';

export const roomOwnerGuard = createUserIdGuard(isOwnerOfRoom, m.notRoomOwner);
