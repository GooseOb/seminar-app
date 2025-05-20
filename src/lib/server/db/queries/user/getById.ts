import { db, user } from '$lib/server/db';
import { sql, eq } from 'drizzle-orm';
import { userData } from '$lib/server/db/queries/common';

const getUserByIdQuery = () =>
	db()
		.select(userData)
		.from(user)
		.where(eq(user.id, sql.placeholder('id')))
		.limit(1)
		.prepare('getUserByIdQuery');

export const getUserById = async (id: number) => {
	return (await getUserByIdQuery().execute({ id }))[0];
};
