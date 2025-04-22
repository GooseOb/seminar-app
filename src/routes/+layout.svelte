<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import BurgerButton from '$lib/components/BurgerButton.svelte';
	import { i18n } from '$lib/i18n';
	import { isLoginPage } from '$lib/pathname';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import type { LayoutProps } from './$types';

	const { children, data }: LayoutProps = $props();

	let isOpen = $state(true);
</script>

<div class="app">
	<ParaglideJS {i18n}>
		{#if isLoginPage()}
			<Header />
			<div class="workspace">
				<main class="content">
					{@render children()}
				</main>
			</div>
		{:else}
			<Header>
				<BurgerButton bind:isOpen />
			</Header>
			<div class="workspace">
				<Sidebar {isOpen} groups={data.groups} role={data.role} />
				<main class="content">
					{@render children()}
				</main>
			</div>
		{/if}
	</ParaglideJS>
</div>

<style>
	:global {
		html {
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
		}
		* {
			margin: 0;
			padding: 0;
			font-family: sans-serif;
		}
		html,
		body {
			height: 100%;
		}
		body,
		input,
		button,
		textarea,
		select {
			background-color: var(--bg-color);
			color: var(--fg-color);
			font-size: 1rem;
		}
		button {
			border: none;
		}
		input,
		textarea {
			border: none;
			background-color: var(--bg2-color);
		}
		.nolist {
			list-style-type: none;
		}
		a {
			text-decoration: none;
			color: var(--fg-color);
		}
		.btn {
			padding: 0.5rem 1rem;
			background: var(--primary-color);
			color: white;
			border: none;
			border-radius: 0.2em;
			cursor: pointer;
			opacity: 0.8;
			transition: opacity 0.2s;
		}

		.btn:hover {
			opacity: 1;
		}

		.btn:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
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
