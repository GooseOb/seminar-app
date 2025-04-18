<script lang="ts">
import Chat from '$lib/components/Chat.svelte';
import type { PageProps } from './$types';

const { data }: PageProps = $props();
</script>

<Chat messages={data.messages} />
