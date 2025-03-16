<script lang="ts">
	import Accordion from '$lib/components/Accordion.svelte';
	import Search from '$lib/components/Search.svelte';
	import { switchToLanguage } from '$lib/i18n';
	let { isOpen }: { isOpen: boolean } = $props();
	let searchQuery = $state('');
	const searchQueryLowerCase = $derived(searchQuery.toLowerCase());
	let projectId = 0;
	const groups = Array.from({ length: 7 }, (_, i) => ({
		id: i.toString(),
		name: 'Group ' + i,
		projects: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
			id: `${projectId}`,
			name: `Project ${projectId++}`
		}))
	}));
</script>

<aside class="sidebar" class:open={isOpen}>
	<Search bind:value={searchQuery} />
	<nav>
		<ul class="nolist">
			{#each groups as group}
				<li>
					<Accordion {group} {searchQueryLowerCase} />
				</li>
			{/each}
		</ul>
	</nav>
	<div>
		<button onclick={() => switchToLanguage('en')}>en</button>
		<button onclick={() => switchToLanguage('pl')}>pl</button>
	</div>
</aside>

<style>
	.sidebar {
		width: 0;
		background-color: var(--bg3-color);
		transition: width 0.3s ease;
		overflow: scroll;
		overflow-x: hidden;
		white-space: nowrap;
		z-index: 1;
	}
	.sidebar.open {
		width: 30%;
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
