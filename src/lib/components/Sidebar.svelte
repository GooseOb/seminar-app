<script lang="ts">
	import { enhance } from '$app/forms';
	import Accordion from '$lib/components/Accordion.svelte';
	import Search from '$lib/components/Search.svelte';
	import { isPathnameStart } from '$lib/pathname';
	import type { Role } from '$lib/server/schema';
	import type { GroupWithProjects } from '$lib/server/queries';
	import * as m from '$lib/paraglide/messages.js';
	import { slide } from 'svelte/transition';

	let {
		isOpen,
		groups,
		role
	}: {
		isOpen: boolean;
		groups: Promise<GroupWithProjects[]>;
		role: Role;
	} = $props();

	let searchQuery = $state('');
	const searchQueryLowerCase = $derived(searchQuery.toLowerCase());
</script>

<aside
	class="sidebar"
	class:open={isOpen}
	in:slide={{
		axis: 'x',
		duration: 300
	}}
	out:slide={{
		axis: 'x',
		duration: 300
	}}
>
	<Search bind:value={searchQuery} />
	<nav class="groups">
		{#if role === 'lecturer'}
			{@const href = '/groups/new'}
			<a {href} class="add-group-btn" class:active={isPathnameStart(href)}>
				{m.addGroup()}
			</a>
		{/if}
		<ul class="nolist">
			{#await groups then groups}
				{#each groups as group}
					<li>
						<Accordion {group} {searchQueryLowerCase} {role} />
					</li>
				{/each}
			{/await}
		</ul>
	</nav>
	<div class="footer">
		<a
			href="/settings"
			class="footer-item"
			class:active={isPathnameStart('/settings')}>{m.settings()}</a
		>
		<form method="POST" action="/logout" use:enhance>
			<button type="submit" class="footer-item logout-btn">{m.logout()}</button>
		</form>
	</div>
</aside>

<style>
	.logout-btn {
		width: 100%;
	}
	.sidebar {
		width: 0;
		display: flex;
		flex-direction: column;
		background-color: var(--bg3-color);
		transition: width 0.3s ease;
		overflow-x: hidden;
		z-index: 2;
		max-height: 100%;
	}
	.groups {
		height: 100%;
		overflow-y: auto;
	}
	.add-group-btn {
		display: flex;
		justify-content: center;
		background-color: var(--bg2-color);
		padding: 0.25rem;
	}
	.sidebar.open {
		width: 30%;
	}
	.footer {
		background-color: var(--bg2-color);
		display: flex;
		gap: 0.5rem;
		flex-direction: column;
		padding: 0.5rem 0;
	}
	a.active {
		background-color: var(--primary-color);
		color: #fff;
	}
	.footer-item {
		text-align: center;
		background-color: var(--bg3-color);
		transition: background-color 0.3s ease-out;
		padding: 0.5rem;
		cursor: pointer;
		font-size: 1em;
	}
	@media (max-width: 768px) {
		.sidebar {
			position: absolute;
			height: 100%;
		}
		.sidebar.open {
			width: 100%;
		}
	}
</style>
