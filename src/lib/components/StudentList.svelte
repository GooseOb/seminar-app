<script lang="ts">
	const { students, role, children } = $props();
	import StudentMemberCard from './StudentMemberCard.svelte';
</script>

<div class="member-list">
	{#if students.length === 0}
		<div class="message">No students</div>
	{:else}
		{#each students as student, i}
			<StudentMemberCard {student} {role}>
				{@render children(student, i)}
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
