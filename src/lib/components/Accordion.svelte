<script lang="ts">
	import { languageTag } from '$lib/paraglide/runtime.js';
	import { isPathnameStart, isPathnameEnd } from '$lib/pathname';
	import type { Role } from '$lib/server/schema';
	import { slide } from 'svelte/transition';
	import type { GroupWithProjects } from '$lib/server/queries';
	import * as m from '$lib/paraglide/messages.js';

	const {
		group,
		searchQueryLowerCase,
		role
	}: { group: GroupWithProjects; searchQueryLowerCase: string; role: Role } =
		$props();

	let isOpen = $state(true);

	const isSearched = (value: string) =>
		searchQueryLowerCase === '' || value.includes(searchQueryLowerCase);

	const lang = languageTag();
	const projects = $derived(
		group.projects.map((project) => {
			const name = project.name[lang] || project.name.en;
			const searchable = (
				project.owner.studentNumber +
				' ' +
				project.owner.firstname +
				' ' +
				project.owner.lastname +
				' ' +
				name
			).toLowerCase();
			return {
				...project,
				name,
				searchable
			};
		})
	);
	const searchedProjects = $derived(
		projects.filter(({ searchable }) => isSearched(searchable))
	);
	const isGroupSearched = $derived(
		isSearched(group.name.toLowerCase()) || isSearched('general')
	);
</script>

{#if searchedProjects.length > 0 || isGroupSearched}
	<div class="accordion">
		<label class="title">
			<span>{group.name}</span>
			<input class="checkbox" type="checkbox" bind:checked={isOpen} />
		</label>
		{#if isOpen}
			<ul class="nolist list" transition:slide={{ duration: 300 }}>
				{#if isGroupSearched}
					{@const href = `/groups/${group.id}`}
					<a
						{href}
						class:active={isPathnameStart(href) &&
							!isPathnameEnd('new_project')}
					>
						<li class="item">General</li>
					</a>
				{/if}
				{#each searchedProjects as project}
					{@const href = `/projects/${project.id}`}
					<a {href} class:active={isPathnameStart(href)}>
						<li class="item">
							<div>
								{project.owner.firstname}
								{project.owner.lastname}
							</div>
							<div class="project-name">
								{project.name}
							</div>
						</li>
					</a>
				{/each}
				{#if role === 'student' && projects.length === 0}
					{@const href = `/groups/${group.id}/new_project`}
					<a {href} class:active={isPathnameStart(href)}>
						<li class="item">
							{m.addProject()}
						</li>
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
	.project-name {
		font-size: 0.8em;
	}
</style>
