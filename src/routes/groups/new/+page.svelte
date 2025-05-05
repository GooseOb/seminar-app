<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import type { StudentData } from './dto';
	import StudentList from '$lib/components/StudentList.svelte';
	import type { User } from '$lib/server/db';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	const emptyStudent = (): StudentData => ({
		firstname: '',
		lastname: '',
		login: '',
		password: ''
	});

	let currentStudent = $state(emptyStudent());
	let currentInviteeNumber = $state('');
	const students: StudentData[] = $state([
		{
			firstname: 'ghnm',
			lastname: 'ghj',
			login: '3456',
			password: 'hj'
		}
	]);
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

<form onsubmit={onSubmit} method="POST" use:enhance>
	<h1>{groupName || 'New Group'}</h1>
	<Input type="text" name="name" label="Name" bind:value={groupName} />
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
	<h2>Students</h2>
	<Input
		type="text"
		label="First Name"
		name="student_firstname"
		bind:value={currentStudent.firstname}
	/>
	<Input
		type="text"
		label="Last Name"
		name="student_lastname"
		bind:value={currentStudent.lastname}
	/>
	<Input
		type="text"
		label="Student Number"
		name="student_number"
		bind:value={currentStudent.login}
	/>
	<Input
		type="text"
		label="Password"
		name="student_password"
		bind:value={currentStudent.password}
	/>

	<button type="submit" class="btn"> Submit student </button>

	<StudentList {students} role="lecturer">
		{#snippet children(_: (typeof students)[number], i: number)}
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
	</StudentList>
</form>

<hr />

<form onsubmit={onInviteSubmit}>
	<h2>Invite existing students</h2>

	<div class="input-group">
		<Input
			type="text"
			bind:value={currentInviteeNumber}
			label="Student Number"
			name="invitee_number"
		/>

		<button type="submit" class="btn invite"> Add </button>
	</div>

	<StudentList students={existingStudents} role="lecturer">
		{#snippet children(_: (typeof existingStudents)[number], i: number)}
			<button
				type="button"
				class="btn danger-btn"
				onclick={() => {
					existingStudents.splice(i, 1);
				}}>Remove</button
			>
		{/snippet}
	</StudentList>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.main-btn {
		font-weight: bold;
	}
	hr {
		margin: 1rem 0;
	}
	.input-group {
		display: flex;
		gap: 1rem;
	}
	.invite {
		flex: 0.25;
	}
</style>
