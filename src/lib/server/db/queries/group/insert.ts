import { first } from '$lib/server/db/queries/common';
import { insertRoomQuery } from '../room/insert';

export const insertGroup = (name: string, lecturerId: number) =>
	first(
		insertRoomQuery().execute({
			name,
			ownerId: lecturerId,
			kind: 'group'
		})
	);
