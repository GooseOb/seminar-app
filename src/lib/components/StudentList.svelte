<script lang="ts">
	const { students, role, actionButtons } = $props();
	import StudentMemberCard from './StudentMemberCard.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<div class="member-list">
	{#if students.length === 0}
		<div class="message">{m.noStudents()}</div>
	{:else}
		{#each students as student, i}
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
