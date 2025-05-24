import { createUserIdCheck } from './common';
import * as m from '$lib/paraglide/messages';
import { isRoomOwner } from '$lib/server/db/queries/group/isOwner';

export const checkRoomOwner = createUserIdCheck(isRoomOwner, m.notRoomOwner);
