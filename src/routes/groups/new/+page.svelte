<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/form/input.svelte';

	const emptyStudent = () => ({
		firstName: '',
		lastName: '',
		number: '',
		password: ''
	});

	let currentStudent = $state(emptyStudent());
	const students: (typeof currentStudent)[] = $state([
		{
			firstName: 'ghnm',
			lastName: 'ghj',
			number: '3456',
			password: 'hj'
		}
	]);
	let studentsString = $state('');

	let groupName = $state('');

	let studentI = 0;
	const onUserSubmit = () => {
		students[studentI] = currentStudent;
		currentStudent = emptyStudent();
		studentI = students.length;
	};
	const onSubmit = () => {
		studentsString = JSON.stringify(students);
	};
</script>

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
</form>
<hr />
<form onsubmit={onUserSubmit}>
	<h2>Students</h2>
	<Input type="text" label="First Name" bind:value={currentStudent.firstName} />
	<Input type="text" label="Last Name" bind:value={currentStudent.lastName} />
	<Input
		type="text"
		label="Student Number"
		bind:value={currentStudent.number}
	/>
	<Input
		type="password"
		label="Password"
		bind:value={currentStudent.password}
	/>

	<button type="submit" class="btn"> Submit student </button>
	{#each students as student, i}
		<div class="student">
			<div class="student-data">
				<p>First Name: {student.firstName}</p>
				<p>Last Name: {student.lastName}</p>
				<p>Student Number: {student.number}</p>
				<p>Password: {student.password}</p>
			</div>
			<div class="actions">
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
			</div>
		</div>
	{/each}
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
	.student {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 1rem;
		background: var(--bg2-color);
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
	.student-data {
		flex: 1 1 14em;
	}
	.actions {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
