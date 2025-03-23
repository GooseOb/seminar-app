<script lang="ts">
	import Accordion from '$lib/components/Accordion.svelte';
	import Search from '$lib/components/Search.svelte';
	import { isPathnameStart } from '$lib/pathname';
	let { isOpen, groups }: { isOpen: boolean; groups: Group[] } = $props();
	let searchQuery = $state('');
	const searchQueryLowerCase = $derived(searchQuery.toLowerCase());
</script>

<aside class="sidebar" class:open={isOpen}>
	<Search bind:value={searchQuery} />
	<nav class="groups">
		<ul class="nolist">
			{#each groups as group}
				<li>
					<Accordion {group} {searchQueryLowerCase} />
				</li>
			{/each}
		</ul>
	</nav>
	<div class="footer">
		<a class="footer-item" href="/settings" class:active={isPathnameStart('/settings')}>Settings</a>
		<button class="footer-item">Log out</button>
	</div>
</aside>

<style>
	.sidebar {
		display: flex;
		flex-direction: column;
		background-color: var(--bg3-color);
		transition: width 0.3s ease;
		overflow-x: hidden;
		white-space: nowrap;
		z-index: 1;
		max-height: 100%;
	}
	.groups {
		overflow-y: auto;
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
	.footer-item.active {
		background-color: var(--primary-color);
		color: white;
	}
	.footer-item {
		text-align: center;
		background-color: var(--bg3-color);
		transition: background-color 0.3s ease-out;
		padding: 0.5rem;
		cursor: pointer;
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
