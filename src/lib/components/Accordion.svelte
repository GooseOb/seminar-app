<script lang="ts">
	// import { languageTag } from '$lib/paraglide/runtime.js';
	import { isPathnameStart } from '$lib/pathname';
	import type { Role } from '$lib/server/schema';
	import { slide } from 'svelte/transition';
	import type { GroupWithProjects } from '$lib/server/queries';

	const {
		group,
		searchQueryLowerCase,
		role
	}: { group: GroupWithProjects; searchQueryLowerCase: string; role: Role } =
		$props();

	let isOpen = $state(true);

	const isSearched = (value: string) =>
		searchQueryLowerCase === '' ||
		value.toLowerCase().includes(searchQueryLowerCase);

	// const lang = languageTag();
	const projects = $derived(
		group.projects
			// .map((project) => ({
			// 	...project,
			// 	name: project.name[lang] || project.name.en
			// }))
			.filter((project) => isSearched(project.name))
	);
	const isGroupSearched = $derived(
		isSearched(group.name) || isSearched('General')
	);
</script>

{#if projects.length > 0 || isGroupSearched}
	<div class="accordion">
		<label class="title">
			<span>{group.name}</span>
			<input class="checkbox" type="checkbox" bind:checked={isOpen} />
		</label>
		{#if isOpen}
			<ul class="nolist list" transition:slide={{ duration: 300 }}>
				{#if isGroupSearched}
					{@const href = `/groups/${group.id}`}
					<a {href} class:active={isPathnameStart(href)}>
						<li class="item">General</li>
					</a>
				{/if}
				{#each projects as project}
					{@const href = `/projects/${project.id}`}
					<a {href} class:active={isPathnameStart(href)}>
						<li class="item">
							{project.name}
						</li>
					</a>
				{/each}
				{#if role === 'student'}
					{@const href = `/projects/new?group=${group.id}`}
					<a {href} class:active={isPathnameStart(href)}>
						<li class="item">Add project</li>
					</a>
				{/if}
			</ul>
		{/if}
	</div>
{/if}

<style>
	a {
		background-color: var(--bg2-color);
		transition: background-color 0.3s ease-out;
	}
	a.active {
		background-color: var(--primary-color);
	}
	.accordion {
		display: flex;
		flex-direction: column;
	}
	.title {
		cursor: pointer;
		padding: 10px 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-weight: bold;
	}
	.checkbox {
		appearance: none;
		position: relative;
		width: 12px;
		margin: 0 8px;
	}

	.checkbox::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 8px solid var(--fg-color);
		transition: transform 0.2s ease;
	}

	.checkbox:checked::after {
		transform: translate(-50%, -50%) rotate(180deg); /* Flip to point up */
	}
	.list {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.item {
		padding: 5px 20px;
	}
</style>
