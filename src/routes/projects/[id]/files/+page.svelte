<script lang="ts">
	import { page } from '$app/state';
	import FileList from '$lib/components/FileList.svelte';
	import Thesis from '$lib/components/Thesis.svelte';
	import type { FileData } from '$lib/server/files';
	import type { PageProps } from './$types';
	import * as m from '$lib/paraglide/messages';

	const { data }: PageProps = $props();
	let versions: FileData[] = $state([]);
	const files = $derived(
		data.files.then((files) =>
			files.filter((file) => {
				if (file.name.startsWith('thesis/')) {
					versions.push(file);
					return false;
				}
				return true;
			})
		)
	);
</script>

<div class="page">
	{#await files}
		<p>{m.loadingThesis()}</p>
	{:then}
		<Thesis roomId={page.params.id} role={data.role!} bind:versions />
	{/await}

	{#await files}
		<p>{m.loadingFiles()}</p>
	{:then files}
		<FileList {files} roomId={page.params.id} />
	{/await}
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
