<script lang="ts">
	import type { Role } from '$lib/server/db';
	import MemberCard from './MemberCard.svelte';

	const {
		student,
		role,
		children
	}: {
		student: any;
		role: Role;
		children?: (student: any) => any;
	} = $props();
</script>

<MemberCard
	member={student}
	text={student.projectName ||
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
