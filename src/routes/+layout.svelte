<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	const { children } = $props();
	let isSidebarOpen = $state(true);
</script>

<div class="app">
	<ParaglideJS {i18n}>
		<Header bind:isBtnActive={isSidebarOpen} />
		<div class="workspace">
			<Sidebar isOpen={isSidebarOpen} />
			<main class="content">
				{@render children()}
			</main>
		</div>
	</ParaglideJS>
</div>

<style>
	:root {
		--fg-color: #000;
		--bg-color: #f0f0f0;
		--bg2-color: #d8d9da;
		--bg3-color: #c1c3c5;
		--primary-color: #007bff;
	}
	@media (prefers-color-scheme: dark) {
		:root {
			--fg-color: #fff;
			--bg-color: #333;
			--bg2-color: #222;
			--bg3-color: #111;
			--primary-color: #0d6efd;
		}
	}
	:global(html, body) {
		height: 100%;
	}
	:global(*) {
		color: var(--fg-color);
		margin: 0;
		padding: 0;
		font-family: sans-serif;
	}
	:global(input, button) {
		background-color: var(--bg2-color);
		border: none;
	}
	:global(.nolist) {
		list-style-type: none;
	}
	.app {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.workspace {
		display: flex;
		flex-grow: 1;
		overflow: auto;
	}
	.content {
		background-color: var(--bg-color);
		padding: 20px;
		width: 100%;
	}
</style>
