import { insertRoomQuery } from '../room/insert';

export const insertGroup = async (name: string, lecturerId: number) => {
	return (
		await insertRoomQuery().execute({
			name,
			ownerId: lecturerId,
			kind: 'group'
		})
	)[0];
};
