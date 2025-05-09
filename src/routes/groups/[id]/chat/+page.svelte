<script lang="ts">
	import { page } from '$app/state';
	import Chat from '$lib/components/Chat.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<Chat roomId={+page.params.id} userId={data.userId} messages={data.messages} />
