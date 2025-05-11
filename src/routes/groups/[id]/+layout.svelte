<script lang="ts">
	import { page } from '$app/state';
	import HorizontalNavigation from '$lib/components/HorizontalNavigation.svelte';
	import RoomTransition from '$lib/components/RoomTransition.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const { children } = $props();

	const id = $derived(page.params.id);
</script>

<HorizontalNavigation
	items={[
		{ name: m.chat(), href: `/groups/${id}/chat` },
		{ name: m.files(), href: `/groups/${id}/files` },
		{ name: m.members(), href: `/groups/${id}/members` }
	]}
/>

<RoomTransition>
	{@render children()}
</RoomTransition>
