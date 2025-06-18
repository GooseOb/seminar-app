<script lang="ts">
	import { page } from '$app/state';
	import FileList from '$lib/components/FileList.svelte';
	import type { PageProps } from './$types';
	import * as m from '$lib/paraglide/messages';

	const { data }: PageProps = $props();
</script>

<div class="page">
	{#await data.files}
		<p>{m.loadingFiles()}</p>
	{:then files}
		<FileList {files} roomId={+page.params.id} />
	{/await}
</div>

<style>
	.page {
		padding-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
