<script lang="ts">
	import MemberCard from '$lib/components/MemberCard.svelte';
	import StudentList from '$lib/components/StudentList.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const {
		members: { students, lecturer },
		role
	} = data;
</script>

<div class="members-container">
	<MemberCard member={lecturer} text="Lecturer" />
	{#if role === 'lecturer'}
		<a href="members/manage" class="btn manage"> Manage the group </a>
	{/if}
	<StudentList {students} {role}>
		{#snippet children(student: (typeof students)[number])}
			{#if student.projectId}
				<a href={`/projects/${student.projectId}`} class="btn"> Project </a>
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

	.manage {
		margin-bottom: 1rem;
		padding: 1rem 0;
		width: 100%;
		border-radius: 8px;
	}
</style>
