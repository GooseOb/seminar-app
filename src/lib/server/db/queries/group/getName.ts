import { db, room } from '$lib/server/db';
import { sql, eq, and } from 'drizzle-orm';

const getGroupNameQuery = () =>
	db()
		.select({
			name: room.name
		})
		.from(room)
		.where(and(eq(room.id, sql.placeholder('groupId'))))
		.limit(1);

export const getGroupName = async (groupId: number) => {
	const [result] = await getGroupNameQuery().execute({ groupId });
	return result?.name;
};
