<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Input from '$lib/components/Input.svelte';
	import StudentInvitationInputForm from '$lib/components/StudentInvitationInputForm.svelte';
	import StudentSubmissionForm from '$lib/components/StudentSubmissionForm.svelte';
	import Success from '$lib/components/Success.svelte';
	import type { PageProps } from './$types';

	const { data, form }: PageProps = $props();

	const emptyStudent = () => ({
		id: '',
		firstname: '',
		lastname: '',
		login: '',
		password: ''
	});

	$effect(() => {
		if (form?.success) {
			students = data.students;
		}
	});

	let students = $state(data.students);
	let error = $state('');
	let currentInviteeNumber = $state('');
	let groupName = $state(data.groupName);

	const removeStudent = async (student: (typeof students)[number]) => {
		try {
			const response = await fetch(`/api/students/${student.id}`, {
				method: 'DELETE',
				body: JSON.stringify({
					groupId: page.params.id
				})
			});

			if (!response.ok) {
				throw new Error('Failed to remove student: ' + (await response.text()));
			}

			students = students.filter(({ id }) => id !== student.id);
		} catch (err) {
			error = err.message;
		}
	};

	const onNameSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const name = formData.get('name') as string;

		try {
			const response = await fetch(`/api/groups/${page.params.id}`, {
				method: 'PATCH',
				body: JSON.stringify({ name })
			});

			if (!response.ok) {
				throw new Error(
					'Failed to update group name: ' + (await response.text())
				);
			}

			groupName = name;
		} catch (err) {
			error = err.message;
		}
	};

	let currentStudent = $state(emptyStudent());
</script>

<div class="container">
	<form
		onsubmit={onNameSubmit}
		method="POST"
		use:enhance={() =>
			({ update }) => {
				update({ reset: false });
			}}
		action="?/updateName"
	>
		<Input type="text" name="group_name" label="Name" bind:value={groupName} />
		<button type="submit" class="btn">Update</button>
	</form>

	{#if form?.error}
		<div class="error">{form?.error}</div>
	{/if}

	<Success value={form?.success}>Successfully updated</Success>

	<hr />

	<form method="POST" use:enhance action="?/submitStudent">
		<input hidden name="id" bind:value={currentStudent.id} />
		<StudentSubmissionForm bind:currentStudent {students}>
			{#snippet actionButtons(student: (typeof students)[number])}
				{#if student.canEdit}
					<button
						type="button"
						onclick={() => {
							currentStudent = {
								...student,
								id: student.id.toString(),
								password: ''
							};
						}}
						class="btn">Edit</button
					>
				{/if}
				<button
					type="submit"
					onclick={() => {
						removeStudent(student);
					}}
					class="btn danger-btn"
				>
					Remove
				</button>
			{/snippet}
		</StudentSubmissionForm>
	</form>

	<form action="?/invite" method="POST" use:enhance>
		<StudentInvitationInputForm bind:value={currentInviteeNumber}>
			Invite
		</StudentInvitationInputForm>
	</form>

	<form action="?/deleteGroup" method="POST" use:enhance>
		<button type="submit" class="btn danger-btn delete-group">
			Delete Group
		</button>
	</form>
</div>

<style>
	.container {
		display: flex;
		gap: 1rem;
		flex-direction: column;
		padding: 1rem 0.5rem 0rem 0.5rem;
		overflow-y: auto;
		max-height: 100%;
		box-sizing: border-box;
	}
	.delete-group {
		margin-top: 5rem;
		padding: 1rem;
	}
</style>
