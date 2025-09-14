<script lang="ts">
	import type { Role } from '$lib/server/db';
	import MemberCard from './MemberCard.svelte';
	import type { StudentWithProjectOptionalNullWithoutIdAndHasPhoto } from '$lib/server/db/queries/group/getStudentsWithProjects';
	import { languageTag } from '$lib/paraglide/runtime';

	type Student = StudentWithProjectOptionalNullWithoutIdAndHasPhoto & {
		password?: string;
	};

	const {
		student,
		role,
		children
	}: {
		student: Student;
		role: Role;
		children?: (student: Student) => any;
	} = $props();

	const projectName = student[
		('projectName' + languageTag().toUpperCase()) as keyof Student
	] as string | undefined;
</script>

<MemberCard
	member={student}
	text={projectName ||
		(student.password ? 'Password: ' + student.password : '')}
>
	{#snippet afterName()}
		{#if role === 'lecturer'}
			<span class="student-number">{student.login}</span>
		{/if}
	{/snippet}

	{#if role === 'lecturer' && children}
		{@render children(student)}
	{/if}
</MemberCard>

<style>
	.student-number {
		background-color: var(--bg-color);
		color: #888;
		border-radius: 1rem;
		padding: 0 0.25rem;
		font-size: 0.8rem;
		margin-left: 0.5rem;
	}
</style>
