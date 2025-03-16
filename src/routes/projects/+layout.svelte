<script lang="ts">
	import HorizontalNavigation from '$lib/components/HorizontalNavigation.svelte';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';

	const { children } = $props();

	const id = $derived(page.params.id);
</script>

<HorizontalNavigation
	items={[
		{ name: m.chat(), href: `/projects/${id}` },
		{ name: m.files(), href: `/projects/${id}/files` },
		{ name: m.description(), href: `/projects/${id}/description` }
	]}
/>
{@render children()}
