<script lang="ts">
	import HorizontalNavigation from '$lib/components/HorizontalNavigation.svelte';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';

	const { children } = $props();

	const id = $derived(page.params.id);
</script>

<HorizontalNavigation
	items={[
		{ name: m.chat(), href: `/groups/${id}` },
		{ name: m.files(), href: `/groups/${id}/files` },
		{ name: m.members(), href: `/groups/${id}/members` }
	]}
/>
{@render children()}
