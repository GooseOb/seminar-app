<script lang="ts">
	import './global.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import BurgerButton from '$lib/components/BurgerButton.svelte';
	import { i18n } from '$lib/i18n';
	import { isLoginPage } from '$lib/pathname';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import type { LayoutProps } from './$types';
	import { browser } from '$app/environment';
	import { mainResizeObserver } from '$lib/resize';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';

	let mainElement: HTMLElement = $state(null)!;
	if (browser) {
		$effect(() => {
			if (mainElement) {
				mainResizeObserver.observe(mainElement);
			}
			return () => {
				if (mainElement) {
					mainResizeObserver.unobserve(mainElement);
				}
			};
		});
	}

	const { children, data }: LayoutProps = $props();

	if (data.theme === 'auto' && browser) {
		const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
		document.cookie = `last_theme=${theme}; path=/; max-age=31536000;`;
		document.documentElement.className = theme;
	}

	let isOpen = $state(true);
	const isLoginPageValue = $derived(isLoginPage());
	const pathname = $derived(
		/^\/[^/]*(?:\/[^/]*)?/.exec(i18n.route(page.url.pathname))?.[0]
	);
</script>

<div class="app">
	<ParaglideJS {i18n}>
		<Header>
			{#if !isLoginPageValue}
				<BurgerButton bind:isOpen />
			{/if}
		</Header>
		<div class="workspace">
			{#if !isLoginPageValue}
				<Sidebar {isOpen} groups={data.groups} role={data.role!} />
			{/if}
			<main class="content" bind:this={mainElement}>
				<div class="page-container">
					{#key pathname}
						<div
							class="page"
							in:fade={{ duration: 200 }}
							out:fade={{ duration: 200 }}
						>
							{@render children()}
						</div>
					{/key}
				</div>
			</main>
		</div>
	</ParaglideJS>
</div>

<style>
	.page-container {
		display: flex;
		width: 100%;
		height: 100%;
		position: relative;
	}
	.page {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
		position: absolute;
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
	@media (max-width: 768px) {
		.content {
			padding: 10px 5px;
		}
	}
</style>
