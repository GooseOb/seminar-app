<script lang="ts">
	const {
		member,
		afterName,
		children,
		text = ''
	}: { member: any; afterName?: any; children?: any; text?: string } = $props();
</script>

<div class="member-card">
	{#if member.photo}
		<img src={member.photo} alt="" class="photo" />
	{:else}
		<div class="photo-placeholder">{member.firstname[0]}</div>
	{/if}
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
		padding: 1rem;
		margin-bottom: 0.5rem;
		background: var(--bg2-color);
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s;
	}

	.photo {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 1rem;
		object-fit: cover;
	}

	.photo-placeholder {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 1rem;
		background: var(--primary-color);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		text-transform: uppercase;
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
