import { db, user } from '$lib/server/db';
import { eq, sql } from 'drizzle-orm';

const updateUserPhotoQuery = () =>
	db()
		.update(user)
		.set({
			hasPhoto: sql.placeholder('hasPhoto') as any
		})
		.where(eq(user.id, sql.placeholder('id')));

export const setUserHasPhoto = async (id: number, hasPhoto: boolean) => {
	await updateUserPhotoQuery().execute({
		id,
		hasPhoto
	});
};
