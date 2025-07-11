import { db, project, type NoId, type ProjectRoom } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import { insertRoomQuery } from '../room/insert';
import { insertRoomMembers } from '../room/insertMembers';
import { getGroupOwner } from '../group/getOwner';

export const insertProjectQuery = () =>
	db()
		.insert(project)
		.values({
			id: sql.placeholder('id'),
			groupId: sql.placeholder('groupId'),
			namePl: sql.placeholder('namePl'),
			description: sql.placeholder('description'),
			thesis: sql.placeholder('thesis'),
			editable: sql.placeholder('editable')
		});

export const insertProject = async (
	groupId: number,
	roomData: Omit<NoId<ProjectRoom>, 'kind'> & { kind?: 'project' }
) => {
	roomData.kind = 'project';
	const [{ 0: result }, lecturer] = await Promise.all([
		insertRoomQuery().execute(roomData),
		getGroupOwner(groupId)
	]);

	await Promise.all([
		insertProjectQuery().execute({
			id: result.id,
			groupId,
			namePl: roomData.namePl,
			description: roomData.description,
			thesis: roomData.thesis,
			editable: roomData.editable ?? true
		}),
		insertRoomMembers(result.id, [roomData.ownerId, lecturer!.id])
	]);

	return result;
};
