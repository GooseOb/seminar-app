<script lang="ts">
	import Avatar from './Avatar.svelte';

	const {
		member,
		afterName,
		children,
		text = ''
	}: { member: any; afterName?: any; children?: any; text?: string } = $props();
</script>

<div class="member-card">
	<Avatar user={member} />
	<div class="member-info">
		<span class="member-name">
			{member.firstname}
			{member.lastname}
			{@render afterName?.(member)}
		</span>
		<span class="member-text">
			{text}
		</span>
	</div>
	{@render children?.()}
</div>

<style>
	.member-card {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		margin-bottom: 0.5rem;
		background: var(--bg2-color);
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s;
	}

	.member-info {
		display: flex;
		flex-direction: column;
	}

	.member-name {
		display: flex;
		align-items: center;
		font-weight: 600;
		font-size: 1.1rem;
		color: var(--text-color);
	}

	.member-text {
		font-size: 0.85rem;
		color: #888;
	}
</style>
