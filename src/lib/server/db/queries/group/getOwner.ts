import { db, room, user } from '$lib/server/db';
import { sql, eq, and } from 'drizzle-orm';

const getGroupOwnerQuery = () =>
	db()
		.select({
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			hasPhoto: user.hasPhoto
		})
		.from(user)
		.innerJoin(
			room,
			and(eq(user.id, room.ownerId), eq(sql.placeholder('groupId'), room.id))
		)
		.limit(1)
		.prepare('getGroupOwnerQuery');

export const getGroupOwner = async (groupId: number) => {
	return (await getGroupOwnerQuery().execute({ groupId }))[0];
};
