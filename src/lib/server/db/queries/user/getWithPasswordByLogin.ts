import { db, user } from '$lib/server/db';
import { sql, eq } from 'drizzle-orm';
import { first } from '$lib/server/db/queries/common';

const userWithPasswordByLoginQuery = () =>
	db()
		.select()
		.from(user)
		.where(eq(user.login, sql.placeholder('login')))
		.limit(1);

export const getUserWithPasswordByLogin = (login: string) =>
	first(userWithPasswordByLoginQuery().execute({ login }));
