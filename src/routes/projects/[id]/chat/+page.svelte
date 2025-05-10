<script lang="ts">
	import { page } from '$app/state';
	import Chat from '$lib/components/Chat.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const roomId = $derived(+page.params.id);
	const messages = $derived(data.messages);
</script>

<Chat {roomId} {messages} userId={data.userId} doShowSenderName={false} />
