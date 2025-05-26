<script lang="ts">
	import { page } from '$app/state';
	import FileList from '$lib/components/FileList.svelte';
	import Thesis from '$lib/components/Thesis.svelte';
	import type { FileData } from '$lib/server/files';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const thesis: FileData[] = $state([]);
	const files = $derived(
		data.files.then((files) =>
			files.filter((file) => {
				if (file.name.startsWith('thesis/')) {
					thesis.push(file);
					return false;
				}
				return true;
			})
		)
	);
</script>

<div class="page">
	{#await files}
		<p>Loading...</p>
	{:then}
		<Thesis roomId={page.params.id} role={data.role!} data={thesis} />
	{/await}

	{#await files}
		<p>Loading...</p>
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
