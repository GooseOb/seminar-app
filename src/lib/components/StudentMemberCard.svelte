<script lang="ts">
	import MemberCard from './MemberCard.svelte';

	const { student, role, children } = $props();
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

	{#if role === 'lecturer'}
		<div class="member-actions">
			{@render children(student)}
		</div>
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

	.member-actions {
		display: flex;
		gap: 0.5rem;
		margin-left: auto;
	}
</style>
