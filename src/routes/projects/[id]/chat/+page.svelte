<script lang="ts">
	import { page } from '$app/state';
	import Chat from '$lib/components/Chat.svelte';
	import type { PageProps } from './$types';
	import * as m from '$lib/paraglide/messages';

	const { data }: PageProps = $props();
	const roomId = $derived(+page.params.id);
	const messages = $derived(data.messages);
</script>

<Chat {roomId} {messages} userId={data.userId} doShowSenderName={false}>
	{#snippet getMessageView({ text })}
		{#if text.startsWith('/reviewed ')}
			<span class="reviewed">
				{text.replace(/^\/reviewed (\d+)$/, (_$0, $1) =>
					m.reviewed({ version: new Date(+$1).toLocaleString() })
				)}
			</span>
		{:else}
			{text}
		{/if}
	{/snippet}
</Chat>

<style>
	.reviewed {
		font-style: italic;
		font-weight: bold;
	}
</style>
