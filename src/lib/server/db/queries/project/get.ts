import { db, project, room } from '$lib/server/db';
import { sql, and, eq } from 'drizzle-orm';
import { first } from '$lib/server/db/queries/common';

const getProjectQuery = () =>
	db()
		.select({
			name: room.name,
			ownerId: room.ownerId,
			namePl: project.namePl,
			description: project.description,
			thesis: project.thesis,
			editable: project.editable
		})
		.from(room)
		.where(and(eq(room.id, sql.placeholder('id'))))
		.innerJoin(project, eq(project.id, room.id))
		.limit(1);

export const getProject = (id: number) =>
	first(getProjectQuery().execute({ id }));
