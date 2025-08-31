<script
	lang="ts"
	generics="Member extends {
	firstname: string;
	lastname: string,
	hasPhoto?: boolean
}"
>
	import Avatar from './Avatar.svelte';

	const {
		member,
		afterName,
		children,
		text = ''
	}: {
		member: Member;
		afterName?: (member: Member) => any;
		children?: () => any;
		text?: string;
	} = $props();
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
	<div class="member-actions">
		{@render children?.()}
	</div>
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
		border-radius: 0.5rem;
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
		font-size: 1.1em;
		color: var(--text-color);
	}

	.member-text {
		font-size: 0.85em;
		color: #888;
	}
	.member-actions {
		display: flex;
		gap: 0.5rem;
		margin-left: auto;

		@media (max-width: 600px) {
			flex: 1 1 100%;
		}

		:global(> *) {
			width: 100%;
		}
	}
</style>
