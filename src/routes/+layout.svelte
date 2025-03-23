<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import type { LayoutProps } from './$types';

	const { children, data }: LayoutProps = $props();

	let isSidebarOpen = $state(true);
</script>

<div class="app">
	<ParaglideJS {i18n}>
		<Header bind:isBtnActive={isSidebarOpen} />
		<div class="workspace">
			<Sidebar isOpen={isSidebarOpen} groups={data.groups} />
			<main class="content">
				{@render children()}
			</main>
		</div>
	</ParaglideJS>
</div>

<style>
	:global(html) {
		--fg-color: #fff;
		--bg-color: #333;
		--bg2-color: #222;
		--bg3-color: #111;
		--primary-color: #0d6efd;
		--danger-color: #dc3545;

		&.light {
			--fg-color: #000;
			--bg-color: #f0f0f0;
			--bg2-color: #d8d9da;
			--bg3-color: #c1c3c5;
			--primary-color: #007bff;
		}

		background-color: var(--bg-color);
	}
	:global(html, body) {
		height: 100%;
	}
	:global(*) {
		color: var(--fg-color);
		margin: 0;
		padding: 0;
		font-family: sans-serif;
		font-size: 1rem;
	}
	:global(input, button) {
		background-color: var(--bg2-color);
		border: none;
	}
	:global(.nolist) {
		list-style-type: none;
	}
	:global(textarea) {
		background-color: var(--bg2-color);
		border: none;
	}
	:global(a) {
		text-decoration: none;
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
		padding: 20px;
		width: 100%;
		max-height: calc(100% - 20px);
		box-sizing: border-box;
	}
</style>
