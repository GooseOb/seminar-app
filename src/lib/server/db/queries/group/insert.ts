import { db, group } from '$lib/server/db';
import { insertRoomQuery } from '../room/insert';

export const insertGroup = async (name: string, lecturerId: number) => {
	const [result] = await insertRoomQuery().execute({
		name,
		ownerId: lecturerId,
		kind: 'group'
	});

	await db().insert(group).values({
		id: result.id
	});

	return result;
};
