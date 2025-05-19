import type { Actions, PageServerLoad } from './$types';
import {
	deleteGroup,
	getGroupName,
	getStudentsInGroup,
	getUserByLogin,
	insertGroupMembers,
	insertStudents,
	updateRoomName,
	updateUser,
	type UserUpdateData
} from '$lib/server/queries';
import { error, fail } from '@sveltejs/kit';
import * as m from '$lib/paraglide/messages';
import { redirect } from '$lib/i18n';
import { roomOwnerGuard } from '$lib/guards/roomOwner';

export const load: PageServerLoad = roomOwnerGuard(
	async ({ params: { id }, locals: { user } }) => {
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
				message: 'Error loading group members'
			});
		}
	}
);

export const actions = {
	updateName: roomOwnerGuard(async ({ request, params: { id } }) => {
		const formData = await request.formData();
		const groupName = formData.get('group_name') as string;

		if (!groupName) {
			return {
				success: false,
				error: 'Group name cannot be empty'
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
				error: 'Error updating group name'
			};
		}
	}),
	invite: roomOwnerGuard(async ({ request, params: { id } }) => {
		const formData = await request.formData();
		const number = formData.get('invitee_number') as string;

		const student = await getUserByLogin(number);

		if (!student) {
			return fail(400, {
				error: m.studentNotFound({ number })
			});
		}

		await insertGroupMembers(+id, [student.id]);

		return {
			student,
			success: true
		};
	}),
	submitStudent: roomOwnerGuard(
		async ({ request, locals, params: { id: groupId } }) => {
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
				await insertGroupMembers(+groupId, [id]);
			}
			return {
				success: true
			};
		}
	),
	deleteGroup: roomOwnerGuard(async ({ params: { id } }) => {
		try {
			await deleteGroup(+id);
		} catch (err) {
			console.error('Error deleting group:', err);
			return fail(500, {
				error: 'Error deleting group'
			});
		}
		redirect(303, '/');
	})
} satisfies Actions;
