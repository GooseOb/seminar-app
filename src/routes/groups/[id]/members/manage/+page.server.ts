import type { Actions, PageServerLoad } from './$types';
import { error, fail } from '@sveltejs/kit';
import * as m from '$lib/paraglide/messages';
import { redirect } from '$lib/i18n';
import { checkRoomOwner } from '$lib/guards/roomOwner';
import { getStudentsInGroup } from '$lib/server/db/queries/group/getStudents';
import { getGroupName } from '$lib/server/db/queries/group/getName';
import { updateRoomName } from '$lib/server/db/queries/room/updateName';
import { getUserByLogin } from '$lib/server/db/queries/user/getByLogin';
import { insertRoomMembers } from '$lib/server/db/queries/room/insertMembers';
import {
	updateUser,
	type UserUpdateData
} from '$lib/server/db/queries/user/update';
import { insertStudents } from '$lib/server/db/queries/student/insert';
import { deleteGroup } from '$lib/server/db/queries/group/delete';

export const load: PageServerLoad = async ({
	params: { id },
	locals: { user }
}) => {
	await checkRoomOwner(+id);
	try {
		const [students, groupName] = await Promise.all([
			getStudentsInGroup(+id, user!.id),
			getGroupName(+id)
		]);
		return {
			students,
			groupName
		};
	} catch (err) {
		console.error('Error loading group members:', err);
		error(500, {
			message: m.inernalError()
		});
	}
};

export const actions = {
	updateName: async ({ request, params: { id } }) => {
		await checkRoomOwner(+id);
		const formData = await request.formData();
		const groupName = formData.get('group_name') as string;

		if (!groupName) {
			return {
				success: false,
				error: m.groupNameRequired()
			};
		}

		try {
			await updateRoomName(+id, groupName);
			return {
				success: true
			};
		} catch (err) {
			console.error('Error updating group name:', err);
			return {
				success: false,
				error: m.inernalError()
			};
		}
	},
	invite: async ({ request, params: { id } }) => {
		await checkRoomOwner(+id);
		const formData = await request.formData();
		const number = formData.get('invitee_number') as string;

		const student = await getUserByLogin(number);

		if (!student) {
			return fail(400, {
				error: m.studentNotFound({ number })
			});
		}

		await insertRoomMembers(+id, [student.id]);

		return {
			student,
			success: true
		};
	},
	submitStudent: async ({ request, locals, params: { id: groupId } }) => {
		await checkRoomOwner(+id);
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const number = formData.get('student_number') as string;
		const firstname = formData.get('student_firstname') as string;
		const lastname = formData.get('student_lastname') as string;
		const password = formData.get('student_password') as string;
		if (id) {
			const data: UserUpdateData = {
				firstname,
				lastname,
				login: number
			};
			if (password) {
				data.password = password;
			}
			await updateUser(+id, data);
		} else {
			const student = await getUserByLogin(number);
			if (student) {
				return fail(400, {
					error: m.studentAlreadyExists({ number })
				});
			}

			const [{ id }] = await insertStudents(
				[
					{
						firstname,
						lastname,
						login: number,
						password,
						role: 'student',
						hasPhoto: false
					}
				],
				locals.user!.id
			);
			await insertRoomMembers(+groupId, [id]);
		}
		return {
			success: true
		};
	},
	deleteGroup: async ({ params: { id } }) => {
		await checkRoomOwner(+id);
		try {
			await deleteGroup(+id);
		} catch (err) {
			console.error('Error deleting group:', err);
			return fail(500, {
				error: m.inernalError()
			});
		}
		redirect(303, '/');
	}
} satisfies Actions;
