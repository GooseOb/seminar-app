import { db, user } from '$lib/server/db';
import { sql, eq } from 'drizzle-orm';
import { first, userData } from '$lib/server/db/queries/common';

const getUserByIdQuery = () =>
	db()
		.select(userData)
		.from(user)
		.where(eq(user.id, sql.placeholder('id')))
		.limit(1);

export const getUserById = (id: number) =>
	first(getUserByIdQuery().execute({ id }));
