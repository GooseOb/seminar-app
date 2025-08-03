<script lang="ts">
	import StudentMemberCard from './StudentMemberCard.svelte';
	import * as m from '$lib/paraglide/messages';
	import type { Role } from '$lib/server/db';
	import type { StudentWithProject } from '$lib/server/db/queries/group/getStudentsWithProjects';

	const {
		students,
		role,
		actionButtons
	}: {
		students: StudentWithProject[];
		role: Role;
		actionButtons: (student: StudentWithProject, index: number) => any;
	} = $props();
</script>

<div class="member-list">
	{#if students.length === 0}
		<div class="message">{m.noStudents()}</div>
	{:else}
		{#each students as student, i (student.id)}
			<StudentMemberCard {student} {role}>
				{@render actionButtons(student, i)}
			</StudentMemberCard>
		{/each}
	{/if}
</div>

<style>
	.member-list {
		flex: 1;
	}

	.message {
		text-align: center;
		padding: 2rem;
		color: var(--text-color);
		font-size: 1.1rem;
	}
</style>
