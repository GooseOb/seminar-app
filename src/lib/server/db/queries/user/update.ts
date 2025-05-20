import { db, user } from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';
import { eq } from 'drizzle-orm';

export type UserUpdateData = {
	firstname: string;
	lastname: string;
	login: string;
	password?: string;
};

export const updateUser = async (id: number, data: UserUpdateData) => {
	if (data.password) data.password = hashPassword(data.password);
	await db().update(user).set(data).where(eq(user.id, id)).execute();
};
