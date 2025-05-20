import { hashPassword } from '$lib/server/auth';
import { db, user, type NoId, type User } from '$lib/server/db';

export const insertUsers = async (userDatas: NoId<User>[]) => {
	if (userDatas.length === 0) {
		return [];
	}
	for (const userData of userDatas) {
		userData.password = hashPassword(userData.password);
	}
	return await db().insert(user).values(userDatas).returning();
};
