<script lang="ts">
	import MemberCard from '$lib/components/MemberCard.svelte';
	import StudentList from '$lib/components/StudentList.svelte';
	import type { PageProps } from './$types';
	import * as m from '$lib/paraglide/messages.js';

	const { data }: PageProps = $props();
	const { students, lecturer, role } = data;
</script>

<div class="members-container">
	{#await lecturer then member}
		<MemberCard {member} text={m.lecturer()} />
	{/await}

	{#if role === 'lecturer'}
		<a href="members/manage" class="btn manage"> {m.manageGroup()} </a>
	{/if}

	{#await students then students}
		<StudentList {students} {role}>
			{#snippet actionButtons(student: (typeof students)[number])}
				{#if student.projectId}
					<a href={`/projects/${student.projectId}`} class="btn">
						{m.project()}
					</a>
				{/if}
			{/snippet}
		</StudentList>
	{/await}
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

	.manage {
		margin-bottom: 1rem;
		padding: 1rem 0;
		width: 100%;
		border-radius: 8px;
	}
</style>
