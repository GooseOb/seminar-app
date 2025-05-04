<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import HorizontalNavigation from '$lib/components/HorizontalNavigation.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { fly } from 'svelte/transition';

	const { children } = $props();
	let navigationDirection: 'forward' | 'backward' = $state('forward');

	const ANIMATION_DURATION = 300;
	beforeNavigate(({ from, to }) => {
		if (!from || !to) {
			navigationDirection = 'forward';
			return;
		}
		navigationDirection =
			from.url.pathname.length > to.url.pathname.length
				? 'backward'
				: 'forward';
	});

	const id = $derived(page.params.id);
</script>

<HorizontalNavigation
	items={[
		{ name: m.chat(), href: `/groups/${id}/chat` },
		{ name: m.files(), href: `/groups/${id}/files` },
		{ name: m.members(), href: `/groups/${id}/members` }
	]}
/>

<div class="page-container">
	{#key page.url.pathname}
		<div
			class="page"
			in:fly={{
				x: navigationDirection === 'forward' ? '100%' : '-100%',
				duration: ANIMATION_DURATION
			}}
			out:fly={{
				x: navigationDirection === 'forward' ? '-100%' : '100%',
				duration: ANIMATION_DURATION
			}}
		>
			{@render children()}
		</div>
	{/key}
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
</style>
