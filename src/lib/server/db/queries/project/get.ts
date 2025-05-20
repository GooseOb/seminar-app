import { db, project, room } from '$lib/server/db';
import { sql, and, eq } from 'drizzle-orm';

const getProjectQuery = () =>
	db()
		.select({
			name: room.name,
			ownerId: room.ownerId,
			namePl: project.namePl,
			description: project.description,
			thesis: project.thesis
		})
		.from(room)
		.where(and(eq(room.id, sql.placeholder('id'))))
		.innerJoin(project, eq(project.id, room.id))
		.limit(1)
		.prepare('getProjectQuery');

export const getProject = async (id: number) => {
	return (await getProjectQuery().execute({ id }))[0];
};
