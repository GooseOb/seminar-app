import { db, project } from '$lib/server/db';
import { eq, sql } from 'drizzle-orm';
import { updateRoomName } from '../room/updateName';

const updateProjectQuery = () =>
	db()
		.update(project)
		.set({
			namePl: sql.placeholder('namePl') as any,
			description: sql.placeholder('description') as any,
			thesis: sql.placeholder('thesis') as any
		})
		.where(eq(project.id, sql.placeholder('id')))
		.prepare('updateProjectQuery');

export const updateProject = async (
	id: number,
	data: {
		name: string;
		namePl: string;
		description: string;
		thesis: string;
	}
) => {
	await Promise.all([
		updateProjectQuery().execute({
			id,
			namePl: data.namePl,
			description: data.description,
			thesis: data.thesis
		}),
		updateRoomName(id, data.name)
	]);
};
