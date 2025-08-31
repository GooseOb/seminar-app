<script lang="ts">
	import { page } from '$app/state';
	import FileList from '$lib/components/FileList.svelte';
	import Thesis from '$lib/components/Thesis.svelte';
	import type { FileData } from '$lib/server/files';
	import type { PageProps } from './$types';
	import * as m from '$lib/paraglide/messages';

	const { data }: PageProps = $props();
	let files: null | FileData[] = $state(null);
	let versions: null | FileData[] = $state(null);
	$effect(() => {
		data.files.then((data) => {
			files = data.files;
			versions = data.versions;
		});
	});

	const roomId = $derived(+page.params.id!);
</script>

<div class="page">
	{#if versions}
		<Thesis {roomId} role={data.role!} bind:versions />
	{:else}
		<p>{m.loadingThesis()}</p>
	{/if}

	{#if files}
		<FileList {files} {roomId} />
	{:else}
		<p>{m.loadingFiles()}</p>
	{/if}
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
