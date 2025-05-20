import { db, user } from '$lib/server/db';
import { sql, eq } from 'drizzle-orm';
import { userData } from '$lib/server/db/queries/common';

const userByLoginQuery = () =>
	db()
		.select(userData)
		.from(user)
		.where(eq(user.login, sql.placeholder('login')))
		.limit(1)
		.prepare('userByLoginQuery');

export const getUserByLogin = async (login: string) => {
	return (await userByLoginQuery().execute({ login }))[0];
};
