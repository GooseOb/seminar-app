<script lang="ts">
	import { page } from '$app/state';
	import HorizontalNavigation from '$lib/components/HorizontalNavigation.svelte';
	import RoomTransition from '$lib/components/RoomTransition.svelte';
	import * as m from '$lib/paraglide/messages';

	const { children } = $props();

	const id = $derived(page.params.id);
</script>

<HorizontalNavigation
	items={[
		{ name: m.chat(), href: `/projects/${id}/chat` },
		{ name: m.files(), href: `/projects/${id}/files` },
		{ name: m.aboutProject(), href: `/projects/${id}/about` }
	]}
/>

<RoomTransition>
	{@render children()}
</RoomTransition>
