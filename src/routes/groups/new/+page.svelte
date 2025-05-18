<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import type { StudentData } from './dto';
	import type { User } from '$lib/server/db';
	import type { PageProps } from './$types';
	import StudentSubmissionForm from '$lib/components/StudentSubmissionForm.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import StudentList from '$lib/components/StudentList.svelte';
	import StudentInvitationInputForm from '$lib/components/StudentInvitationInputForm.svelte';

	let { form }: PageProps = $props();

	const emptyStudent = (): StudentData => ({
		firstname: '',
		lastname: '',
		login: '',
		password: ''
	});

	let currentStudent = $state(emptyStudent());
	let currentInviteeNumber = $state('');
	const students: StudentData[] = $state([]);
	let studentsString = $state('');
	const existingStudents: User[] = $state([]);
	let existingStudentsString = $state('');

	let groupName = $state('');

	let studentI = 0;
	const onUserSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		students[studentI] = currentStudent;
		currentStudent = emptyStudent();
		studentI = students.length;
	};

	const onSubmit = () => {
		studentsString = JSON.stringify(students);
		existingStudentsString = JSON.stringify(
			existingStudents.map(({ id }) => id)
		);
	};

	const onInviteSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		const student = await fetch(`/api/students/${currentInviteeNumber}`).then(
			(res) => res.json<User>()
		);
		if (student) {
			currentInviteeNumber = '';
			existingStudents.push(student);
		}
	};
</script>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<form onsubmit={onSubmit} method="POST" use:enhance action="?/create">
	<h1>{groupName || 'New Group'}</h1>
	<Input type="text" name="group_name" label="Name" bind:value={groupName} />
	<button type="submit" class="btn main-btn">{m.createGroup()}</button>

	<input
		type="text"
		required={false}
		hidden
		name="students"
		bind:value={studentsString}
	/>
	<input
		type="text"
		required={false}
		hidden
		name="invitees"
		bind:value={existingStudentsString}
	/>
</form>

<hr />

<form onsubmit={onUserSubmit}>
	<StudentSubmissionForm {currentStudent} {students}>
		{#snippet actionButtons(_: (typeof students)[number], i: number)}
			<button
				type="button"
				class="btn"
				onclick={() => {
					studentI = i;
					currentStudent = students[i];
				}}
			>
				{m.edit()}
			</button>
			<button
				type="button"
				class="btn danger-btn"
				onclick={() => {
					students.splice(i, 1);
					if (studentI > i) studentI--;
				}}
			>
				{m.remove()}
			</button>
		{/snippet}
	</StudentSubmissionForm>
</form>

<hr />

<form onsubmit={onInviteSubmit}>
	<h2>{m.inviteExisting()}</h2>

	<StudentInvitationInputForm bind:value={currentInviteeNumber}>
		{m.add()}
	</StudentInvitationInputForm>

	<StudentList students={existingStudents} role="lecturer">
		{#snippet actionButtons(_: (typeof existingStudents)[number], i: number)}
			<button
				type="button"
				class="btn danger-btn"
				onclick={() => {
					existingStudents.splice(i, 1);
				}}
			>
				{m.remove()}
			</button>
		{/snippet}
	</StudentList>
</form>

<style>
	.main-btn {
		font-weight: bold;
	}
	hr {
		margin: 1rem 0;
	}
</style>
