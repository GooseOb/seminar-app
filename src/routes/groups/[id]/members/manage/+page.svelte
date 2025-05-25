<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Input from '$lib/components/Input.svelte';
	import StudentInvitationInputForm from '$lib/components/StudentInvitationInputForm.svelte';
	import StudentSubmissionForm from '$lib/components/StudentSubmissionForm.svelte';
	import Success from '$lib/components/Success.svelte';
	import type { PageProps } from './$types';
	import * as m from '$lib/paraglide/messages.js';
	import { trpc } from '$lib/trpc/client.svelte';

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
			await trpc.room.group.removeStudent.mutate({
				groupId: +page.params.id,
				id: student.id
			});

			students = students.filter(({ id }) => id !== student.id);
		} catch (err) {
			error = m.failedToRemoveStudent() + ':' + err.message;
		}
	};

	let currentStudent = $state(emptyStudent());
</script>

<div class="container">
	<form
		method="POST"
		use:enhance={() =>
			({ update }) => {
				update({ reset: false });
			}}
		action="?/updateName"
	>
		<Input type="text" name="group_name" label="Name" bind:value={groupName} />
		<button type="submit" class="btn">{m.update()}</button>
	</form>

	{#if form?.error || error}
		<div class="error">{form?.error || error}</div>
	{/if}

	<Success value={form?.success}>
		{m.successfullyUpdated()}
	</Success>

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
						class="btn"
					>
						{m.edit()}
					</button>
				{/if}
				<button
					type="submit"
					onclick={() => {
						removeStudent(student);
					}}
					class="btn danger-btn"
				>
					{m.remove()}
				</button>
			{/snippet}
		</StudentSubmissionForm>
	</form>

	<form action="?/invite" method="POST" use:enhance>
		<StudentInvitationInputForm bind:value={currentInviteeNumber}>
			{m.invite()}
		</StudentInvitationInputForm>
	</form>

	<form action="?/deleteGroup" method="POST" use:enhance>
		<button type="submit" class="btn danger-btn delete-group">
			{m.deleteGroup()}
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
