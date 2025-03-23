<script lang="ts">
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	import { languageTag } from '$lib/paraglide/runtime.js';

	const { group, searchQueryLowerCase }: { group: Group; searchQueryLowerCase: string } = $props();

	let isOpen = $state(true);

	const isSearched = (value: string) =>
		searchQueryLowerCase === '' || value.toLowerCase().includes(searchQueryLowerCase);

	const lang = languageTag();
	const projects = $derived(
		group.projects
			.map((project) => ({ ...project, name: project.name[lang] || project.name.en }))
			.filter((project) => isSearched(project.name))
	);
	const isGroupSearched = $derived(isSearched(group.name) || isSearched('General'));
	const isPathnameActive = (pathname: string) => page.url.pathname.includes(pathname);
	const href = `/groups/${group.id}`;
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
					<a {href} class:active={isPathnameActive(href)}>
						<li class="item">General</li>
					</a>
				{/if}
				{#each projects as project}
					<a
						href={`/projects/${project.id}`}
						class:active={isPathnameActive(`/projects/${project.id}`)}
					>
						<li class="item">
							{project.name}
						</li>
					</a>
				{/each}
			</ul>
		{/if}
	</div>
{/if}

<style>
	a {
		text-decoration: none;
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
