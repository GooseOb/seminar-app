import { db, user } from '$lib/server/db';
import { sql, eq } from 'drizzle-orm';

const userWithPasswordByLoginQuery = () =>
	db()
		.select()
		.from(user)
		.where(eq(user.login, sql.placeholder('login')))
		.limit(1)
		.prepare('userByLoginQuery');

export const getUserWithPasswordByLogin = async (login: string) => {
	return (await userWithPasswordByLoginQuery().execute({ login }))[0];
};
