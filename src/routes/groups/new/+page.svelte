<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import type { StudentData } from './dto';
	import type { User } from '$lib/server/db';
	import type { PageProps } from './$types';
	import StudentSubmissionForm from '$lib/components/StudentSubmissionForm.svelte';
	import StudentInvitationForm from '$lib/components/StudentInvitationForm.svelte';

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
			(res) => res.json()
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
	<button type="submit" class="btn main-btn">Create Group</button>

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
				}}>Edit</button
			>
			<button
				type="button"
				class="btn danger-btn"
				onclick={() => {
					students.splice(i, 1);
					if (studentI > i) studentI--;
				}}>Delete</button
			>
		{/snippet}
	</StudentSubmissionForm>
</form>

<hr />

<StudentInvitationForm
	bind:currentInviteeNumber
	onsubmit={onInviteSubmit}
	students={existingStudents}
>
	{#snippet actionButtons(_: (typeof existingStudents)[number], i: number)}
		<button
			type="button"
			class="btn danger-btn"
			onclick={() => {
				existingStudents.splice(i, 1);
			}}>Remove</button
		>
	{/snippet}
</StudentInvitationForm>

<style>
	.main-btn {
		font-weight: bold;
	}
	hr {
		margin: 1rem 0;
	}
</style>
