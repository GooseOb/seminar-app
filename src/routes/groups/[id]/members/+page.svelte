<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let members = $state(data.members ?? []);
</script>

<div class="members-container">
	{#if data.error}
		<div class="message">{data.error}</div>
	{:else if members.length === 0}
		<div class="message">No members found in this group.</div>
	{:else}
		<div class="members-list">
			<button
				class="btn add"
				onclick={() => members.push({ id: `${members.length + 1}`, name: 'New Member' } as User)}
			>
				Add
			</button>
			{#each members as member (member.id)}
				<div class="member-card">
					{#if member.photo}
						<img src={member.photo} alt="" class="photo" />
					{:else}
						<div class="photo-placeholder">{member.name[0]}</div>
					{/if}
					<div class="member-info">
						<span class="member-name">{member.name}</span>
						<span class="member-status" class:online={member.isOnline}>
							{member.isOnline ? 'Online' : 'Offline'}
						</span>
					</div>
					<div class="member-actions">
						{#if member.projectId}
							<a href={`/projects/${member.projectId}`} class="btn"> Project </a>
						{/if}
						<button class="btn danger"> Remove </button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.members-container {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		overflow-y: auto;
		max-height: 100%;
		box-sizing: border-box;
	}

	.members-list {
		flex: 1;
		overflow-y: auto;
	}

	.member-card {
		display: flex;
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
		font-weight: 600;
		font-size: 1.1rem;
		color: var(--text-color);
	}

	.member-status {
		font-size: 0.85rem;
		color: #666;
	}

	.member-status.online {
		color: #28a745;
	}

	.member-actions {
		display: flex;
		gap: 0.5rem;
		margin-left: auto;
	}

	.btn {
		padding: 0.5rem 1rem;
		background: var(--primary-color);
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: box-shadow 0.2s;
		/* opacity: 0.8; */
	}

	.btn:hover {
		box-shadow:
			0 0 8px var(--fg-color),
			inset 0 0 2px var(--bg-color);
		/* opacity: 1; */
	}

	.danger {
		background: var(--danger-color);
	}

	.add {
		margin-bottom: 1rem;
		padding: 1rem;
		width: 100%;
		border-radius: 8px;
	}

	.message {
		text-align: center;
		padding: 2rem;
		color: var(--text-color);
		font-size: 1.1rem;
	}
</style>
