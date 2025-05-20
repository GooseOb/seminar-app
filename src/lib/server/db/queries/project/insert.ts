import { db, project, type NoId, type ProjectRoom } from '$lib/server/db';
import {} from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import { insertRoomQuery } from '../room/insert';

export const insertProjectQuery = () =>
	db()
		.insert(project)
		.values({
			id: sql.placeholder('id'),
			groupId: sql.placeholder('groupId'),
			namePl: sql.placeholder('namePl'),
			description: sql.placeholder('description'),
			thesis: sql.placeholder('thesis')
		})
		.prepare('insertProjectQuery');

export const insertProject = async (
	groupId: number,
	roomData: Optional<NoId<ProjectRoom>, 'kind'>
) => {
	roomData.kind = 'project';
	const [result] = await insertRoomQuery().execute(roomData);
	await insertProjectQuery().execute({
		id: result.id,
		groupId,
		namePl: roomData.namePl,
		description: roomData.description,
		thesis: roomData.thesis
	});
	return result;
};
