<script lang="ts">
	// TODO: Complete the page
	import { page } from '$app/state';
	import StudentList from '$lib/components/StudentList.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	let students = $state(data.students);
	let error = $state('');

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

	const currentStudent = $state({
		firstname: '',
		lastname: '',
		login: '',
		password: ''
	});
</script>

<div class="members-container">
	{#if error}
		<div class="error">{error}</div>
	{/if}
	<StudentList {students} role="lecturer">
		{#snippet children(student: (typeof students)[number])}
			<button
				onclick={() => {
					removeStudent(student);
				}}
				class="btn danger-btn"
			>
				Remove
			</button>
			{#if student.canEdit}
				<button class="btn danger-btn"> Delete account </button>
			{/if}
		{/snippet}
	</StudentList>
</div>

<style>
	.members-container {
		display: flex;
		flex-direction: column;
		padding: 1rem 0;
		overflow-y: auto;
		max-height: 100%;
		box-sizing: border-box;
	}
	.error {
		color: var(--danger-color);
		font-size: 0.8rem;
		margin-bottom: 1rem;
	}
</style>
